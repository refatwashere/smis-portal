import React from 'react';
import { Calendar, Users, BookOpen } from 'lucide-react';

const iconMap = {
  calendar: Calendar,
  users: Users,
  bookOpen: BookOpen
};

const Input = ({
  label,
  error,
  icon = '',
  className = '',
  ...props
}) => {
  const Icon = iconMap[icon];
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        <input
          className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className} ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${icon ? 'pl-10' : ''}`}
          {...Object.entries(props).reduce((acc, [key, value]) => {
            if (['id', 'name', 'value', 'onChange', 'placeholder', 'type', 'disabled', 'required'].includes(key)) {
              acc[key] = value;
            }
            return acc;
          }, {})}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
