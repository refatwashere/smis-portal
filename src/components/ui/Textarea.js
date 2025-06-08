import React from 'react';

const Textarea = ({
  className = '',
  error = false,
  disabled = false,
  ...props
}) => {
  return (
    <textarea
      className={`
        min-h-[60px]
        block
        w-full
        rounded-md
        border-0
        py-1.5
        text-gray-900
        shadow-sm
        ring-1
        ring-inset
        ${error ? 'ring-red-300' : 'ring-gray-300'}
        placeholder:text-gray-400
        focus:ring-2
        focus:ring-inset
        ${error ? 'focus:ring-red-500' : 'focus:ring-blue-600'}
        sm:text-sm
        sm:leading-6
        ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    />
  );
};

export default Textarea;
export { Textarea };
