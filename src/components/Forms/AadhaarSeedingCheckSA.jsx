import React, { useState } from 'react';
import './PersonalDetailsSA.css';

const AadhaarSeedingCheckSA = ({ processVariables, onFormSubmit }) => {
  const [isAadhaarSeed, setIsAadhaarSeed] = useState('Yes');
  const [aadhaarNo, setAadhaarNo] = useState(processVariables.aadhaarNo || '');
  const [biometriType, setBiometriType] = useState('fingerprintScan');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAadhaarSeed === 'Yes' && !aadhaarNo.trim()) {
      setError('Please enter Aadhaar Number');
      return;
    }
    
    // Store in Camunda variable as requested
    onFormSubmit({
      aadhaarSeeding: {
        isAadhaarSeed,
        aadhaarNo: isAadhaarSeed === 'Yes' ? aadhaarNo : '',
        biometriType
      },
      ad_biometrictype: biometriType // Explicit top-level process variable
    });
  };

  return (
    <div className="pd-container">
      <div className="pd-card">
        <h2 className="pd-title" style={{ marginBottom: '24px', textAlign: 'center' }}>Aadhaar Seeding</h2>
        
        {error && (
          <div className="pd-global-errors" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <style>{`
          .aadhaar-seeding-form .pd-label {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0%;
            color: rgba(0, 0, 0, 1);
          }
          .aadhaar-seeding-form .pd-radio-label {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 300;
            font-size: 14px;
            line-height: 140%;
            letter-spacing: -1%;
            text-transform: capitalize;
            color: rgba(0, 0, 0, 1);
          }
        `}</style>

        <form onSubmit={handleSubmit} className="pd-form aadhaar-seeding-form">
          <div className="pd-form-group">
            <label className="pd-label">Do You want to seed Aadhaar for DBT in this account?</label>
            <div className="pd-radio-group">
              {['Yes', 'No'].map(opt => (
                <label 
                  key={opt}
                  className={`pd-radio-label ${isAadhaarSeed === opt ? 'pd-radio-selected' : ''}`}
                  onClick={() => setIsAadhaarSeed(opt)}
                >
                  <span className="pd-radio-circle">
                    {isAadhaarSeed === opt && <span className="pd-radio-dot" />}
                  </span>
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {isAadhaarSeed === 'Yes' && (
            <div className="pd-form-group">
              <label className="pd-label">Aadhaar No.</label>
              <input
                type="text"
                className="pd-input"
                value={aadhaarNo}
                onChange={(e) => setAadhaarNo(e.target.value)}
                placeholder="Enter Aadhaar Number"
              />
            </div>
          )}

          <div className="pd-form-group">
            <label className="pd-label">Biometric Type</label>
            <div className="pd-radio-group">
              {[
                { label: 'Fingerprint Scan', value: 'fingerprintScan' },
                { label: 'Face Scan', value: 'faceScan' }
              ].map(opt => (
                <label 
                  key={opt.value}
                  className={`pd-radio-label ${biometriType === opt.value ? 'pd-radio-selected' : ''}`}
                  onClick={() => setBiometriType(opt.value)}
                >
                  <span className="pd-radio-circle">
                    {biometriType === opt.value && <span className="pd-radio-dot" />}
                  </span>
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="pd-submit-btn" style={{ marginTop: '24px' }}>
            Capture Biometrics
          </button>
        </form>
      </div>
    </div>
  );
};

export default AadhaarSeedingCheckSA;
