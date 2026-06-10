import React, { useState, useEffect } from 'react';
import './ValidateSA.css';

const ValidateSA = ({ onFormSubmit, processVariables }) => {
  const [formData, setFormData] = useState({
    mobileNumberLinkedToAadhaar: processVariables?.validateDetails?.mobileNumberLinkedToAadhaar || '',
    emailId: processVariables?.validateDetails?.emailId || '',
    panNumber: processVariables?.validateDetails?.panNumber || '',
    cnfPanNumber: processVariables?.validateDetails?.cnfPanNumber || '',
    aadhaarNumber: processVariables?.validateDetails?.aadhaarNumber || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);

  const patterns = {
    mobileNumberLinkedToAadhaar: /^[6-9]\d{9}$/,
    emailId: /^[A-Za-z0-9._%+-]+@(?!kotak\.com$)[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    panNumber: /^[A-Z]{3}[PCHFTABGL]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/,
    cnfPanNumber: /^[A-Z]{3}[PCHFTABGL]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/,
    aadhaarNumber: /^[2-9][0-9]{11}$/
  };

  const errorMessages = {
    mobileNumberLinkedToAadhaar: "Please enter a valid mobile number.",
    emailId: "Please enter a valid email address.",
    panNumber: "Please enter a valid PAN number (e.g., ABCDE1234F).",
    cnfPanNumber: "Please enter a valid PAN number (e.g., ABCDE1234F).",
    aadhaarNumber: "Please enter your Aadhaar number."
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Capitalize PAN numbers
    let finalValue = value;
    if (name === 'panNumber' || name === 'cnfPanNumber') {
      finalValue = value.toUpperCase();
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Real-time validation
    validateField(name, finalValue);
  };

  const validateField = (name, value) => {
    let error = '';
    
    if (!value) {
      error = 'This field is required';
    } else if (patterns[name] && !patterns[name].test(value)) {
      error = errorMessages[name];
    }

    // Special matching for PAN
    if (name === 'cnfPanNumber' || name === 'panNumber') {
      const otherValue = name === 'cnfPanNumber' ? formData.panNumber : formData.cnfPanNumber;
      if (name === 'cnfPanNumber' && value && otherValue && value !== otherValue) {
        error = "Please Enter the same PAN Number in Both Fields.";
      }
      // If we are editing panNumber, also update errors for cnfPanNumber if they were mismatching
      if (name === 'panNumber' && formData.cnfPanNumber && value !== formData.cnfPanNumber) {
        setErrors(prev => ({ ...prev, cnfPanNumber: "Please Enter the same PAN Number in Both Fields." }));
      } else if (name === 'panNumber' && formData.cnfPanNumber && value === formData.cnfPanNumber) {
        setErrors(prev => ({ ...prev, cnfPanNumber: '' }));
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Final validation check
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      } else if (patterns[key] && !patterns[key].test(formData[key])) {
        newErrors[key] = errorMessages[key];
      }
    });

    if (formData.panNumber !== formData.cnfPanNumber) {
      newErrors.cnfPanNumber = "Please Enter the same PAN Number in Both Fields.";
    }

    if (Object.values(newErrors).some(err => err)) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Structure the payload as per the schema path 'validateDetails'
    const payload = {
      validateDetails: {
        ...formData,
        fieldCount: "5",
        cnfPanError: formData.panNumber !== formData.cnfPanNumber ? "Please Enter the same PAN Number in Both Fields." : ""
      }
    };

    onFormSubmit(payload);
  };

  const isFormReady = 
    formData.mobileNumberLinkedToAadhaar && patterns.mobileNumberLinkedToAadhaar.test(formData.mobileNumberLinkedToAadhaar) &&
    formData.emailId && patterns.emailId.test(formData.emailId) &&
    formData.panNumber && patterns.panNumber.test(formData.panNumber) &&
    formData.cnfPanNumber && patterns.cnfPanNumber.test(formData.cnfPanNumber) &&
    formData.aadhaarNumber && patterns.aadhaarNumber.test(formData.aadhaarNumber) &&
    formData.panNumber === formData.cnfPanNumber &&
    !errors.mobileNumberLinkedToAadhaar &&
    !errors.emailId &&
    !errors.panNumber &&
    !errors.cnfPanNumber &&
    !errors.aadhaarNumber;

  return (
    <div className="validate-form-container">
      <div className="validate-card">
        <header className="validate-header">
          <h2>Validate</h2>
          <div className="validate-subheader-left">
            <h3>Customer Details</h3>
            <p>Please Enter Customer Details To Start The Journey</p>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Aadhaar Linked Mobile Number<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="mobileNumberLinkedToAadhaar"
              value={formData.mobileNumberLinkedToAadhaar}
              onChange={handleInputChange}
              placeholder="Enter Aadhaar Linked Mobile Number"
              className={errors.mobileNumberLinkedToAadhaar ? 'error' : ''}
              maxLength={10}
            />
            {errors.mobileNumberLinkedToAadhaar && <span className="error-message">{errors.mobileNumberLinkedToAadhaar}</span>}
          </div>

          <div className="form-group">
            <label>Email ID<span className="required-asterisk">*</span></label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleInputChange}
              placeholder="Enter Email ID"
              className={errors.emailId ? 'error' : ''}
            />
            {errors.emailId && <span className="error-message">{errors.emailId}</span>}
          </div>

          <div className="form-group">
            <label>PAN Number<span className="required-asterisk">*</span></label>
            <div className="custom-masked-wrapper">
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                className={`custom-masked-input ${errors.panNumber ? 'error' : ''}`}
                maxLength={10}
                placeholder="Enter PAN Number"
              />
              <div className="custom-masked-display">
                {!formData.panNumber ? (
                  <span className="custom-masked-placeholder">Enter PAN Number</span>
                ) : (
                  formData.panNumber.replace(/./g, 'X')
                )}
              </div>
            </div>
            {errors.panNumber && <span className="error-message">{errors.panNumber}</span>}
          </div>

          <div className="form-group">
            <label>Confirm PAN Number<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="cnfPanNumber"
              value={formData.cnfPanNumber}
              onChange={handleInputChange}
              placeholder="Enter Confirm PAN Number"
              className={errors.cnfPanNumber ? 'error' : ''}
              maxLength={10}
            />
            {errors.cnfPanNumber && <span className="error-message">{errors.cnfPanNumber}</span>}
            
            {formData.panNumber && formData.cnfPanNumber && formData.panNumber === formData.cnfPanNumber && !errors.panNumber && !errors.cnfPanNumber && (
              <div className="pan-matched-message">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#00529B" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>PAN Matched</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Aadhaar Number<span className="required-asterisk">*</span></label>
            <div className="password-input-wrapper">
              <div className="custom-masked-wrapper" style={{ flex: 1 }}>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleInputChange}
                  className={`custom-masked-input ${showAadhaar ? 'show-text' : ''} ${errors.aadhaarNumber ? 'error' : ''}`}
                  maxLength={12}
                  placeholder="Enter Aadhaar Number"
                />
                {!showAadhaar && (
                  <div className="custom-masked-display">
                    {!formData.aadhaarNumber ? (
                      <span className="custom-masked-placeholder">Enter Aadhaar Number</span>
                    ) : (
                      formData.aadhaarNumber.replace(/./g, 'X').match(/.{1,4}/g)?.join(' ') || ''
                    )}
                  </div>
                )}
                {showAadhaar && !formData.aadhaarNumber && (
                  <div className="custom-masked-display">
                    <span className="custom-masked-placeholder">Enter Aadhaar Number</span>
                  </div>
                )}
              </div>
              <button 
                type="button" 
                className="toggle-password-btn"
                onClick={() => setShowAadhaar(!showAadhaar)}
              >
                {showAadhaar ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(0,0,0,1)" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(0,0,0,1)" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17zm-4.3.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.3-3.8c4.29 0 7.97 2.34 9.67 6-.68 1.46-1.69 2.75-2.92 3.73l-1.45-1.45c1.04-.79 1.87-1.8 2.37-2.98C17.65 8.16 14.15 6 12 6c-1.12 0-2.18.23-3.15.63L7.54 5.32C8.9 4.47 10.4 4 12 4zm-9.18.78L4.25 6.2 5.5 7.45C3.39 8.84 1.7 10.95 1 13.3c1.7 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l2.14 2.14 1.41-1.41L2.82 4.78z"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.aadhaarNumber && <span className="error-message">{errors.aadhaarNumber}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={!isFormReady || isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Proceed'}
            {!isSubmitting && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ValidateSA;
