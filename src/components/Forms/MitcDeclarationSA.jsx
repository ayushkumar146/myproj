import React, { useState } from 'react';
import './PersonalDetailsSA.css';

const MitcDeclarationSA = ({ processVariables, onFormSubmit }) => {
  const [checkbox_ch76xl, setCheckbox_ch76xl] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkbox_ch76xl) {
      setError('Please accept the MITC Declaration to proceed.');
      return;
    }
    
    onFormSubmit({
      mitcDeclaration: {
        checkbox_ch76xl
      }
    });
  };

  return (
    <div className="pd-container">
      <div className="pd-card">
        <h2 className="mitc-heading">MITC Declaration</h2>
        
        {error && (
          <div className="pd-global-errors" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <style>{`
          .mitc-heading {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 700;
            font-style: normal;
            font-size: 22px;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: center;
            color: rgba(0, 0, 0, 1);
            margin: 0 0 24px 0;
          }

          .mitc-content-box {
            border: 1px solid rgba(235, 235, 236, 1);
            border-radius: 4px;
            padding: 16px 12px;
            margin-bottom: 24px;
          }

          .mitc-layout-wrapper {
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }

          .mitc-checkbox {
            width: 20px;
            height: 20px;
            accent-color: #00529B;
            cursor: pointer;
            margin: 0;
            flex-shrink: 0;
            margin-top: -2px; /* align center with the label */
          }

          .mitc-text-column {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .mitc-checkbox-label {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 700;
            font-style: normal;
            font-size: 16px;
            line-height: 100%;
            letter-spacing: 0%;
            vertical-align: middle;
            text-transform: capitalize;
            color: rgba(0, 0, 0, 1);
            cursor: pointer;
          }

          .mitc-paragraph {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 300;
            font-style: normal;
            font-size: 16px;
            line-height: 27px;
            letter-spacing: 0%;
            text-transform: capitalize;
            color: rgba(0, 0, 0, 1);
            margin: 0;
          }
        `}</style>

        <form onSubmit={handleSubmit} className="pd-form">
          <div className="mitc-content-box">
            <div className="mitc-layout-wrapper">
              <input 
                type="checkbox" 
                checked={checkbox_ch76xl}
                onChange={e => setCheckbox_ch76xl(e.target.checked)}
                className="mitc-checkbox"
                id="mitc-checkbox-input"
              />
              <div className="mitc-text-column">
                <label className="mitc-checkbox-label" htmlFor="mitc-checkbox-input">MITC Declaration</label>

                <p className="mitc-paragraph">
                  I / We have applied for opening of Basic Savings Bank Deposit Account (BSBDA-Full KYC account) and the applicable / AMB for the same is Rs 0/- (Zero).
                </p>

                <p className="mitc-paragraph">
                  I / We understand that the interest rates in Savings Account have been de-regularized by RBI. These rates may vary from time to time and will be calculated on a daily basis on clear balances. The interest on Savings Account will be at quarterly intervals or as prescribed by Reserve Bank of India from time to time.
                </p>

                <p className="mitc-paragraph">
                  I / We also declare that, I/we shall close my/our existing BSBD account (if any held either as single or joint holder) with the bank within 30 days from the date of opening new BSBDA Account failing which the bank reserves the right to force close my/our (if held jointly) existing additional BSBD account, transfer / closure of all other facilities linked to that account and transfer / credit the further proceeds to my/our new BSBD Account without any notice to me/us and the bank will not be held liable for consequences arising out of such situation.
                </p>

                <p className="mitc-paragraph">
                  I/we also understand that in the event of any regulatory lien / freeze on my/our existing BSBD account, Bank reserves the right to close my/our new BSBDA/Small Account as applicable.
                </p>

                <p className="mitc-paragraph">
                  In Case of BSBDA/Small account, I/we also understand that in the event where I/we have failed to declare of holding existing BSBD account (either as single or jointly holder), the bank reserves the right to identify and transfer / force close all such BSBD accounts without any notice to me/us and credit the transfer / closure proceeds to my/our new BSBD Account.
                </p>

                <p className="mitc-paragraph">
                  I/we understand that, as a BSBDA/Small Account Holder, I/we am/are not eligible for opening another BSBD account with Kotak Mahindra Bank or any other Bank and the Bank reserves the right to decline me/us opening such additional BSBDA/Small Account.
                </p>

                <p className="mitc-paragraph">
                  I/we understand that, as a BSBDA Account Holder that the Bank at its discretion may / may not offer any additional value added services including chequebook, which may be charged to me/us.
                </p>

                <p className="mitc-paragraph">
                  I/We hereby declare and confirm that I/We am/are not holding BSBDA account with any other bank.
                </p>

                <p className="mitc-paragraph">
                  I/we confirm that the difference between the features of a BSBD Account and a various Savings bank Account has been explained to me during account opening as per GSFC
                </p>
              </div>
            </div>
          </div>

          <button type="submit" className="pd-submit-btn">
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default MitcDeclarationSA;
