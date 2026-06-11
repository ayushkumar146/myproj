import React, { useState } from 'react';
import './BiometricAuthenticationSA.css';
import ReviewApplicationKotak from './ReviewApplicationKotak';

const BiometricAuthenticationSA = ({ onFormSubmit, processVariables }) => {
  const [selectedBiometric, setSelectedBiometric] = useState('Fingerprint Scan'); // default selected
  const [submittingType, setSubmittingType] = useState(null);

  const handleProceed = () => {
    setSubmittingType('proceed');
    onFormSubmit({
      biometricAuthentiation: {
        biometricType: selectedBiometric
      },
      go_next: true
    });
  };

  const handleClose = () => {
    setSubmittingType('close');
    onFormSubmit({
      biometricAuthentiation: {
        biometricType: selectedBiometric
      },
      go_next: false
    });
  };

  return (
    <>
      {/* 
        Render the previous form behind this modal to give the "blurred backdrop" effect 
        without changing the routing logic. We disable pointer events so it's not clickable.
      */}
      <div className="ba-background-wrapper">
        <ReviewApplicationKotak 
          processVariables={processVariables} 
          onFormSubmit={() => {}} 
        />
      </div>

      <div className="ba-overlay">
        <div className="ba-modal">
          
          <button className="ba-close-btn" onClick={handleClose} disabled={!!submittingType}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00529B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <h2 className="ba-title">Biometric<br/>Authentication</h2>

          <div className="ba-label">
            Biometric Type<span className="ba-asterisk">*</span>
          </div>

          <div className="ba-radio-group">
            <label className="ba-radio-label">
              <input 
                type="radio" 
                name="biometricType" 
                value="Fingerprint Scan"
                checked={selectedBiometric === 'Fingerprint Scan'}
                onChange={() => setSelectedBiometric('Fingerprint Scan')}
                className="ba-radio-input"
              />
              <span className="ba-radio-custom"></span>
              Fingerprint Scan
            </label>
            
            <label className="ba-radio-label">
              <input 
                type="radio" 
                name="biometricType" 
                value="Face Scan"
                checked={selectedBiometric === 'Face Scan'}
                onChange={() => setSelectedBiometric('Face Scan')}
                className="ba-radio-input"
              />
              <span className="ba-radio-custom"></span>
              Face Scan
            </label>
          </div>

          <button 
            className="ba-proceed-btn" 
            onClick={handleProceed}
            disabled={!!submittingType}
          >
            {submittingType === 'proceed' ? 'Processing...' : 'Proceed'}
          </button>
        </div>
      </div>
    </>
  );
};

export default BiometricAuthenticationSA;
