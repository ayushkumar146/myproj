/**
 * This file serves as a centralized store for all request bodies used in the Camunda process steps.
 */

export const taskRequestBodies = {
  // Currently, all forms use a default structure. 
  // You can add specific task names here later if they need unique fields.
  "default": {
    "go_next": true
  }
};

/**
 * Helper to get a prepared request body merged with submitted data.
 * Even if a task name is not explicitly defined, it will always include "go_next": true.
 * 
 * @param {string} taskName 
 * @param {object} formData 
 * @returns {object}
 */
export const preparePayload = (taskName, formData) => {
  // Use specific task body if it exists, otherwise use empty object
  const baseBody = taskRequestBodies[taskName] || {};
  
  return {
    ...baseBody,
    ...formData,
    "go_next": true // Ensured by default for every form as requested
  };
};
