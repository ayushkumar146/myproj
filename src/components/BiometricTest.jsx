import React, { useState } from 'react';
import { checkBiometricDevice, captureBiometricData } from '../biometric/deviceCheck';

const BiometricTest = ({ onBack }) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectedPort, setConnectedPort] = useState(null);
  const [captureResult, setCaptureResult] = useState('');

  const testDevice = async () => {
    setLoading(true);
    setStatus('Checking for device (MANTRA) on localhost ports...');
    try {
      const response = await checkBiometricDevice("MANTRA", "http");
      setStatus(`Success: ${response.message} (Found on Port: ${response.port})`);
      setConnectedPort(response.port);
      setCaptureResult(''); // Clear previous capture result
    } catch (error) {
      setStatus(`Failed: ${error.message || 'Device not found'}`);
      setConnectedPort(null);
    } finally {
      setLoading(false);
    }
  };

  const captureDevice = async () => {
    if (!connectedPort) return;
    setLoading(true);
    setCaptureResult('Capturing...');
    try {
      const res = await captureBiometricData(connectedPort, "http");
      setCaptureResult(`Capture Success:\n${res.data}`);
    } catch (error) {
      setCaptureResult(`Capture Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-view">
      <div className="form-container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Biometric Device Tester</h2>
        
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          Click the button below to scan local ports (11100-11120) and check if the RD Service is running and the fingerprint device is connected.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="form-submit-btn" 
            onClick={testDevice} 
            disabled={loading}
            style={{ padding: '12px 24px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Processing...' : 'Check Biometric Device'}
          </button>

          {connectedPort && (
            <button 
              className="form-submit-btn" 
              onClick={captureDevice} 
              disabled={loading}
              style={{ padding: '12px 24px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              {loading ? 'Capturing...' : 'Capture Biometric Data'}
            </button>
          )}
          
          <button 
            className="form-back-btn" 
            onClick={onBack}
            style={{ padding: '12px 24px', fontSize: '16px', background: '#f0f0f0', color: '#333', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            Back to Dashboard
          </button>
        </div>

        {status && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            borderRadius: '4px',
            backgroundColor: status.includes('Success') ? '#e6ffe6' : '#ffe6e6',
            color: status.includes('Success') ? '#006600' : '#cc0000',
            border: `1px solid ${status.includes('Success') ? '#00cc00' : '#ff0000'}`,
            wordBreak: 'break-word'
          }}>
            <strong>Status:</strong> {status}
          </div>
        )}

        {captureResult && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            borderRadius: '4px',
            backgroundColor: captureResult.includes('Success') ? '#e6f7ff' : '#ffe6e6',
            color: captureResult.includes('Success') ? '#004085' : '#cc0000',
            border: `1px solid ${captureResult.includes('Success') ? '#b8daff' : '#ff0000'}`,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '300px',
            overflowY: 'auto',
            fontSize: '13px',
            fontFamily: 'monospace'
          }}>
            <strong>Capture Data:</strong>
            <div style={{ marginTop: '8px' }}>{captureResult}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiometricTest;
