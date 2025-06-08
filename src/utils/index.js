// Export all utility functions from a single entry point
export * from './api';
export * from './validations';
export * from './helpers';
export { useForm } from './useForm';
export { useConfirm } from './useConfirm';

// Utility functions
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
