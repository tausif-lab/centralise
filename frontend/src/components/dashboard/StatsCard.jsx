import React from 'react';

const StatsCard = ({ title, value, icon, color = 'primary', trend }) => {
  const colorClasses = {
    primary: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100 text-blue-600',
      border: 'border-blue-200',
      trend: 'text-blue-600'
    },
    success: {
      bg: 'bg-emerald-50',
      icon: 'bg-emerald-100 text-emerald-600',
      border: 'border-emerald-200',
      trend: 'text-emerald-600'
    },
    warning: {
      bg: 'bg-amber-50',
      icon: 'bg-amber-100 text-amber-600',
      border: 'border-amber-200',
      trend: 'text-amber-600'
    },
    danger: {
      bg: 'bg-rose-50',
      icon: 'bg-rose-100 text-rose-600',
      border: 'border-rose-200',
      trend: 'text-rose-600'
    },
  };

  const styles = colorClasses[color];

  return (
    <div className={`bg-white border ${styles.border} rounded-2xl p-7 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-5">
        <div className={`p-4 rounded-xl ${styles.icon} shadow-sm`}>
          {icon}
        </div>
      </div>
      
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {title}
        </p>
        <p className="text-4xl font-bold text-gray-900 mb-4">
          {value}
        </p>
        {trend && (
          <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${styles.bg}`}>
            <span className="mr-1.5">{trend.positive ? '↑' : '↓'}</span>
            <span className={styles.trend}>{trend.value}</span>
            <span className="ml-1.5 text-gray-600">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;