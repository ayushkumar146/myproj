/**
 * This file serves as a centralized store for all request bodies used in the Camunda process steps.
 */

export const taskRequestBodies = {
  // Currently, the request body is generated dynamically based on the form's paths/groups.
  // You can define default values here for specific tasks if needed.
  "default": {
    "go_next": true
  }
};

/**
 * Helper to get a prepared request body merged with submitted data.
 * The formData now includes the native pathing (e.g. { "validate": { "name": "..." } })
 * as defined in the Camunda schema.
 * 
 * @param {string} taskName 
 * @param {object} formData 
 * @returns {object}
 */
export const preparePayload = (taskName, formData) => {
  const baseBody = taskRequestBodies[taskName] || {};
  
  return {
    ...baseBody,
    ...formData,
    "go_next": true
  };
};
