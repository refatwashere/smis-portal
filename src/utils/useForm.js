import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const validateForm = useCallback((validations = {}) => {
    const newErrors = {};
    let isValid = true;

    Object.entries(validations).forEach(([fieldName, validation]) => {
      const value = values[fieldName];
      const error = validation(value, values);
      
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setFieldValue,
    setFieldError,
    setValues,
    setErrors,
    setIsSubmitting,
    validateForm,
    resetForm
  };
};
