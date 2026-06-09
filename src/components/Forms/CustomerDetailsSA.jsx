import React, { useState, useEffect } from 'react';
import './CustomerDetailsSA.css';

const CustomerDetailsSA = ({ onFormSubmit, processVariables }) => {
  // Helper to find a value inside processVariables (resolves flat paths, nested paths, and falls back case-insensitively)
  const getProcessVar = (path, defaultValue = '') => {
    if (!processVariables) return defaultValue;

    // 1. Check as flat key (e.g., processVariables["customerDetails.name"])
    if (processVariables[path] !== undefined && processVariables[path] !== null) {
      return processVariables[path];
    }

    // 2. Check as nested path (e.g., processVariables.customerDetails.name)
    const parts = path.split('.');
    let current = processVariables;
    let foundNested = true;
    for (const part of parts) {
      if (current && typeof current === 'object' && current[part] !== undefined && current[part] !== null) {
        current = current[part];
      } else {
        foundNested = false;
        break;
      }
    }
    if (foundNested) {
      return current;
    }

    // 3. Fallback: Search case-insensitively for flat key or leaf key
    const leafKey = parts[parts.length - 1];
    const recursiveFind = (obj, targetKey) => {
      if (!obj || typeof obj !== 'object') return undefined;
      const lowerKey = targetKey.toLowerCase();
      
      const foundKey = Object.keys(obj).find(k => k.toLowerCase() === lowerKey);
      if (foundKey !== undefined && obj[foundKey] !== undefined && obj[foundKey] !== null) {
        return obj[foundKey];
      }
      
      for (const k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          const val = recursiveFind(obj[k], targetKey);
          if (val !== undefined) return val;
        }
      }
      return undefined;
    };

    const val = recursiveFind(processVariables, leafKey);
    return val !== undefined ? val : defaultValue;
  };

  // Log processVariables for debugging
  useEffect(() => {
    console.log("CustomerDetailsSA received processVariables:", processVariables);
  }, [processVariables]);

  // Display fields from Camunda process variables (re-computed on every render)
  const name = getProcessVar('customerDetails.name') || getProcessVar('customer.name') || getProcessVar('name');
  const age = getProcessVar('customerDetails.age') || getProcessVar('age');
  const gender = getProcessVar('customerDetails.gender') || getProcessVar('gender');
  const dob = getProcessVar('customerDetails.dob') || getProcessVar('dob');
  const addressLine = getProcessVar('customerDetails.addressLine') || getProcessVar('addressLine');
  const city = getProcessVar('customerDetails.city') || getProcessVar('city');
  const pincode = getProcessVar('customerDetails.pincode') || getProcessVar('pincode');
  const state = getProcessVar('customerDetails.state') || getProcessVar('state');

  // State variables for editable inputs — initialized empty, synced via useEffect when processVariables arrives
  const [isCommunicationAddressSame, setIsCommunicationAddressSame] = useState(true);
  const [commZipcode, setCommZipcode] = useState('');
  const [commCity, setCommCity] = useState('');
  const [commState, setCommState] = useState('');
  const [commAddrLine1, setCommAddrLine1] = useState('');
  const [commAddrLine2, setCommAddrLine2] = useState('');
  const [commAddrLine3, setCommAddrLine3] = useState('');
  const [commAddrLandmark, setCommAddrLandmark] = useState('');

  // Sync all fields from processVariables whenever Camunda sends updated variables
  useEffect(() => {
    if (!processVariables) return;

    // Read isCommunicationAddressSame from Camunda (default: true)
    const rawVal = getProcessVar('customerDetails.isCommunicationAddressSame') || getProcessVar('isCommunicationAddressSame');
    const isSame = rawVal !== '' ? (rawVal === true || rawVal === 'true') : true;
    setIsCommunicationAddressSame(isSame);

    // Read comm address fields from Camunda
    const camundaZip      = getProcessVar('customerDetails.commZipcode')     || getProcessVar('commZipcode')     || '';
    const camundaCity     = getProcessVar('customerDetails.commCity')         || getProcessVar('commCity')         || '';
    const camundaState    = getProcessVar('customerDetails.commState')        || getProcessVar('commState')        || '';
    const camundaLine1    = getProcessVar('customerDetails.commAddrLine1')    || getProcessVar('commAddrLine1')    || '';
    const camundaLine2    = getProcessVar('customerDetails.commAddrLine2')    || getProcessVar('commAddrLine2')    || '';
    const camundaLine3    = getProcessVar('customerDetails.commAddrLine3')    || getProcessVar('commAddrLine3')    || '';
    const camundaLandmark = getProcessVar('customerDetails.CommAddrLandmark') || getProcessVar('customerDetails.commAddrLandmark') || getProcessVar('CommAddrLandmark') || getProcessVar('commAddrLandmark') || '';

    // Resolve Aadhaar address values (for auto-fill when same)
    const aadhaarZip   = getProcessVar('customerDetails.pincode')     || getProcessVar('pincode')     || '';
    const aadhaarCity  = getProcessVar('customerDetails.city')         || getProcessVar('city')         || '';
    const aadhaarState = getProcessVar('customerDetails.state')        || getProcessVar('state')        || '';
    const aadhaarLine  = getProcessVar('customerDetails.addressLine')  || getProcessVar('addressLine')  || '';

    // If isCommunicationAddressSame is true and Camunda fields are empty, use Aadhaar address
    if (isSame) {
      setCommZipcode(camundaZip   || aadhaarZip);
      setCommCity(camundaCity     || aadhaarCity);
      setCommState(camundaState   || aadhaarState);
      setCommAddrLine1(camundaLine1 || aadhaarLine);
      setCommAddrLine2(camundaLine2 || aadhaarLine);
      setCommAddrLine3(camundaLine3 || aadhaarLine);
      setCommAddrLandmark(camundaLandmark);
    } else {
      setCommZipcode(camundaZip);
      setCommCity(camundaCity);
      setCommState(camundaState);
      setCommAddrLine1(camundaLine1);
      setCommAddrLine2(camundaLine2);
      setCommAddrLine3(camundaLine3);
      setCommAddrLandmark(camundaLandmark);
    }
  }, [processVariables]);

  // Validation state variables
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address pattern validator
  const addressPattern = /^(?=.*[A-Za-z0-9])[A-Za-z0-9,().\-:@#_={}| ]+$/;
  const addressPatternMessage = "Address must contain letters/numbers and only , ( ) . - : @ # _ = { } | special characters.";

  // Run validations whenever inputs change
  useEffect(() => {
    // If hidden, no validation needed
    if (!isCommunicationAddressSame) {
      setErrors({});
      return;
    }

    const newErrors = {};

    // Zipcode: required, 6 digits
    if (!commZipcode) {
      newErrors.commZipcode = 'Communication Zipcode is required';
    } else if (!/^\d{6}$/.test(commZipcode)) {
      newErrors.commZipcode = 'Communication Zipcode must be exactly 6 digits';
    }

    // City: required
    if (!commCity.trim()) {
      newErrors.commCity = 'Communication City is required';
    }

    // State: required
    if (!commState.trim()) {
      newErrors.commState = 'Communication State is required';
    }

    // Addr Line 1: required, length 1-30, pattern match
    if (!commAddrLine1) {
      newErrors.commAddrLine1 = 'Communication Addr Line1 is required';
    } else if (commAddrLine1.length > 30) {
      newErrors.commAddrLine1 = 'Must be 30 characters or less';
    } else if (!addressPattern.test(commAddrLine1)) {
      newErrors.commAddrLine1 = addressPatternMessage;
    }

    // Addr Line 2: optional but if filled, check length and pattern
    if (commAddrLine2) {
      if (commAddrLine2.length > 30) {
        newErrors.commAddrLine2 = 'Must be 30 characters or less';
      } else if (!addressPattern.test(commAddrLine2)) {
        newErrors.commAddrLine2 = addressPatternMessage;
      }
    }

    // Addr Line 3: optional but if filled, check length and pattern
    if (commAddrLine3) {
      if (commAddrLine3.length > 30) {
        newErrors.commAddrLine3 = 'Must be 30 characters or less';
      } else if (!addressPattern.test(commAddrLine3)) {
        newErrors.commAddrLine3 = addressPatternMessage;
      }
    }

    // Addr Landmark: required
    if (!commAddrLandmark.trim()) {
      newErrors.commAddrLandmark = 'Communication Addr Landmark is required';
    }

    setErrors(newErrors);
  }, [
    isCommunicationAddressSame,
    commZipcode,
    commCity,
    commState,
    commAddrLine1,
    commAddrLine2,
    commAddrLine3,
    commAddrLandmark
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate again before submit if fields are shown
    if (isCommunicationAddressSame && Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customerDetails: {
        isCommunicationAddressSame,
        fieldCount: "8",
        ...(isCommunicationAddressSame ? {
          commZipcode,
          commCity,
          commState,
          commAddrLine1,
          commAddrLine2,
          commAddrLine3,
          CommAddrLandmark: commAddrLandmark
        } : {})
      },
      isCommunicationAddressSame,
      fieldCount: "8"
    };

    onFormSubmit(payload);
  };

  const isFormValid = !isCommunicationAddressSame || Object.keys(errors).length === 0;

  return (
    <div className="customer-details-container">
      <div className="customer-details-card">
        <header className="customer-details-header">
          <h2>Customer Details</h2>
          <h3>Verify Profile & Address Information</h3>
        </header>

        <form onSubmit={handleSubmit} className="customer-details-form">
          
          {/* Aadhaar Info Card representation of HTML component */}
          <div className="aadhaar-info-block">
            <div className="avatar-section">
              <div className="avatar-circle">
                <span className="avatar-emoji">😊</span>
              </div>
              <h4 className="customer-name">{name}</h4>
            </div>

            <div className="info-details-box">
              <div className="info-row">
                <span className="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M5.5 21a8.5 8.5 0 0 1 13 0"></path>
                  </svg>
                </span>
                <span className="info-value">{age}, {gender}</span>
              </div>

              <div className="info-row">
                <span className="info-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </span>
                <span className="info-value">{dob}</span>
              </div>

              <div className="info-row align-start">
                <span className="info-icon mt-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="3" width="16" height="18" rx="3"></rect>
                    <line x1="3" y1="7" x2="5" y2="7"></line>
                    <line x1="3" y1="12" x2="5" y2="12"></line>
                    <line x1="3" y1="17" x2="5" y2="17"></line>
                    <circle cx="13" cy="10" r="2"></circle>
                    <path d="M10 15h6"></path>
                  </svg>
                </span>
                <span className="info-value line-15">
                  {addressLine}, {city}, {pincode},<br />
                  {state}
                </span>
              </div>
            </div>
          </div>

          {/* Same Address Checkbox */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <span className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={isCommunicationAddressSame}
                  onChange={(e) => setIsCommunicationAddressSame(e.target.checked)}
                  className="hidden-checkbox"
                />
                <span className={`checkbox-custom-box ${isCommunicationAddressSame ? 'checked' : ''}`}>
                  {isCommunicationAddressSame && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
              </span>
              <span className="checkbox-text font-14">Communication Address Is Same As Aadhaar Address.</span>
            </label>
          </div>

          {/* Conditional Communication Address Inputs */}
          {isCommunicationAddressSame && (
            <div className="communication-address-fields animate-fade-down">
              <h4 className="fields-section-title">Communication Address</h4>
              
              {/* Zipcode */}
              <div className="form-group">
                <label className="input-label">Communication  Zipcode <span className="req-star">*</span></label>
                <input
                  type="text"
                  maxLength="6"
                  value={commZipcode}
                  onChange={(e) => setCommZipcode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit zipcode"
                  readOnly={isCommunicationAddressSame}
                  className={`form-input-field ${errors.commZipcode ? 'error-border' : ''}`}
                />
                {errors.commZipcode && <span className="error-text-message">{errors.commZipcode}</span>}
              </div>

              {/* City */}
              <div className="form-group">
                <label className="input-label">Communication City <span className="req-star">*</span></label>
                <input
                  type="text"
                  value={commCity}
                  onChange={(e) => setCommCity(e.target.value)}
                  placeholder="Enter city"
                  readOnly={isCommunicationAddressSame}
                  className={`form-input-field ${errors.commCity ? 'error-border' : ''}`}
                />
                {errors.commCity && <span className="error-text-message">{errors.commCity}</span>}
              </div>

              {/* State */}
              <div className="form-group">
                <label className="input-label">Communication State <span className="req-star">*</span></label>
                <input
                  type="text"
                  value={commState}
                  onChange={(e) => setCommState(e.target.value)}
                  placeholder="Enter state"
                  readOnly={isCommunicationAddressSame}
                  className={`form-input-field ${errors.commState ? 'error-border' : ''}`}
                />
                {errors.commState && <span className="error-text-message">{errors.commState}</span>}
              </div>

              {/* Addr Line 1 */}
              <div className="form-group">
                <label className="input-label">Communication Addr Line1 <span className="req-star">*</span></label>
                <input
                  type="text"
                  maxLength="30"
                  value={commAddrLine1}
                  onChange={(e) => setCommAddrLine1(e.target.value)}
                  placeholder="Street, Plot No., Building"
                  readOnly={isCommunicationAddressSame}
                  className={`form-input-field ${errors.commAddrLine1 ? 'error-border' : ''}`}
                />
                {errors.commAddrLine1 && <span className="error-text-message">{errors.commAddrLine1}</span>}
              </div>

              {/* Addr Line 2 */}
              <div className="form-group">
                <label className="input-label">Communication Addr Line2</label>
                <input
                  type="text"
                  maxLength="30"
                  value={commAddrLine2}
                  onChange={(e) => setCommAddrLine2(e.target.value)}
                  placeholder="Locality, Sector"
                  readOnly={isCommunicationAddressSame}
                  className={`form-input-field ${errors.commAddrLine2 ? 'error-border' : ''}`}
                />
                {errors.commAddrLine2 && <span className="error-text-message">{errors.commAddrLine2}</span>}
              </div>

              {/* Addr Line 3 */}
              <div className="form-group">
                <label className="input-label">Communication Addr Line3</label>
                <input
                  type="text"
                  maxLength="30"
                  value={commAddrLine3}
                  onChange={(e) => setCommAddrLine3(e.target.value)}
                  placeholder="Additional details"
                  readOnly={isCommunicationAddressSame}
                  className={`form-input-field ${errors.commAddrLine3 ? 'error-border' : ''}`}
                />
                {errors.commAddrLine3 && <span className="error-text-message">{errors.commAddrLine3}</span>}
              </div>

              {/* Addr Landmark */}
              <div className="form-group">
                <label className="input-label">Communication Addr Landmark <span className="req-star">*</span></label>
                <textarea
                  value={commAddrLandmark}
                  onChange={(e) => setCommAddrLandmark(e.target.value)}
                  placeholder="Nearby landmark"
                  readOnly={isCommunicationAddressSame}
                  className={`form-input-field ${errors.commAddrLandmark ? 'error-border' : ''}`}
                />
                {errors.commAddrLandmark && <span className="error-text-message">{errors.commAddrLandmark}</span>}
              </div>
            </div>
          )}

          {/* Submit Button (Next) */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="customer-details-submit-btn"
          >
            {isSubmitting ? 'Processing...' : 'Next'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetailsSA;
