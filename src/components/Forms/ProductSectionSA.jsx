import React, { useState } from 'react';
import './ProductSectionSA.css';

// Using mock options for selects based on the schema
const MOCK_OPTIONS = [
  { label: 'Value', value: 'value' },
  { label: 'Option 2', value: 'option2' }
];

const ProductSectionSA = ({ onFormSubmit, processVariables }) => {
  // ── Helper to resolve a value from processVariables ───────────────────────
  const getProcessVar = (path, defaultValue = '') => {
    if (!processVariables) return defaultValue;
    if (processVariables[path] !== undefined && processVariables[path] !== null)
      return processVariables[path];

    const parts = path.split('.');
    let current = processVariables;
    let found = true;
    for (const part of parts) {
      if (current && typeof current === 'object' && current[part] !== undefined && current[part] !== null) {
        current = current[part];
      } else { found = false; break; }
    }
    if (found) return current;

    const leafKey = parts[parts.length - 1];
    const recursiveFind = (obj, key) => {
      if (!obj || typeof obj !== 'object') return undefined;
      const lk = key.toLowerCase();
      const fk = Object.keys(obj).find(k => k.toLowerCase() === lk);
      if (fk !== undefined && obj[fk] !== undefined && obj[fk] !== null) return obj[fk];
      for (const k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          const v = recursiveFind(obj[k], key);
          if (v !== undefined) return v;
        }
      }
      return undefined;
    };
    const v = recursiveFind(processVariables, leafKey);
    return v !== undefined ? v : defaultValue;
  };
  // ─────────────────────────────────────────────────────────────────────────

  // ── Initial values from processVariables (computed once on mount) ──────────
  const _branch     = getProcessVar('productSection.branch')     || getProcessVar('branch')     || '';
  const _product    = getProcessVar('productSection.product')    || getProcessVar('product')    || '';
  const _debitCards = getProcessVar('productSection.debitCards') || getProcessVar('debitCards') || '';
  const _promo      = getProcessVar('productSection.promo')      || getProcessVar('promo')      || '';
  const _cbcCode    = getProcessVar('productSection.cbcCode')    || getProcessVar('cbcCode')    || '';
  // ─────────────────────────────────────────────────────────────────────────

  // ── Editable state ────────────────────────────────────────────────────────
  const [branch,     setBranch]     = useState(_branch);
  const [product,    setProduct]    = useState(_product);
  const [debitCards, setDebitCards] = useState(_debitCards);
  const [promo,      setPromo]      = useState(_promo);
  const [cbcCode,    setCbcCode]    = useState(_cbcCode);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched,      setTouched]      = useState({});
  // ─────────────────────────────────────────────────────────────────────────

  // ── Validation (derived) ──────────────────────────────────────────────────
  const errors = React.useMemo(() => {
    const e = {};
    if (!branch.trim())     e.branch     = 'Branch is required';
    if (!product)           e.product    = 'Please select a Product';
    if (!debitCards)        e.debitCards = 'Please select Debit Cards';
    if (!promo)             e.promo      = 'Please select a Promo';
    if (!cbcCode.trim())    e.cbcCode    = 'CBC Code is required';
    return e;
  }, [branch, product, debitCards, promo, cbcCode]);

  const isFormValid = Object.keys(errors).length === 0;

  const touch = (field) => setTouched(prev => ({ ...prev, [field]: true }));
  const showError = (field) => touched[field] && errors[field];
  // ─────────────────────────────────────────────────────────────────────────

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all as touched to show all errors
    const allTouched = Object.fromEntries(
      ['branch', 'product', 'debitCards', 'promo', 'cbcCode'].map(k => [k, true])
    );
    setTouched(allTouched);
    
    if (!isFormValid) return;

    setIsSubmitting(true);
    const payload = {
      productSection: {
        branch,
        product,
        debitCards,
        promo,
        cbcCode,
        fieldCount: '5',
      },
      fieldCount: '5',
    };
    onFormSubmit(payload);
  };

  return (
    <div className="pd-container">
      <div className="pd-card">
        <header className="pd-header">
          <h2 className="pd-title">Product Section</h2>
          
        </header>

        <form onSubmit={handleSubmit} className="pd-form" noValidate>
          <p className="pd-subtitle">Product details are as follows</p>
          <div className="pd-form-bordered">
           
            {/* Branch */}
            <div className="pd-form-group">
              <label className="pd-label">Branch <span className="pd-req">*</span></label>
              <input
                type="text"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                onBlur={() => touch('branch')}
                placeholder="Enter branch name"
                className={`pd-input ${showError('branch') ? 'pd-input-error' : ''}`}
              />
              {showError('branch') && <span className="pd-error-msg">{errors.branch}</span>}
            </div>

            {/* Product */}
            <div className="pd-form-group">
              <label className="pd-label">Product <span className="pd-req">*</span></label>
              <div className="pd-select-wrapper">
                <select
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  onBlur={() => touch('product')}
                  className={`pd-select ${!product ? 'pd-select-placeholder' : ''} ${showError('product') ? 'pd-input-error' : ''}`}
                >
                  <option value="">Select product</option>
                  {MOCK_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="pd-select-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
              {showError('product') && <span className="pd-error-msg">{errors.product}</span>}
            </div>

            {/* Debit Cards */}
            <div className="pd-form-group">
              <label className="pd-label">Debit Cards <span className="pd-req">*</span></label>
              <div className="pd-select-wrapper">
                <select
                  value={debitCards}
                  onChange={e => setDebitCards(e.target.value)}
                  onBlur={() => touch('debitCards')}
                  className={`pd-select ${!debitCards ? 'pd-select-placeholder' : ''} ${showError('debitCards') ? 'pd-input-error' : ''}`}
                >
                  <option value="">Select debit cards</option>
                  {MOCK_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="pd-select-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
              {showError('debitCards') && <span className="pd-error-msg">{errors.debitCards}</span>}
            </div>

            {/* Promo */}
            <div className="pd-form-group">
              <label className="pd-label">Promo <span className="pd-req">*</span></label>
              <div className="pd-select-wrapper">
                <select
                  value={promo}
                  onChange={e => setPromo(e.target.value)}
                  onBlur={() => touch('promo')}
                  className={`pd-select ${!promo ? 'pd-select-placeholder' : ''} ${showError('promo') ? 'pd-input-error' : ''}`}
                >
                  <option value="">Select promo</option>
                  {MOCK_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="pd-select-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
              {showError('promo') && <span className="pd-error-msg">{errors.promo}</span>}
            </div>

            {/* CBC Code */}
            <div className="pd-form-group">
              <label className="pd-label">CBC Code <span className="pd-req">*</span></label>
              <input
                type="text"
                value={cbcCode}
                onChange={e => setCbcCode(e.target.value)}
                onBlur={() => touch('cbcCode')}
                placeholder="Enter CBC Code"
                className={`pd-input ${showError('cbcCode') ? 'pd-input-error' : ''}`}
              />
              {showError('cbcCode') && <span className="pd-error-msg">{errors.cbcCode}</span>}
            </div>

          </div>{/* end .pd-form-bordered */}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="pd-submit-btn"
          >
            {isSubmitting ? 'Processing...' : 'Proceed'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProductSectionSA;
