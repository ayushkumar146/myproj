import React, { useState } from 'react';
import './PersonalDetailsSA.css';
import './DeclarationSA.css';

const AadhaarSeeding1SA = ({ processVariables, onFormSubmit }) => {
  const [isAadhaarSeed, setIsAadhaarSeed] = useState('Yes');
  const [bankName, setBankName] = useState('');
  const [iin, setIin] = useState('');
  const [checkbox_zbkgwc, setCheckbox_zbkgwc] = useState(false);
  const [checkbox_s2efty, setCheckbox_s2efty] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkbox_zbkgwc || !checkbox_s2efty) {
      setError('Please accept all declarations to proceed.');
      return;
    }
    
    onFormSubmit({
      aadhaarSeedingInitiate: {
        isAadhaarSeed,
        bankName,
        iin,
        checkbox_zbkgwc,
        checkbox_s2efty
      }
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
          .aadhaar-seeding-form .blue-label {
            color: rgba(11, 77, 136, 1);
          }
          .aadhaar-seeding-form .dec-text p {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 300;
            font-size: 14px;
            line-height: 23px;
            letter-spacing: 0%;
            color: rgba(153, 153, 153, 1);
          }
        `}</style>

        <form onSubmit={handleSubmit} className="pd-form aadhaar-seeding-form">
          <div className="pd-form-group">
            <label className="pd-label">Do you want to seed Aadhaar for DBT in this account?</label>
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

          <div className="pd-form-group">
            <label className="pd-label blue-label">Name of the Bank</label>
            <input
              type="text"
              className="pd-input"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter Name of the Bank"
            />
          </div>

          <div className="pd-form-group">
            <label className="pd-label blue-label">IIN</label>
            <input
              type="text"
              className="pd-input"
              value={iin}
              onChange={(e) => setIin(e.target.value)}
              placeholder="Enter IIN"
            />
          </div>

          <div className="dec-checkbox-group" style={{ marginTop: '16px', marginBottom: 0 }}>
            <input 
              type="checkbox" 
              className="dec-checkbox" 
              checked={checkbox_zbkgwc} 
              onChange={e => setCheckbox_zbkgwc(e.target.checked)} 
            />
            <div className="dec-text">
              <p>I wish to seed my Aadhaar Number with Kotak Bank account to enable me to receive Direct Benefit Transfer(DBT) including LPG Subidy from Govt. of India(GO).I understand that if more than one benefit transfer is due to me, I will receive all the benefit transfers in the same account. (Select this option if you have not seeded any account elsewhere for DBT)</p>
            </div>
          </div>

          <div className="dec-checkbox-group" style={{ margin: 0 }}>
            <input 
              type="checkbox" 
              className="dec-checkbox" 
              checked={checkbox_s2efty} 
              onChange={e => setCheckbox_s2efty(e.target.checked)} 
            />
            <div className="dec-text">
              <p>I confirm to have read understood and agree to the Declaration.</p>
            </div>
          </div>

          <button type="submit" className="pd-submit-btn" style={{ marginTop: '24px' }}>
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default AadhaarSeeding1SA;
