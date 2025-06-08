import React from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

export const Dialog = ({ children, open, onClose, ...props }) => {
  return (
    <Transition.Root show={open} as={React.Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={onClose} {...props}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <HeadlessDialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  );
};

export const DialogHeader = ({ children }) => {
  return (
    <div className="absolute right-0 top-0 -mr-2 -mt-2">
      {children}
    </div>
  );
};

export const DialogTitle = ({ children, className = '' }) => {
  return (
    <HeadlessDialog.Title as="h3" className={`text-lg font-medium leading-6 text-gray-900 ${className}`}>
      {children}
    </HeadlessDialog.Title>
  );
};

export const DialogDescription = ({ children, className = '' }) => {
  return (
    <div className={`mt-2 text-sm text-gray-500 ${className}`}>
      {children}
    </div>
  );
};

export const DialogContent = ({ children, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export const DialogFooter = ({ children, className = '' }) => {
  return (
    <div className={`mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3 ${className}`}>
      {children}
    </div>
  );
};
