import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  title, 
  subtitle,
  action,
  hoverable = false 
}) => {
  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-200 p-8
        ${hoverable ? 'hover:shadow-md transition-shadow duration-300' : ''}
        ${className}
      `}
    >
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div>
            {title && <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default Card;