import React from 'react';
import PropTypes from 'prop-types';
import { ClipboardList, BookOpen, Users, AlertCircle } from 'lucide-react';

const iconMap = {
  default: ClipboardList,
  class: BookOpen,
  student: Users,
  warning: AlertCircle
};

const EmptyState = ({
  title = 'No data available',
  description = 'Get started by adding new items.',
  action,
  icon = 'default',
  className = ''
}) => {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] || iconMap.default : icon;
  
  return (
    <div className={`text-center ${className}`}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <IconComponent className="h-6 w-6 text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  action: PropTypes.node,
  icon: PropTypes.oneOfType([
    PropTypes.oneOf(Object.keys(iconMap)),
    PropTypes.elementType
  ]),
  className: PropTypes.string
};

export default EmptyState;
