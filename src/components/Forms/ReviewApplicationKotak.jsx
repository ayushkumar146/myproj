import React, { useState } from 'react';
import './ReviewApplicationKotak.css';

const ReviewApplicationKotak = ({ onFormSubmit, processVariables }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getProcessVar = (path, defaultValue = 'N/A') => {
    if (!processVariables) return defaultValue;
    if (processVariables[path] !== undefined && processVariables[path] !== null)
      return processVariables[path] || defaultValue;

    const parts = path.split('.');
    let current = processVariables;
    let found = true;
    for (const part of parts) {
      if (current && typeof current === 'object' && current[part] !== undefined && current[part] !== null) {
        current = current[part];
      } else { found = false; break; }
    }
    if (found) return current || defaultValue;

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
    return v !== undefined && v !== '' ? v : defaultValue;
  };

  const maskValue = (val) => {
    if (!val || typeof val !== 'string') return val;
    if (val.length <= 4) return val;
    const maskedLen = val.length - 4;
    return '*'.repeat(maskedLen) + val.slice(-4);
  };

  const handleAction = (actionType) => {
    setIsSubmitting(true);
    const goNextVal = actionType === 'submit'; // true if submit, false if back
    
    onFormSubmit({
      reviewAction: actionType,
      go_next: goNextVal,
      reviewApplicationCompleted: true
    });
  };

  return (
    <div className="ra-html-container">
      <div className="container">
          <div className="header">Review Application</div>
          <div className="sub-text">Review all the details and confirm this application.</div>

          <div className="row"><div className="label">Title :</div><div className="value">{getProcessVar('review_application.title')}</div></div>
          <div className="row"><div className="label">Customer Name :</div><div className="value">{getProcessVar('review_application.customerName')}</div></div>
          <div className="row"><div className="label">Mother Maiden Name :</div><div className="value">{getProcessVar('review_application.motherName')}</div></div>
          <div className="row"><div className="label">Marital Status :</div><div className="value">{getProcessVar('review_application.maritalStatus')}</div></div>
          <div className="row"><div className="label">Gender :</div><div className="value">{getProcessVar('review_application.gender')}</div></div>
          <div className="row"><div className="label">Annual Income :</div><div className="value">{getProcessVar('review_application.annualIncome')}</div></div>
          <div className="row"><div className="label">Occupation :</div><div className="value">{getProcessVar('review_application.occupation')}</div></div>
          <div className="row"><div className="label">Father Name :</div><div className="value">{getProcessVar('review_application.fatherName')}</div></div>
          <div className="row"><div className="label">Source Of Income :</div><div className="value">{getProcessVar('review_application.incomeSource')}</div></div>
          <div className="row"><div className="label">Risk Category :</div><div className="value">{getProcessVar('review_application.riskCategory')}</div></div>
          <div className="row"><div className="label">CRN :</div><div className="value">{getProcessVar('review_application.crn')}</div></div>
          <div className="row"><div className="label">Account No :</div><div className="value">{getProcessVar('review_application.accountNo')}</div></div>
          <div className="row"><div className="label">Nominee Entered :</div><div className="value">{getProcessVar('review_application.nominee')}</div></div>
          <div className="row"><div className="label">Name On Debit Card :</div><div className="value">{getProcessVar('review_application.debitCardName')}</div></div>
          <div className="row"><div className="label">Aadhaar / Ref Key :</div><div className="value">{getProcessVar('review_application.aadhaar')}</div></div>
          <div className="row"><div className="label">PAN No :</div><div className="value">{maskValue(getProcessVar('review_application.pan'))}</div></div>
          <div className="row"><div className="label">Aadhaar Seeding :</div><div className="value">{getProcessVar('review_application.aadhaarSeeding')}</div></div>
          <div className="row"><div className="label">E-Auth :</div><div className="value">{maskValue(getProcessVar('review_application.eAuth'))}</div></div>
          <div className="row"><div className="label">Product :</div><div className="value">{getProcessVar('review_application.product')}</div></div>
          <div className="row"><div className="label">Debit Card :</div><div className="value">{getProcessVar('review_application.debitCard')}</div></div>
          <div className="row"><div className="label">Address Type :</div><div className="value">{getProcessVar('review_application.addressType')}</div></div>
          <div className="row"><div className="label">Communication Address :</div><div className="value">{getProcessVar('review_application.communicationAddress')}</div></div>
          <div className="row"><div className="label">Insurance Product :</div><div className="value">{getProcessVar('review_application.insuranceProduct')}</div></div>
          <div className="row"><div className="label">Biometric Auth :</div><div className="value">{getProcessVar('review_application.biometricAuth')}</div></div>

          <div className="ra-button-group">
            <button 
              type="button" 
              className="ra-btn-back" 
              onClick={() => handleAction('back')}
              disabled={isSubmitting}
            >
              Back
            </button>
            <button 
              type="button" 
              className="ra-btn-submit" 
              onClick={() => handleAction('submit')}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Review'}
            </button>
          </div>
      </div>
    </div>
  );
};

export default ReviewApplicationKotak;
