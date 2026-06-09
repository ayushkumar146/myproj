import React, { useState } from 'react';
import './AadhaarValidate.css';

const AadhaarValidate = ({ onFormSubmit, processVariables, readOnly }) => {
  // Extract values dynamically from process variables or fallback to Figma mockup values
  const mobileNumber = processVariables?.validateDetails?.mobileNumberLinkedToAadhaar || '7432768509';
  const emailId = processVariables?.validateDetails?.emailId || 'Pabitra@Gmail.Com';
  const panNumber = processVariables?.validateDetails?.panNumber || 'XXXXXXXX457K';
  const aadhaarNumber = processVariables?.validateDetails?.aadhaarNumber 
    ? `XXXXXXXX${processVariables.validateDetails.aadhaarNumber.slice(-4)}`
    : 'XXXXXXXX9945';

  const [biometricConsent, setBiometricConsent] = useState(false);
  const [biometricType, setBiometricType] = useState(''); // Empty initially to force selection
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!biometricConsent || !biometricType) return;

    setIsSubmitting(true);
    const payload = {
      aadhaarValidate: {
        biometricConsent,
        biometricType
      },
      biometricConsent,
      biometricType,
      fingerprintSelected: biometricType === 'fingerprint',
      faceSelected: biometricType === 'face'
    };
    onFormSubmit(payload);
  };

  const isFormReady = biometricConsent && biometricType;

  return (
    <div className={`validate-form-container ${readOnly ? 'backdrop-blur-view' : ''}`}>
      <div className="validate-card">
        <header className="validate-header">
          <h2>Validate</h2>
          <h3>Aadhaar Validate Details</h3>
        </header>

        <p className="consent-audio-title">Aadhaar Consent Audio</p>

        {/* Verified details checklist */}
        <div className="verified-details-list">
          <div className="verified-details-item">
            <span className="verified-checkmark-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span className="verified-details-text">Mobile Number Verified ({mobileNumber})</span>
          </div>

          <div className="verified-details-item">
            <span className="verified-checkmark-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span className="verified-details-text">Email Verified ({emailId})</span>
          </div>

          <div className="verified-details-item">
            <span className="verified-checkmark-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span className="verified-details-text">PAN Verified ({panNumber})</span>
          </div>

          <div className="verified-details-item">
            <span className="verified-checkmark-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span className="verified-details-text">Aadhaar Number ({aadhaarNumber})</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="aadhaar-validate-form">
          {/* Consent Checkbox */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <span className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="biometricConsent"
                  checked={biometricConsent}
                  onChange={(e) => setBiometricConsent(e.target.checked)}
                  className="hidden-checkbox"
                />
                <span className={`checkbox-custom-box ${biometricConsent ? 'checked' : ''}`}>
                  {biometricConsent && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
              </span>
              <span className="checkbox-text">Biometric Consent</span>
            </label>
          </div>

          {/* Biometric Type Selection */}
          <div className="form-group">
            <label className="biometric-type-label">
              Biometric Type<span className="required-star">*</span>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <span className="radio-wrapper">
                  <input
                    type="radio"
                    name="biometricType"
                    value="fingerprint"
                    checked={biometricType === 'fingerprint'}
                    onChange={(e) => setBiometricType(e.target.value)}
                    className="hidden-radio"
                  />
                  <span className={`radio-custom-box ${biometricType === 'fingerprint' ? 'checked' : ''}`}>
                    {biometricType === 'fingerprint' && <span className="radio-dot"></span>}
                  </span>
                </span>
                <span className="radio-text">Fingerprint Scan</span>
              </label>

              <label className="radio-label">
                <span className="radio-wrapper">
                  <input
                    type="radio"
                    name="biometricType"
                    value="face"
                    checked={biometricType === 'face'}
                    onChange={(e) => setBiometricType(e.target.value)}
                    className="hidden-radio"
                  />
                  <span className={`radio-custom-box ${biometricType === 'face' ? 'checked' : ''}`}>
                    {biometricType === 'face' && <span className="radio-dot"></span>}
                  </span>
                </span>
                <span className="radio-text">Face Scan</span>
              </label>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            type="submit"
            disabled={!isFormReady || isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Processing...' : 'Proceed'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AadhaarValidate;
