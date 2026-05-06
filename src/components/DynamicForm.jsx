import React, { useEffect, useRef } from 'react';
import { Form } from '@bpmn-io/form-js';

// bpmn-io styles are imported globally in main.jsx to ensure our overrides win

// ─────────────────────────────────────────────────────────────────────────────
// Schema pre-processor
//
// Recursively walks every component in the Camunda form schema BEFORE it is
// handed to bpmn-io.  Any component whose `label` is the literal default type
// name ("Checkbox" / "Radio") gets its label cleared so bpmn-io never renders
// that placeholder text at all.
//
// This is reliable because it operates on the data, not the DOM — no timing or
// CSS specificity problems are possible.
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_LABEL_RE = /^(checkbox|radio)[\s*]*$/i;

const preprocessSchema = (rawSchema) => {
  // Deep-clone so we never mutate the original prop
  const schema = JSON.parse(JSON.stringify(rawSchema));

  const walkComponents = (components) => {
    if (!Array.isArray(components)) return components;
    return components.map((comp) => {
      // Clear the label if it is just the type name placeholder
      if (DEFAULT_LABEL_RE.test((comp.label ?? '').trim())) {
        comp.label = '';
      }
      // Recurse into nested layouts / groups
      if (comp.components) {
        comp.components = walkComponents(comp.components);
      }
      return comp;
    });
  };

  if (schema.components) {
    schema.components = walkComponents(schema.components);
  }
  return schema;
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

      // Prevent duplicate initialization
      if (formElementRef.current.querySelector('.fjs-container')) {
        console.log('bpmn-io Form already initialized, skipping...');
        return;
      }

      console.log('Initializing bpmn-io Form...', schema.taskName);

      // Clear previous content
      formElementRef.current.innerHTML = '';

      try {
        const form = new Form({
          container: formElementRef.current,
        });

        if (!isMounted) {
          form.destroy();
          return;
        }

        formInstance = form;

        // ── Pre-process the schema to strip default "Checkbox"/"Radio" labels ──
        const cleanSchema = preprocessSchema(schema.form);

        await form.importSchema(cleanSchema, processVariables);

        // Watch for conditional fields that bpmn-io may add later
        observer = new MutationObserver(() => {
          // No DOM cleanup needed — labels are already cleared in the schema
        });
        observer.observe(formElementRef.current, {
          childList: true,
          subtree: true,
          characterData: true,
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
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (formInstance) {
        formInstance.destroy();
        formInstance = null;
      }
    };
  }, [schema, processVariables, onFormSubmit]);

  if (!schema || !schema.form) {
    return (
      <div className="dynamic-form-container">
        <p>No valid form schema found.</p>
      </div>
    );
  }

  return (
    <div className="dynamic-form-container">
      {/* Container for bpmn-io form-js to render into */}
      <div ref={formElementRef} className="fjs-form-container"></div>
    </div>
  );
};

export default DynamicForm;
