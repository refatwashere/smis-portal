/**
 * Common validation functions for form fields
 */

export const required = (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'This field is required';
  }
  return null;
};

export const minLength = (min) => (value) => {
  if (value && value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return null;
};

export const maxLength = (max) => (value) => {
  if (value && value.length > max) {
    return `Must be no more than ${max} characters`;
  }
  return null;
};

export const email = (value) => {
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return 'Invalid email address';
  }
  return null;
};

export const password = (value) => {
  if (!value) return null;
  
  const errors = [];
  
  if (value.length < 8) {
    errors.push('At least 8 characters');
  }
  if (!/[A-Z]/.test(value)) {
    errors.push('At least one uppercase letter');
  }
  if (!/[a-z]/.test(value)) {
    errors.push('At least one lowercase letter');
  }
  if (!/[0-9]/.test(value)) {
    errors.push('At least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    errors.push('At least one special character');
  }
  
  return errors.length > 0 ? errors : null;
};

export const match = (fieldName, getValues) => (value) => {
  const values = getValues();
  return value === values[fieldName] ? null : 'Passwords do not match';
};

/**
 * Creates a validation function that runs multiple validators
 * @param {Array<Function>} validators - Array of validator functions
 * @returns {Function} A function that runs all validators and returns the first error
 */
export const composeValidators = (...validators) => (value, allValues) => {
  for (const validator of validators) {
    if (typeof validator !== 'function') continue;
    
    const error = validator(value, allValues);
    if (error) {
      return error;
    }
  }
  return null;
};

// Common validation schemas
export const validationSchemas = {
  email: composeValidators(required, email),
  password: composeValidators(required, password),
  name: composeValidators(required, minLength(2), maxLength(100)),
  phone: composeValidators(required, minLength(10), maxLength(15)),
  className: composeValidators(required, minLength(2), maxLength(100)),
  studentName: composeValidators(required, minLength(2), maxLength(100)),
  studentIdentifier: composeValidators(required, minLength(2), maxLength(50)),
  updateText: composeValidators(required, minLength(10), maxLength(1000)),
};

/**
 * Validates a form based on a schema
 * @param {Object} values - Form values
 * @param {Object} schema - Validation schema { fieldName: validatorFunction }
 * @returns {Object} Object with errors { fieldName: errorMessage }
 */
export const validateForm = (values, schema) => {
  const errors = {};
  
  Object.entries(schema).forEach(([field, validator]) => {
    if (typeof validator === 'function') {
      const error = validator(values[field], values);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};

/**
 * Checks if a form is valid based on errors object
 * @param {Object} errors - Errors object from form validation
 * @returns {boolean} True if no errors, false otherwise
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
