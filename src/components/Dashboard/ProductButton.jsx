import React from 'react';
import { FileText } from 'lucide-react';

const ProductButton = ({ label, onClick }) => {
  return (
    <button className="product-btn" onClick={onClick}>
      <div className="product-icon">
        <FileText />
      </div>
      <span className="product-label">{label}</span>
    </button>
  );
};

export default ProductButton;
