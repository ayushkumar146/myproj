import React, { useEffect, useRef } from 'react';
import { Form } from '@bpmn-io/form-js';

// bpmn-io base CSS — must load before our overrides
import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-base.css';

// ─────────────────────────────────────────────────────────────────────────────
// Build a flat map of { fieldId → placeholder } from the entire schema tree.
// form-js renders inputs with id="fjs-form-XXXX-{fieldId}", so we key by id.
// ─────────────────────────────────────────────────────────────────────────────
const buildPlaceholderMap = (node, map = {}) => {
  if (!node || typeof node !== 'object') return map;

  if (Array.isArray(node)) {
    node.forEach(child => buildPlaceholderMap(child, map));
    return map;
  }

  // If this node is a field with an id and a properties.placeholder, record it
  if (node.id && node.properties && node.properties.placeholder) {
    map[node.id] = node.properties.placeholder;
  }

  // Recurse into every child regardless of the key name
  for (const k of Object.keys(node)) {
    if (k !== 'properties') {
      buildPlaceholderMap(node[k], map);
    }
  }

  return map;
};

// ─────────────────────────────────────────────────────────────────────────────
// After form-js renders, find every input/textarea using [id*="fieldId"]
// since form-js sets id="fjs-form-XXXXX-{fieldId}" on each rendered input.
// ─────────────────────────────────────────────────────────────────────────────
const applyPlaceholdersToDom = (container, placeholderMap, processVariables = {}) => {
  if (!container || !Object.keys(placeholderMap).length) return;

  for (const [fieldId, placeholder] of Object.entries(placeholderMap)) {
    // form-js input id pattern: "fjs-form-<randomId>-<fieldId>"
    const el = container.querySelector(`input[id*="${fieldId}"], textarea[id*="${fieldId}"]`);
    if (el) {
      el.setAttribute('placeholder', placeholder);
    } else {
      console.warn(`[DynamicForm] Could not find input for fieldId: "${fieldId}"`);
    }
  }

  // 2. Mark pre-filled fields
  const allInputs = container.querySelectorAll('input:not([type="hidden"]), textarea, select');
  
  // Helper to find value in nested objects
  const getNestedValue = (obj, key) => {
    if (!obj || !key) return undefined;
    if (obj[key] !== undefined) return obj[key];
    for (const k in obj) {
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        const val = getNestedValue(obj[k], key);
        if (val !== undefined) return val;
      }
    }
    return undefined;
  };

  allInputs.forEach(input => {
    // form-js uses 'name' or 'id' (which looks like fjs-form-X-fieldKey)
    const nameKey = input.name || '';
    
    // Try to extract fieldKey from id: "fjs-form-abcde-fieldKey" -> "fieldKey"
    const idParts = (input.id || '').split('-');
    const idKey = idParts.length > 0 ? idParts[idParts.length - 1] : '';

    const initialVal = getNestedValue(processVariables, nameKey) || getNestedValue(processVariables, idKey);
    const hasInitialData = (initialVal !== undefined && initialVal !== '');
    const hasCurrentValue = input.value && input.value !== '';
    
    if (hasInitialData || hasCurrentValue) {
      console.log(`[DynamicForm] Styling pre-filled field: ${nameKey || idKey}`, { val: initialVal || input.value });
      input.classList.add('fjs-prefilled');
    }
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Schema pre-processor: cleans up junk labels
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_LABEL_RE = /^(checkbox|radio)[\s*]*$/i;

const preprocessSchema = (rawSchema) => {
  if (!rawSchema) return rawSchema;
  const schema = JSON.parse(JSON.stringify(rawSchema));

  const walk = (node) => {
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map(walk);

    if (node.type || node.key) {
      if (DEFAULT_LABEL_RE.test((node.label ?? '').trim())) {
        node.label = '';
      }
    }

    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        node[key] = walk(node[key]);
      }
    }
    return node;
  };

  return walk(schema);
};

// ─────────────────────────────────────────────────────────────────────────────
// OTP Logic: For the OTP form, we transform the single input into 6 boxes.
// ─────────────────────────────────────────────────────────────────────────────
const setupOtpFields = (container) => {
  if (!container) return;

  // Find all potential text/number inputs
  const allInputs = container.querySelectorAll('input[type="text"], input[type="number"], input:not([type])');

  allInputs.forEach(otpInput => {
    // Check if this input belongs to an OTP field (by name, id, or associated label)
    const label = container.querySelector(`label[for="${otpInput.id}"]`)?.textContent || '';
    const isOtp = /otp/i.test(otpInput.name || '') ||
      /otp/i.test(otpInput.id || '') ||
      /otp/i.test(label);

    if (!isOtp || otpInput.dataset.otpInitialized) return;

    const parent = otpInput.parentElement;
    if (!parent) return;

    console.log('[DynamicForm] Transforming field to OTP boxes:', label || otpInput.name);

    // Mark as initialized to prevent loops
    otpInput.dataset.otpInitialized = 'true';
    otpInput.type = 'hidden'; // Use hidden instead of display:none to keep it in the flow for lib
    otpInput.style.display = 'none';

    // Create container for the 6 boxes
    const boxesContainer = document.createElement('div');
    boxesContainer.className = 'otp-boxes-container';

    const inputs = [];
    for (let i = 0; i < 6; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'otp-digit-box';
      input.inputMode = 'numeric';
      input.autocomplete = 'one-time-code';

      input.addEventListener('input', (e) => {
        const val = e.target.value;
        // Only allow digits
        if (val && !/^\d$/.test(val)) {
          e.target.value = '';
          return;
        }
        if (val && i < 5) {
          inputs[i + 1].focus();
        }
        syncValue();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && i > 0) {
          inputs[i - 1].focus();
        }
      });

      inputs.push(input);
      boxesContainer.appendChild(input);
    }

    const syncValue = () => {
      otpInput.value = inputs.map(i => i.value).join('');
      // Trigger bpmn-io's change detection
      otpInput.dispatchEvent(new Event('input', { bubbles: true }));
    };

    parent.appendChild(boxesContainer);
  });
};

// ─────────────────────────────────────────────────────────────────────────────

const DynamicForm = ({ schema, processVariables, onFormSubmit }) => {
  const formElementRef = useRef(null);

  useEffect(() => {
    let formInstance = null;
    let isMounted = true;
    let observer = null;

    const initForm = async () => {
      if (!schema || !schema.form || !formElementRef.current) return;

      if (formElementRef.current.querySelector('.fjs-container')) {
        console.log('bpmn-io Form already initialized, skipping...');
        return;
      }

      console.log('Initializing bpmn-io Form...', schema.taskName);
      formElementRef.current.innerHTML = '';

      // Build placeholder map BEFORE rendering
      const placeholderMap = buildPlaceholderMap(schema.form);

      try {
        const form = new Form({ container: formElementRef.current });

        if (!isMounted) { form.destroy(); return; }
        formInstance = form;

        const cleanSchema = preprocessSchema(schema.form);
        await form.importSchema(cleanSchema, processVariables);

        // ── Stamp placeholders and OTP setup ──
        const applyExtras = () => {
          applyPlaceholdersToDom(formElementRef.current, placeholderMap, processVariables);
          // Auto-detect OTP fields based on label or key
          setupOtpFields(formElementRef.current);
        };

        setTimeout(applyExtras, 200);

        // ── Re-apply on any DOM change (conditional fields appearing) ──
        observer = new MutationObserver(() => {
          applyExtras();
        });
        observer.observe(formElementRef.current, {
          childList: true,
          subtree: true,
        });

        form.on('submit', (event) => {
          const { data, errors } = event;
          console.log('bpmn-io Form Submission:', data, errors);
          if (Object.keys(errors).length === 0 && onFormSubmit) {
            onFormSubmit(data);
          }
        });
      } catch (err) {
        console.error('bpmn-io Form initialization error:', err);
      }
    };

    initForm();

    return () => {
      isMounted = false;
      if (observer) { observer.disconnect(); observer = null; }
      if (formInstance) { formInstance.destroy(); formInstance = null; }
    };
  }, [schema, processVariables, onFormSubmit]);

  if (!schema || !schema.form) {
    return (
      <div className="dynamic-form-container">
        <p>No valid form schema found.</p>
      </div>
    );
  }

  const containerClass = `dynamic-form-container ${schema.formKey || ''}`;

  return (
    <div className={containerClass}>
      <div ref={formElementRef} className="fjs-form-container"></div>
    </div>
  );
};

export default DynamicForm;
