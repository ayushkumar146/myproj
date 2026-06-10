import React, { useState } from 'react';
import { login } from '../services/api';

const LoginPage = ({ onLoginSuccess, onTestBiometric }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async () => {
    setLoading(true);
    setError('');
    try {
      // Using the hardcoded credentials as requested
      const response = await login('jio_admin', 'Jio@2026');
      onLoginSuccess(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Kotak_Mahindra_Bank_logo.svg" alt="Kotak Logo" className="bank-logo" />
          <h2 className="welcome-text">Welcome back</h2>
          <p className="welcome-subtext">
            Ready to synchronize with the banking platform?
          </p>
        </div>
        
        {error && <div className="login-error-banner">{error}</div>}
        
        <button 
          className="enter-dashboard-btn" 
          onClick={handleLoginClick} 
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="mini-spinner"></span>
              Authenticating...
            </span>
          ) : (
            'Enter Dashboard'
          )}
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={onTestBiometric}
            style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #0052cc', color: '#0052cc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Test Biometric Device
          </button>
        </div>
        
        <div className="login-footer">
          <p>© 2026 iServeU Technology Private Limited</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
