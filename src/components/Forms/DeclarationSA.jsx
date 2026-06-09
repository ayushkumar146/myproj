import React, { useState, useMemo } from 'react';
import './DeclarationSA.css';

const DeclarationSA = ({ onFormSubmit, processVariables }) => {
  // ── Helper to resolve a value from processVariables ───────────────────────
  const getProcessVar = (path, defaultValue) => {
    if (!processVariables) return defaultValue;
    if (processVariables[path] !== undefined && processVariables[path] !== null)
      return processVariables[path];

    const parts = path.split('.');
    let current = processVariables;
    let found = true;
    for (const part of parts) {
      if (current && typeof current === 'object' && current[part] !== undefined && current[part] !== null) {
        current = current[part];
      } else { found = false; break; }
    }
    if (found) return current;

    const leafKey = parts[parts.length - 1];
    const recursiveFind = (obj, key) => {
      if (!obj || typeof obj !== 'object') return undefined;
      const lk = key.toLowerCase();
      const fk = Object.keys(obj).find(k => k.toLowerCase() === lk);
      if (fk !== undefined && obj[fk] !== undefined && obj[fk] !== null) return obj[fk];
      for (const k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          const v = recursiveFind(obj[k], key);
          if (v !== undefined) return v;
        }
      }
      return undefined;
    };
    const v = recursiveFind(processVariables, leafKey);
    return v !== undefined ? v : defaultValue;
  };
  // ─────────────────────────────────────────────────────────────────────────

  // ── Initial values from processVariables ──────────────────────────────────
  const [checkbox_3q039w, setCheckbox_3q039w] = useState(getProcessVar('declaration.checkbox_3q039w', false));
  const [checkbox_rlsaoa, setCheckbox_rlsaoa] = useState(getProcessVar('declaration.checkbox_rlsaoa', false));
  const [checkbox_ykmhve, setCheckbox_ykmhve] = useState(getProcessVar('declaration.checkbox_ykmhve', false));
  const [checkbox_7fgjrm, setCheckbox_7fgjrm] = useState(getProcessVar('declaration.checkbox_7fgjrm', false));
  const [checkbox_fne9f,  setCheckbox_fne9f]  = useState(getProcessVar('declaration.checkbox_fne9f', false));
  const [checkbox_j4c184, setCheckbox_j4c184] = useState(getProcessVar('declaration.checkbox_j4c184', false));
  const [checkbox_y11xwl, setCheckbox_y11xwl] = useState(getProcessVar('declaration.checkbox_y11xwl', false));
  const [checkbox_ysqcqs, setCheckbox_ysqcqs] = useState(getProcessVar('declaration.checkbox_ysqcqs', false));
  const [checkbox_qtcw2a, setCheckbox_qtcw2a] = useState(getProcessVar('declaration.checkbox_qtcw2a', false));
  const [checkbox_3nhy8h, setCheckbox_3nhy8h] = useState(getProcessVar('declaration.checkbox_3nhy8h', false));
  const [isAepsEnabled,   setIsAepsEnabled]   = useState(getProcessVar('declaration.isAepsEnabled', ''));
  const [checkbox_9luyp9, setCheckbox_9luyp9] = useState(getProcessVar('declaration.checkbox_9luyp9', false));
  const [checkbox_8k3lwn, setCheckbox_8k3lwn] = useState(getProcessVar('declaration.checkbox_8k3lwn', false));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // ── Validation ────────────────────────────────────────────────────────────
  const errors = useMemo(() => {
    const e = {};
    if (!checkbox_rlsaoa) e.checkbox_rlsaoa = 'You must accept this to proceed.';
    return e;
  }, [checkbox_rlsaoa]);

  const isFormValid = Object.keys(errors).length === 0;
  const touch = (field) => setTouched(prev => ({ ...prev, [field]: true }));
  const showError = (field) => touched[field] && errors[field];

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      ['checkbox_rlsaoa'].map(k => [k, true])
    );
    setTouched(allTouched);

    if (!isFormValid) return;

    setIsSubmitting(true);
    const payload = {
      declaration: {
        checkbox_3q039w, checkbox_rlsaoa, checkbox_ykmhve, checkbox_7fgjrm,
        checkbox_fne9f, checkbox_j4c184, checkbox_y11xwl, checkbox_ysqcqs,
        checkbox_qtcw2a, checkbox_3nhy8h, isAepsEnabled,
        checkbox_9luyp9, checkbox_8k3lwn,
        fieldCount: '10'
      },
      fieldCount: '10'
    };
    onFormSubmit(payload);
  };

  return (
    <div className="pd-container">
      <div className="pd-card dec-card">
        <header className="pd-header dec-header">
          <h2 className="pd-title">Declaration</h2>
        </header>

        <form onSubmit={handleSubmit} className="pd-form dec-form" noValidate>
          
          {/* FATCA Declaration */}
          <div className="dec-checkbox-group">
            <input type="checkbox" className="dec-checkbox" checked={checkbox_3q039w} onChange={e => setCheckbox_3q039w(e.target.checked)} />
            <div className="dec-text">
              <strong>FATCA Declaration</strong>
              <p>Customer declares that he/she is a resident of India by birth and does not hold citizenship of any other country (dual/multiple/green card). The customer further confirms that he/she is not a tax resident of any country other than India. The customer or POA/mandate holder also confirms that there is no address or telephone number outside India.</p>
            </div>
          </div>

          <hr className="dec-divider" />

          {/* BSBDA Consent (Required) */}
          <div className="dec-checkbox-group">
            <input 
              type="checkbox" 
              className={`dec-checkbox ${showError('checkbox_rlsaoa') ? 'dec-checkbox-error' : ''}`}
              checked={checkbox_rlsaoa} 
              onChange={e => { setCheckbox_rlsaoa(e.target.checked); touch('checkbox_rlsaoa'); }} 
            />
            <div className="dec-text">
              <strong>BSBDA Consent</strong>
              <p>I Understand That The Below Facilities Is Not Provided By Default Under Basic Savings Bank Deposit (BSBDA) And Will Be Extended Only Upon My Explicit Request.</p>
              <br />
              <p>I hereby provide my consent to avail the optional facilities as selected by me below:</p>
              {showError('checkbox_rlsaoa') && <span className="pd-error-msg">{errors.checkbox_rlsaoa}</span>}
            </div>
          </div>

          {/* Cheque Book Facility */}
          <div className="dec-text" style={{ marginLeft: '32px', marginBottom: '12px' }}>
            <strong>Cheque Book Facility</strong>
            <p className="dec-subtitle">Please Tick</p>
            <div className="dec-inline-checkboxes">
              <label className="dec-inline-label">
                <input type="checkbox" className="dec-checkbox" checked={checkbox_ykmhve} onChange={e => setCheckbox_ykmhve(e.target.checked)} /> Yes
              </label>
              <label className="dec-inline-label">
                <input type="checkbox" className="dec-checkbox" checked={checkbox_7fgjrm} onChange={e => setCheckbox_7fgjrm(e.target.checked)} /> No
              </label>
            </div>
            <p className="dec-note"><strong>Note:</strong> 5 Cheque Leaves Shall Be Provided In The Welcome Kit. Thereafter Additional Cheque Leaves Can Be Requested Through Digital Channels Such As Net Banking, Mobile Banking Or Also By Visiting Nearest Kotak Mahindra Bank Branch. In A Year 25 Cheque Leaves Shall Be Issued Free Of Cost.</p>
          </div>

          {/* Account Statement / Passbook */}
          <div className="dec-checkbox-group">
            <input type="checkbox" className="dec-checkbox" checked={checkbox_fne9f} onChange={e => setCheckbox_fne9f(e.target.checked)} />
            <div className="dec-text">
              <strong>Account Statement /Passbook</strong>
              <p>I/We Consent To Receive Monthly Statements On The Email Address Registered With The Bank. If Email ID Is Not Registered, Statements Can Be Sent Via SMS To The Registered Mobile Number. If Neither Email Address Nor The Mobile Number Is Registered, Physical Statements Will Be Mailed Monthly To The Registered Mailing Address.</p>
            </div>
          </div>
          
          <div className="dec-checkbox-group">
            <input type="checkbox" className="dec-checkbox" checked={checkbox_j4c184} onChange={e => setCheckbox_j4c184(e.target.checked)} />
            <div className="dec-text">
              <p>To Apply For Passbook Please Tick</p>
            </div>
          </div>

          {/* Channels Access Request */}
          <div className="dec-text" style={{ marginLeft: '32px', marginBottom: '12px' }}>
            <strong>Channels Access Request</strong>
            <div className="dec-subtitle">(Deposit Account(s))</div>
          </div>
            
          <div className="dec-checkbox-group">
            <input type="checkbox" className="dec-checkbox" checked={checkbox_y11xwl} onChange={e => setCheckbox_y11xwl(e.target.checked)} />
            <span className="dec-text">Mobile Banking</span>
          </div>
          <div className="dec-checkbox-group">
            <input type="checkbox" className="dec-checkbox" checked={checkbox_ysqcqs} onChange={e => setCheckbox_ysqcqs(e.target.checked)} />
            <span className="dec-text">Net Banking</span>
          </div>
          <div className="dec-checkbox-group">
            <input type="checkbox" className="dec-checkbox" checked={checkbox_qtcw2a} onChange={e => setCheckbox_qtcw2a(e.target.checked)} />
            <span className="dec-text">Debit Card</span>
          </div>

          <div className="dec-checkbox-group">
            <input type="checkbox" className="dec-checkbox" checked={checkbox_3nhy8h} onChange={e => setCheckbox_3nhy8h(e.target.checked)} />
            <div className="dec-text">
              <strong>I Hereby Confirm That:</strong>
              <ul className="dec-list">
                <li>I have been informed that the above facilities is optional as per RBI directions.</li>
                <li>I am requesting only those facilities that I have selected at the time of account opening.</li>
                <li>Facilities that I have not opted for shall remain disabled.</li>
                <li>I understand that, for all detailed BSBDA features and services, applicable charges, I shall refer to the General Schedule of Features and Charges (GSFC), as available on the bank's website.</li>
                <li>I understand that for discontinuation of any BSBDA features or services, I may place a request by calling the bank’s 24×7 toll-free customer experience centre or by visiting the nearest Kotak Mahindra Bank branch.</li>
              </ul>
            </div>
          </div>

          <div className="dec-text" style={{ marginLeft: '32px', marginTop: '-8px' }}>
            <p>I further understand that I may request these facilities at any time in the future through digital channels such as net banking, mobile banking, or by visiting the nearest Kotak Mahindra Bank branch.</p>
          </div>

          <hr className="dec-divider" />

          {/* AePS Radio */}
          <div className="pd-form-group">
            <label className="pd-label">Enable AePS Service</label>
            <div className="pd-radio-group">
              {['Yes', 'No'].map(opt => (
                <label
                  key={opt}
                  className={`pd-radio-label ${isAepsEnabled === opt ? 'pd-radio-selected' : ''}`}
                  onClick={() => setIsAepsEnabled(opt)}
                >
                  <span className="pd-radio-circle">
                    {isAepsEnabled === opt && <span className="pd-radio-dot" />}
                  </span>
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <hr className="dec-divider" />

          {/* Remaining terms */}
          <div className="dec-terms-box">
            <div className="dec-checkbox-group">
              <input type="checkbox" className="dec-checkbox" checked={checkbox_9luyp9} onChange={e => setCheckbox_9luyp9(e.target.checked)} />
              <div className="dec-text">
                <p>I Am Neither A Politically Exposed Person (PEP) Nor A Relative Or A Close Associate Of A PEP.</p>
              </div>
            </div>

            <div className="dec-text" style={{ marginLeft: '32px' }}>
              <p>For Investment, I Agree And Authorize Kotak Mahindra Bank To Validate My KYC Status With A KYC Registry Agency (KRA).</p>
            </div>

            <div className="dec-text" style={{ marginLeft: '32px' }}>
              <p>I Understand, Agree To Give My Consent To Share My Details, Wherever Necessary, With Relevant Govt./Regulatory/ Enforcement Authorities/Registered Partners /Vendors/Business Correspondence And Also Run Risk And Security Checks.</p>
            </div>

            <div className="dec-text" style={{ marginLeft: '32px' }}>
              <p>I Hereby Agree To Terms And Condition And Give My Consent To Receive All Important Notifications On Whatsapp.</p>
            </div>

            <div className="dec-checkbox-group" style={{ marginTop: '12px' }}>
              <input type="checkbox" className="dec-checkbox" checked={checkbox_8k3lwn} onChange={e => setCheckbox_8k3lwn(e.target.checked)} />
              <div className="dec-text">
                <p>I agree the <a href="#" style={{color: '#00529B', textTransform: 'none'}}>Terms & Conditions</a></p>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="pd-submit-btn"
            style={{marginTop: '24px'}}
          >
            {isSubmitting ? 'Processing...' : 'Proceed'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default DeclarationSA;
