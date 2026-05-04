import React from 'react';
import { BarChart3 } from 'lucide-react';

const StatCard = ({ label, value, fullWidth }) => {
  return (
    <div className={`stat-card ${fullWidth ? 'full-width' : ''}`}>
      <div className="icon-wrapper">
        <BarChart3 />
      </div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
};

export default StatCard;
