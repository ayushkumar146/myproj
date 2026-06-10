import React, { useState } from 'react';
import './PersonalDetailsSA.css';
import './DeclarationSA.css';

const AadhaarSeedingDeclarationSA = ({ processVariables, onFormSubmit }) => {
  const [checkbox_qw84ca, setCheckbox_qw84ca] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkbox_qw84ca) {
      setError('Please accept the declaration to proceed.');
      return;
    }
    
    onFormSubmit({
      seedingDeclaration: {
        checkbox_qw84ca
      }
    });
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
    // If the process engine handles cancel through a specific variable, it could be passed here.
  };

  return (
    <div className="pd-container">
      <div className="pd-card aadhaar-declaration-card">
        <h2 className="pd-title" style={{ marginBottom: '24px' }}>Declaration</h2>
        
        {error && (
          <div className="pd-global-errors" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <style>{`
          .aadhaar-declaration-card .pd-title {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 400;
            font-size: 24px;
            line-height: 100%;
            letter-spacing: 0.1px;
            text-align: center;
            color: rgba(0, 0, 0, 1);
            margin: 0 0 24px 0;
          }

          .aadhaar-declaration-card .review-text {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 300;
            font-size: 16px;
            line-height: 100%;
            letter-spacing: 0.1px;
            text-align: center;
            color: rgba(0, 0, 0, 1);
            margin: 0 0 24px 0;
          }

          .aadhaar-declaration-form .dec-text ol,
          .aadhaar-declaration-form .dec-text li {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 300;
            font-size: 14px;
            line-height: 23px;
            letter-spacing: 0%;
            color: rgba(153, 153, 153, 1);
            margin: 0;
          }
        `}</style>

        <form onSubmit={handleSubmit} className="pd-form aadhaar-declaration-form">
          <p className="review-text">Review all the details and confirm this application.</p>

          <div className="dec-checkbox-group" style={{ margin: 0 }}>
            <input 
              type="checkbox" 
              className="dec-checkbox" 
              checked={checkbox_qw84ca} 
              onChange={e => setCheckbox_qw84ca(e.target.checked)} 
            />
            <div className="dec-text">
              <ol style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '10px' }}>
                      I hereby declare that all the above information voluntarily furnished by me is true, accurate, correct and complete.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                      I understand the nature of information (DOB & Gender) that may be shared upon authentication. I understand that my information submitted to the Bank herewith shall not be used for any purpose other than mentioned above or as per requirements.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                      I understand and agree that in case of authentication failure with UIDAI records, my Aadhaar number will not be updated in the bank records.
                  </li>
              </ol>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button 
              type="button" 
              className="pd-submit-btn" 
              style={{ flex: 1, backgroundColor: '#f5f5f5', color: '#333', border: '1px solid #ccc' }}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="pd-submit-btn" style={{ flex: 1 }}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AadhaarSeedingDeclarationSA;
