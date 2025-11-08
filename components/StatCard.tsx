
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, unit }) => {
  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg flex flex-col justify-between">
      <h3 className="text-sm font-medium text-text-secondary uppercase">{title}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold text-text-primary">{value}</span>
        {unit && <span className="ml-2 text-text-secondary">{unit}</span>}
      </div>
    </div>
  );
};
