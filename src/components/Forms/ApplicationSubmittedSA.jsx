import React from 'react';
import './PersonalDetailsSA.css';

const ApplicationSubmittedSA = ({ processVariables, onFormSubmit }) => {

  const handleDone = (e) => {
    e.preventDefault();
    onFormSubmit({});
  };

  const customerName = `${processVariables?.firstName || ''} ${processVariables?.lastName || ''}`.trim() || 'N/A';
  const leadId = processVariables?.leadId || 'N/A';
  const crnNo = processVariables?.crn || 'N/A';
  const accountNo = processVariables?.accountNumber || 'N/A';

  return (
    <div className="app-submit-overlay">
      <div className="app-submit-modal">
        <style>{`
          .app-submit-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .app-submit-modal {
            background: #fff;
            width: 90%;
            max-width: 400px;
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            position: relative;
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
          }
          .app-submit-close {
            position: absolute;
            top: 16px; right: 16px;
            font-size: 24px;
            cursor: pointer;
            color: #00529B;
            background: none;
            border: none;
            line-height: 1;
          }
          .app-submit-heading {
            font-size: 20px;
            font-weight: 400;
            margin-top: 8px;
            margin-bottom: 32px;
            color: #000;
          }
          .app-submit-icon {
            width: 80px;
            height: 80px;
            background: #00529B;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
          }
          .app-submit-text {
            font-size: 16px;
            font-weight: 300;
            line-height: 1.5;
            color: #333;
            margin-bottom: 32px;
          }
          .app-submit-btn {
            background: #003B70;
            color: #fff;
            border: none;
            padding: 14px 24px;
            width: 100%;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
          }
        `}</style>

        <button className="app-submit-close" onClick={handleDone}>×</button>
        <h3 className="app-submit-heading">Application Submitted</h3>
        
        <div className="app-submit-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <p className="app-submit-text">
          Account Opening lead has been submitted successfully for Customer {customerName}, {leadId}, {crnNo}, {accountNo}. Account will be activated after validation in assigned TAT
        </p>

        <form onSubmit={handleDone}>
          <button type="submit" className="app-submit-btn">
            Done
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationSubmittedSA;
