import React, { useState } from 'react';
import './PersonalDetailsSA.css';

const CustomerMeetingLocationSA = ({ processVariables, onFormSubmit }) => {
  const [leadGenerator, setLeadGenerator] = useState('');
  const [leadConvertor, setLeadConvertor] = useState('');
  const [leadInitiator, setLeadInitiator] = useState('');
  const [customerMeetingLocation, setCustomerMeetingLocation] = useState('Met Customer at communication address');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerMeetingLocation) {
      setError('Please select a customer meeting location');
      return;
    }
    
    onFormSubmit({
      customerMeetLocation: {
        leadGenerator,
        leadConvertor,
        leadInitiator,
        customerMeetingLocation
      }
    });
  };

  return (
    <div className="pd-container">
      <div className="pd-card customer-meeting-form">
        <h2 className="cm-heading">Customer Meeting Location</h2>
        <p className="cm-subtitle">Please share bank use information</p>
        
        {error && (
          <div className="pd-global-errors" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <style>{`
          .customer-meeting-form .cm-heading {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 700;
            font-size: 22px;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: center;
            color: rgba(0, 0, 0, 1);
            margin: 0 0 8px 0;
          }

          .customer-meeting-form .cm-subtitle {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 300;
            font-size: 16px;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: left;
            color: rgba(0, 0, 0, 1);
            margin: 0 0 24px 0;
          }

          .customer-meeting-form .pd-label {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 400;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0%;
            color: rgba(11, 77, 136, 1);
          }

          .customer-meeting-form .cm-radio-heading {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 400;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0%;
            color: rgba(0, 0, 0, 1);
            margin-bottom: 6px;
            display: block;
          }

          .customer-meeting-form .pd-radio-label {
            font-family: 'Frutiger LT Std', 'Outfit', sans-serif;
            font-weight: 300;
            font-size: 14px;
            line-height: 140%;
            letter-spacing: -1%;
            text-transform: capitalize;
            color: rgba(0, 0, 0, 1);
          }

          .customer-meeting-form .cm-radio-container {
            padding: 18px 24px;
            gap: 12px;
            border-radius: 6px;
            border: 1px solid rgba(235, 235, 236, 1);
            background-color: rgba(255, 255, 255, 1);
            display: flex;
            flex-direction: column;
            margin-top: 16px;
          }

        `}</style>

        <form onSubmit={handleSubmit} className="pd-form">
          <div className="pd-form-group">
            <label className="pd-label">Lead Generator</label>
            <input
              type="text"
              className="pd-input"
              value={leadGenerator}
              onChange={(e) => setLeadGenerator(e.target.value)}
              placeholder="Enter Lead Generator"
            />
          </div>

          <div className="pd-form-group">
            <label className="pd-label">Lead Convertor</label>
            <input
              type="text"
              className="pd-input"
              value={leadConvertor}
              onChange={(e) => setLeadConvertor(e.target.value)}
              placeholder="Enter Lead Convertor"
            />
          </div>

          <div className="pd-form-group">
            <label className="pd-label">Lead Initiator</label>
            <input
              type="text"
              className="pd-input"
              value={leadInitiator}
              onChange={(e) => setLeadInitiator(e.target.value)}
              placeholder="Enter Lead Initiator"
            />
          </div>

          <div className="cm-radio-container">
            <span className="cm-radio-heading">Customer meeting location</span>
            <div className="pd-radio-group" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
              {[
                'Met Customer at communication address',
                'Met customer at Kotak Mahindra Bank Branch',
                'Met customer at BC/BF point.',
                'Others'
              ].map(opt => (
                <label 
                  key={opt}
                  className={`pd-radio-label ${customerMeetingLocation === opt ? 'pd-radio-selected' : ''}`}
                  onClick={() => setCustomerMeetingLocation(opt)}
                >
                  <span className="pd-radio-circle">
                    {customerMeetingLocation === opt && <span className="pd-radio-dot" />}
                  </span>
                  {opt}
                </label>
              ))}
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

export default CustomerMeetingLocationSA;
