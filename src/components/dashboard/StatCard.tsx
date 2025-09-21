import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
  action?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, action }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="bg-red-100 text-red-600 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500 flex-grow">
        {change && (
          <p className={changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
            {change}
          </p>
        )}
        <div className="ml-auto">
          {action}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
