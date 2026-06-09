import React, { useState, useMemo, useEffect } from 'react';
import './NomineeDetailsSA.css';

const DEFAULT_NOMINEE = {
  title: '',
  name: '',
  dob: '',
  phNumber: '',
  emailId: '',
  select_k3yy5h: '',
  radio_nwsza: '',
  nomineePercentage: '100' // default to 100% for the first one
};

const RELATIONSHIP_OPTIONS = [
  { label: 'Father', value: 'Father' },
  { label: 'Mother', value: 'Mother' },
  { label: 'Spouse', value: 'Spouse' },
  { label: 'Son', value: 'Son' },
  { label: 'Daughter', value: 'Daughter' },
  { label: 'Brother', value: 'Brother' },
  { label: 'Sister', value: 'Sister' },
  { label: 'Other', value: 'Other' }
];

const NomineeDetailsSA = ({ onFormSubmit, processVariables }) => {
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

  // Get the primary account holder's name for the relationship label
  const accountHolderName = getProcessVar('personalDetails.name') || getProcessVar('name') || 'Account Holder';
  
  // ── Initial values from processVariables ──────────────────────────────────
  const initialNomineeList = getProcessVar('nomineeDetails.nomineeList') || getProcessVar('nomineeList');
  
  const [nominees, setNominees] = useState(() => {
    if (Array.isArray(initialNomineeList) && initialNomineeList.length > 0) {
      return initialNomineeList;
    }
    return [{ ...DEFAULT_NOMINEE }];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddNominee = () => {
    if (nominees.length < 4) {
      setNominees([...nominees, { ...DEFAULT_NOMINEE, nomineePercentage: '' }]);
    }
  };

  const handleRemoveNominee = (indexToRemove) => {
    setNominees(nominees.filter((_, idx) => idx !== indexToRemove));
    
    // Clean up touched state for removed index
    const newTouched = { ...touchedFields };
    Object.keys(newTouched).forEach(key => {
      if (key.startsWith(`nominee_${indexToRemove}_`)) {
        delete newTouched[key];
      }
    });
    setTouchedFields(newTouched);
  };

  const handleChange = (index, field, value) => {
    const updated = [...nominees];
    updated[index] = { ...updated[index], [field]: value };
    setNominees(updated);
  };

  const touch = (index, field) => {
    setTouchedFields(prev => ({ ...prev, [`nominee_${index}_${field}`]: true }));
  };

  const isTouched = (index, field) => touchedFields[`nominee_${index}_${field}`];

  // ── Validation (derived) ──────────────────────────────────────────────────
  const { errors, globalErrors } = useMemo(() => {
    const errs = {};
    const glbErrs = [];

    // Global: Limit error
    if (nominees.length === 0) {
      glbErrs.push("At least one nominee is required.");
    } else if (nominees.length > 4) {
      glbErrs.push("You can add up to 4 nominees only.");
    }

    // Global: Percentage error
    let totalPercentage = 0;
    nominees.forEach((n) => {
      const p = parseFloat(n.nomineePercentage);
      if (!isNaN(p)) totalPercentage += p;
    });

    if (totalPercentage !== 100) {
      glbErrs.push("Nominee percentages must total 100%.");
    }

    // Field-level errors
    nominees.forEach((n, idx) => {
      errs[idx] = {};
      
      if (!n.title?.trim()) errs[idx].title = 'Title is required';
      if (!n.name?.trim()) errs[idx].name = 'Name is required';
      if (!n.dob) errs[idx].dob = 'Date of birth is required';
      
      if (!n.phNumber?.trim()) {
        errs[idx].phNumber = 'Mobile number is required';
      } else if (!/^[6-9]\d{9}$/.test(n.phNumber)) {
        errs[idx].phNumber = 'Please enter a valid mobile number.';
      }

      if (!n.emailId?.trim()) {
        errs[idx].emailId = 'Email ID is required';
      } else if (!/^[A-Za-z0-9._%+-]+@(?!kotak\.com$)[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(n.emailId)) {
        errs[idx].emailId = 'Please enter a valid email address (cannot be kotak.com).';
      }

      if (!n.select_k3yy5h) errs[idx].select_k3yy5h = 'Relationship is required';
      if (!n.radio_nwsza) errs[idx].radio_nwsza = 'Address selection is required';
      
      if (!n.nomineePercentage?.trim()) {
        errs[idx].nomineePercentage = 'Percentage is required';
      } else if (isNaN(parseFloat(n.nomineePercentage))) {
        errs[idx].nomineePercentage = 'Must be a number';
      }
    });

    return { errors: errs, globalErrors: glbErrs };
  }, [nominees]);

  const hasFieldErrors = Object.values(errors).some(nomErrs => Object.keys(nomErrs).length > 0);
  const isFormValid = globalErrors.length === 0 && !hasFieldErrors;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Touch all fields
    const allTouched = {};
    nominees.forEach((_, idx) => {
      ['title', 'name', 'dob', 'phNumber', 'emailId', 'select_k3yy5h', 'radio_nwsza', 'nomineePercentage'].forEach(f => {
        allTouched[`nominee_${idx}_${f}`] = true;
      });
    });
    setTouchedFields(allTouched);

    if (!isFormValid) return;

    setIsSubmitting(true);
    
    // Calculate minor exist logic for payload
    const isMinorExist = nominees.some(n => {
      if (!n.dob) return false;
      const dobDate = new Date(n.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      return age <= 18;
    });

    const payload = {
      nomineeDetails: {
        nomineeList: nominees,
        nomineeLimitError: null,
        nomineePercentageError: null
      },
      isMinorExist,
      fieldCount: (nominees.length * 8).toString()
    };
    
    onFormSubmit(payload);
  };

  return (
    <div className="pd-container">
      <div className="pd-card">
        <header className="pd-header">
          <h2 className="pd-title">Nominee Details</h2>
          <p className="pd-subtitle">Enter all the nominee details</p>
        </header>

        {globalErrors.length > 0 && Object.keys(touchedFields).length > 0 && (
          <div className="nd-global-errors">
            {globalErrors.map((err, i) => (
              <p key={i} className="nd-global-error-msg">{err}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="pd-form" noValidate>
          
          {nominees.map((nominee, index) => {
            const nomErrs = errors[index] || {};
            
            return (
              <div key={index} className="nd-nominee-block">
                <div className="nd-block-header">
                  <h3>Nominee - {index + 1}</h3>
                  {nominees.length > 1 && (
                    <button type="button" className="nd-remove-btn" onClick={() => handleRemoveNominee(index)}>
                      Remove
                    </button>
                  )}
                </div>

                {/* Title */}
                <div className="pd-form-group">
                  <label className="pd-label">Title <span className="pd-req">*</span></label>
                  <input
                    type="text"
                    value={nominee.title}
                    onChange={e => handleChange(index, 'title', e.target.value)}
                    onBlur={() => touch(index, 'title')}
                    placeholder="Enter Title"
                    className={`pd-input ${isTouched(index, 'title') && nomErrs.title ? 'pd-input-error' : ''}`}
                  />
                  {isTouched(index, 'title') && nomErrs.title && <span className="pd-error-msg">{nomErrs.title}</span>}
                </div>

                {/* Name */}
                <div className="pd-form-group">
                  <label className="pd-label">Nominee Name <span className="pd-req">*</span></label>
                  <input
                    type="text"
                    value={nominee.name}
                    onChange={e => handleChange(index, 'name', e.target.value)}
                    onBlur={() => touch(index, 'name')}
                    placeholder="Enter Nominee Name"
                    className={`pd-input ${isTouched(index, 'name') && nomErrs.name ? 'pd-input-error' : ''}`}
                  />
                  {isTouched(index, 'name') && nomErrs.name && <span className="pd-error-msg">{nomErrs.name}</span>}
                </div>

                {/* DOB */}
                <div className="pd-form-group">
                  <label className="pd-label">Nominee DOB <span className="pd-req">*</span></label>
                  <input
                    type="date"
                    value={nominee.dob}
                    onChange={e => handleChange(index, 'dob', e.target.value)}
                    onBlur={() => touch(index, 'dob')}
                    className={`pd-input pd-input-date ${isTouched(index, 'dob') && nomErrs.dob ? 'pd-input-error' : ''}`}
                  />
                  {isTouched(index, 'dob') && nomErrs.dob && <span className="pd-error-msg">{nomErrs.dob}</span>}
                </div>

                {/* Mobile */}
                <div className="pd-form-group">
                  <label className="pd-label">Nominee Mobile Number <span className="pd-req">*</span></label>
                  <input
                    type="text"
                    value={nominee.phNumber}
                    onChange={e => handleChange(index, 'phNumber', e.target.value)}
                    onBlur={() => touch(index, 'phNumber')}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    className={`pd-input ${isTouched(index, 'phNumber') && nomErrs.phNumber ? 'pd-input-error' : ''}`}
                  />
                  {isTouched(index, 'phNumber') && nomErrs.phNumber && <span className="pd-error-msg">{nomErrs.phNumber}</span>}
                </div>

                {/* Email */}
                <div className="pd-form-group">
                  <label className="pd-label">Nominee Email ID <span className="pd-req">*</span></label>
                  <input
                    type="email"
                    value={nominee.emailId}
                    onChange={e => handleChange(index, 'emailId', e.target.value)}
                    onBlur={() => touch(index, 'emailId')}
                    placeholder="Enter email ID"
                    className={`pd-input ${isTouched(index, 'emailId') && nomErrs.emailId ? 'pd-input-error' : ''}`}
                  />
                  {isTouched(index, 'emailId') && nomErrs.emailId && <span className="pd-error-msg">{nomErrs.emailId}</span>}
                </div>

                {/* Relationship */}
                <div className="pd-form-group">
                  <label className="pd-label">Relationship with {accountHolderName} <span className="pd-req">*</span></label>
                  <div className="pd-select-wrapper">
                    <select
                      value={nominee.select_k3yy5h}
                      onChange={e => handleChange(index, 'select_k3yy5h', e.target.value)}
                      onBlur={() => touch(index, 'select_k3yy5h')}
                      className={`pd-select ${!nominee.select_k3yy5h ? 'pd-select-placeholder' : ''} ${isTouched(index, 'select_k3yy5h') && nomErrs.select_k3yy5h ? 'pd-input-error' : ''}`}
                    >
                      <option value="">Select relationship</option>
                      {RELATIONSHIP_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <span className="pd-select-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </div>
                  {isTouched(index, 'select_k3yy5h') && nomErrs.select_k3yy5h && <span className="pd-error-msg">{nomErrs.select_k3yy5h}</span>}
                </div>

                {/* Address Radio */}
                <div className="pd-form-group">
                  <label className="pd-label">Nominee address <span className="pd-req">*</span></label>
                  <div className="pd-radio-group">
                    {[
                      { val: 'Communication Address Same As Account Holder', label: 'Same As Account Holder' },
                      { val: 'Others', label: 'Others' }
                    ].map(opt => (
                      <label
                        key={opt.val}
                        className={`pd-radio-label ${nominee.radio_nwsza === opt.val ? 'pd-radio-selected' : ''}`}
                        onClick={() => { handleChange(index, 'radio_nwsza', opt.val); touch(index, 'radio_nwsza'); }}
                      >
                        <span className="pd-radio-circle">
                          {nominee.radio_nwsza === opt.val && <span className="pd-radio-dot" />}
                        </span>
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {isTouched(index, 'radio_nwsza') && nomErrs.radio_nwsza && <span className="pd-error-msg">{nomErrs.radio_nwsza}</span>}
                </div>

                {/* Percentage */}
                <div className="pd-form-group">
                  <label className="pd-label">Nominee Percentage <span className="pd-req">*</span></label>
                  <input
                    type="number"
                    value={nominee.nomineePercentage}
                    onChange={e => handleChange(index, 'nomineePercentage', e.target.value)}
                    onBlur={() => touch(index, 'nomineePercentage')}
                    placeholder="Enter percentage (e.g. 100)"
                    min="1" max="100"
                    className={`pd-input ${isTouched(index, 'nomineePercentage') && nomErrs.nomineePercentage ? 'pd-input-error' : ''}`}
                  />
                  {isTouched(index, 'nomineePercentage') && nomErrs.nomineePercentage && <span className="pd-error-msg">{nomErrs.nomineePercentage}</span>}
                </div>

              </div>
            );
          })}

          {nominees.length < 4 && (
            <button
              type="button"
              className="nd-add-btn"
              onClick={handleAddNominee}
            >
              + Add Nominee
            </button>
          )}

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

export default NomineeDetailsSA;
