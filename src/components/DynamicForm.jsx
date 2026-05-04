import React, { useEffect, useRef } from 'react';
import { Form } from '@bpmn-io/form-js';

// Import form-js styles
import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-base.css';

const DynamicForm = ({ schema, processVariables, onFormSubmit }) => {
  const formElementRef = useRef(null);

  useEffect(() => {
    let formInstance = null;
    let isMounted = true;

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
          container: formElementRef.current
        });

        if (!isMounted) {
          form.destroy();
          return;
        }

        formInstance = form;

        // bpmn-io form-js expects the schema object directly
        await form.importSchema(schema.form, processVariables);

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
