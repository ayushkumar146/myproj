import React, { useState } from 'react';
import './PersonalDetailsSA.css';

const ANNUAL_INCOME_OPTIONS = [
  { label: 'Less than 2 LPA', value: 'Less than 2 LPA' },
  { label: '2-5 LPA',          value: '2-5 LPA' },
  { label: '5-10 LPA',         value: '5-10 LPA' },
  { label: 'More than 10 LPA', value: 'More than 10 LPA' },
];

const OCCUPATION_OPTIONS = [
  { label: 'Salaried',           value: 'Salaried' },
  { label: 'Self Employed',      value: 'Self Employed' },
  { label: 'Business',           value: 'Business' },
  { label: 'Agriculture',        value: 'Agriculture' },
  { label: 'Retired',            value: 'Retired' },
  { label: 'Homemaker',          value: 'Homemaker' },
  { label: 'Student',            value: 'Student' },
  { label: 'Professional',       value: 'Professional' },
];

const INCOME_SOURCE_OPTIONS = [
  { label: 'Salary',             value: 'Salary' },
  { label: 'Business',           value: 'Business' },
  { label: 'Rental Income',      value: 'Rental Income' },
  { label: 'Agriculture',        value: 'Agriculture' },
  { label: 'Investment',         value: 'Investment' },
  { label: 'Pension',            value: 'Pension' },
  { label: 'Other',              value: 'Other' },
];

const PersonalDetailsSA = ({ onFormSubmit, processVariables }) => {
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
  const _name             = getProcessVar('personalDetails.name')             || getProcessVar('name')             || '';
  const _motherMaidan     = getProcessVar('personalDetails.motherMaidanName') || getProcessVar('motherMaidanName') || '';
  const _motherMaidanCnf  = getProcessVar('personalDetails.motherMaidanNameCnf') || getProcessVar('motherMaidanNameCnf') || '';
  const _fatherName       = getProcessVar('personalDetails.fatherName')       || getProcessVar('fatherName')       || '';
  const _maritalStatus    = getProcessVar('personalDetails.maritalStatus')    || getProcessVar('maritalStatus')    || '';
  const _annualIncome     = getProcessVar('personalDetails.annualIncome')     || getProcessVar('annualIncome')     || '';
  const _occupation       = getProcessVar('personalDetails.occupation')       || getProcessVar('occupation')       || '';
  const _incomeSource     = getProcessVar('personalDetails.incomeSource')     || getProcessVar('incomeSource')     || '';
  const _riskCategory     = getProcessVar('personalDetails.riskCategory')     || getProcessVar('riskCategory')     || 'LOW';
  // ─────────────────────────────────────────────────────────────────────────

  // ── Editable state ────────────────────────────────────────────────────────
  const [name,            setName]            = useState(_name);
  const [motherMaidan,    setMotherMaidan]    = useState(_motherMaidan);
  const [motherMaidanCnf, setMotherMaidanCnf] = useState(_motherMaidanCnf);
  const [fatherName,      setFatherName]      = useState(_fatherName);
  const [maritalStatus,   setMaritalStatus]   = useState(_maritalStatus);
  const [annualIncome,    setAnnualIncome]    = useState(_annualIncome);
  const [occupation,      setOccupation]      = useState(_occupation);
  const [incomeSource,    setIncomeSource]    = useState(_incomeSource);
  const [riskCategory,    setRiskCategory]    = useState(_riskCategory);
  const [isSubmitting,    setIsSubmitting]    = useState(false);
  const [touched,         setTouched]         = useState({});
  // ─────────────────────────────────────────────────────────────────────────

  // ── Validation (derived) ──────────────────────────────────────────────────
  const errors = React.useMemo(() => {
    const e = {};
    if (!name.trim())           e.name           = 'Name on Debit Card is required';
    if (!motherMaidan.trim())   e.motherMaidan   = 'Mother Maiden Name is required';
    if (!motherMaidanCnf.trim()) e.motherMaidanCnf = 'Please confirm Mother Maiden Name';
    else if (motherMaidan.trim() && motherMaidan !== motherMaidanCnf)
      e.motherMaidanCnf = 'Both mother maiden names should be same.';
    if (!fatherName.trim())     e.fatherName     = 'Father Name is required';
    if (!maritalStatus)         e.maritalStatus  = 'Please select Marital Status';
    if (!annualIncome)          e.annualIncome   = 'Please select Annual Income';
    if (!occupation)            e.occupation     = 'Please select Occupation';
    if (!incomeSource)          e.incomeSource   = 'Please select Source of Income';
    if (!riskCategory.trim())   e.riskCategory   = 'Risk Category is required';
    return e;
  }, [name, motherMaidan, motherMaidanCnf, fatherName, maritalStatus, annualIncome, occupation, incomeSource, riskCategory]);

  const isFormValid = Object.keys(errors).length === 0;

  const touch = (field) => setTouched(prev => ({ ...prev, [field]: true }));
  const showError = (field) => touched[field] && errors[field];
  // ─────────────────────────────────────────────────────────────────────────

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all as touched to show all errors
    const allTouched = Object.fromEntries(
      ['name','motherMaidan','motherMaidanCnf','fatherName','maritalStatus','annualIncome','occupation','incomeSource','riskCategory']
        .map(k => [k, true])
    );
    setTouched(allTouched);
    if (!isFormValid) return;

    setIsSubmitting(true);
    const payload = {
      personalDetails: {
        name,
        motherMaidanName: motherMaidan,
        motherMaidanNameCnf: motherMaidanCnf,
        fatherName,
        maritalStatus,
        annualIncome,
        occupation,
        incomeSource: incomeSource,
        riskCategory,
        fieldCount: '9',
      },
      fieldCount: '9',
    };
    onFormSubmit(payload);
  };

  return (
    <div className="pd-container">
      <div className="pd-card">
        <header className="pd-header">
          <h2 className="pd-title">Personal Details</h2>
         
        </header>

        <form onSubmit={handleSubmit} className="pd-form" noValidate>
           <p className="pd-subtitle">Please Input Customers Personal Details</p>
          <div className="pd-form-bordered">

            {/* Name on Debit Card */}
            <div className="pd-form-group">
              <label className="pd-label">Name on Debit Card <span className="pd-req">*</span></label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => touch('name')}
                placeholder="Enter name as on debit card"
                className={`pd-input ${showError('name') ? 'pd-input-error' : ''}`}
              />
              {showError('name') && <span className="pd-error-msg">{errors.name}</span>}
            </div>

            {/* Mother Maiden Name */}
            <div className="pd-form-group">
              <label className="pd-label">Mother Maiden Name <span className="pd-req">*</span></label>
              <input
                type="text"
                value={motherMaidan}
                onChange={e => setMotherMaidan(e.target.value)}
                onBlur={() => touch('motherMaidan')}
                placeholder="Enter mother's maiden name"
                className={`pd-input ${showError('motherMaidan') ? 'pd-input-error' : ''}`}
              />
              {showError('motherMaidan') && <span className="pd-error-msg">{errors.motherMaidan}</span>}
            </div>

            {/* Confirm Mother Maiden Name */}
            <div className="pd-form-group">
              <label className="pd-label">Confirm Mother Maiden Name <span className="pd-req">*</span></label>
              <input
                type="text"
                value={motherMaidanCnf}
                onChange={e => setMotherMaidanCnf(e.target.value)}
                onBlur={() => touch('motherMaidanCnf')}
                placeholder="Re-enter mother's maiden name"
                className={`pd-input ${showError('motherMaidanCnf') ? 'pd-input-error' : ''}`}
              />
              {showError('motherMaidanCnf') && <span className="pd-error-msg">{errors.motherMaidanCnf}</span>}
            </div>

            {/* Father Name */}
            <div className="pd-form-group">
              <label className="pd-label">Father Name <span className="pd-req">*</span></label>
              <input
                type="text"
                value={fatherName}
                onChange={e => setFatherName(e.target.value)}
                onBlur={() => touch('fatherName')}
                placeholder="Enter father's name"
                className={`pd-input ${showError('fatherName') ? 'pd-input-error' : ''}`}
              />
              {showError('fatherName') && <span className="pd-error-msg">{errors.fatherName}</span>}
            </div>

            {/* Divider */}
            <div className="pd-divider" />

            {/* Marital Status */}
            <div className="pd-form-group">
              <label className="pd-label">Marital Status <span className="pd-req">*</span></label>
              <div className="pd-radio-group">
                {['Single', 'Married'].map(opt => (
                  <label
                    key={opt}
                    className={`pd-radio-label ${maritalStatus === opt ? 'pd-radio-selected' : ''}`}
                    onClick={() => { setMaritalStatus(opt); touch('maritalStatus'); }}
                  >
                    <span className="pd-radio-circle">
                      {maritalStatus === opt && <span className="pd-radio-dot" />}
                    </span>
                    {opt}
                  </label>
                ))}
              </div>
              {showError('maritalStatus') && <span className="pd-error-msg">{errors.maritalStatus}</span>}
            </div>

            {/* Divider */}
            <div className="pd-divider" />

            {/* Annual Income */}
            <div className="pd-form-group">
              <label className="pd-label">Annual Income <span className="pd-req">*</span></label>
              <div className="pd-select-wrapper">
                <select
                  value={annualIncome}
                  onChange={e => setAnnualIncome(e.target.value)}
                  onBlur={() => touch('annualIncome')}
                  className={`pd-select ${showError('annualIncome') ? 'pd-input-error' : ''} ${annualIncome ? '' : 'pd-select-placeholder'}`}
                >
                  <option value="" disabled hidden>Select Annual Income</option>
                  {ANNUAL_INCOME_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="pd-select-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
              {showError('annualIncome') && <span className="pd-error-msg">{errors.annualIncome}</span>}
            </div>

            {/* Occupation */}
            <div className="pd-form-group">
              <label className="pd-label">Occupation <span className="pd-req">*</span></label>
              <div className="pd-select-wrapper">
                <select
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                  onBlur={() => touch('occupation')}
                  className={`pd-select ${showError('occupation') ? 'pd-input-error' : ''} ${occupation ? '' : 'pd-select-placeholder'}`}
                >
                  <option value="" disabled hidden>Select Occupation</option>
                  {OCCUPATION_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="pd-select-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
              {showError('occupation') && <span className="pd-error-msg">{errors.occupation}</span>}
            </div>

            {/* Source of Income */}
            <div className="pd-form-group">
              <label className="pd-label">Source of Income <span className="pd-req">*</span></label>
              <div className="pd-select-wrapper">
                <select
                  value={incomeSource}
                  onChange={e => setIncomeSource(e.target.value)}
                  onBlur={() => touch('incomeSource')}
                  className={`pd-select ${showError('incomeSource') ? 'pd-input-error' : ''} ${incomeSource ? '' : 'pd-select-placeholder'}`}
                >
                  <option value="" disabled hidden>Select Source of Income</option>
                  {INCOME_SOURCE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="pd-select-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
              {showError('incomeSource') && <span className="pd-error-msg">{errors.incomeSource}</span>}
            </div>

            {/* Divider */}
            <div className="pd-divider" />

            {/* Risk Category */}
            <div className="pd-form-group">
              <label className="pd-label">Risk Category</label>
              <input
                type="text"
                value={riskCategory}
                onChange={e => setRiskCategory(e.target.value)}
                onBlur={() => touch('riskCategory')}
                placeholder="e.g. LOW"
                readOnly
                className="pd-input pd-input-readonly"
              />
            </div>

          </div>{/* end .pd-form-bordered */}

          {/* Submit button — outside the border box */}
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

export default PersonalDetailsSA;
