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
          <h3>Customer Details</h3>
          <p>Please Enter Customer Details To start The Journey</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Aadhaar Linked Mobile Number</label>
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
            <label>Email ID</label>
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
            <label>PAN Number</label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
              placeholder="Enter PAN Number"
              className={errors.panNumber ? 'error' : ''}
              maxLength={10}
            />
            {errors.panNumber && <span className="error-message">{errors.panNumber}</span>}
          </div>

          <div className="form-group">
            <label>Confirm PAN Number</label>
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
          </div>

          <div className="form-group">
            <label>Aadhaar Number</label>
            <input
              type="text"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleInputChange}
              placeholder="Enter Aadhaar Number"
              className={errors.aadhaarNumber ? 'error' : ''}
              maxLength={12}
            />
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
