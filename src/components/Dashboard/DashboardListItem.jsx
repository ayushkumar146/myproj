import React from 'react';
import { ChevronRight } from 'lucide-react';

const DashboardListItem = ({ label }) => {
  return (
    <div className="list-item">
      <span>{label}</span>
      <ChevronRight />
    </div>
  );
};

export default DashboardListItem;
