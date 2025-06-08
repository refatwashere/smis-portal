import { useState, useCallback } from 'react';

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDestructive: false,
    onConfirm: null
  });

  const confirm = useCallback(({
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
    onConfirm = () => {}
  } = {}) => {
    return new Promise((resolve) => {
      setConfig({
        title,
        message,
        confirmText,
        cancelText,
        isDestructive,
        onConfirm: () => {
          onConfirm();
          resolve(true);
        }
      });
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = () => {
    if (config.onConfirm) {
      config.onConfirm();
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    confirm,
    handleConfirm,
    handleCancel,
    config
  };
};
