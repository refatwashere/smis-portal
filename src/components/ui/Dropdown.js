import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Dropdown = ({ children, trigger, className = '' }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {trigger}
        <ChevronDown className="ml-2 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${className}`}
      role="menuitem"
    >
      {children}
    </button>
  );
};
