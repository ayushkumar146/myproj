import React, { useState, useEffect } from 'react';
import './FingerprintScanKotak.css';

const FingerprintScanKotak = ({ onFormSubmit, processVariables }) => {
  const isInitiallyCompleted = 
    processVariables?.fingerPrintKotak?.fingerPrintScanStatus === 'SUCCESS' || 
    processVariables?.fingerPrintScanStatus === 'SUCCESS';

  const [scanStatus, setScanStatus] = useState(isInitiallyCompleted ? 'completed' : 'ready');
  const [scanProgress, setScanProgress] = useState(isInitiallyCompleted ? 100 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval;
    if (scanStatus === 'scanning') {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanStatus('completed');
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [scanStatus]);

  const handleStartScan = () => {
    setScanStatus('scanning');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (scanStatus !== 'completed') return;

    setIsSubmitting(true);
    const payload = {
      fingerPrintKotak: {
        fingerPrintScanStatus: 'SUCCESS',
        scanCompletedAt: new Date().toISOString()
      },
      fingerPrintScanStatus: 'SUCCESS'
    };
    onFormSubmit(payload);
  };

  return (
    <div className="fingerprint-scan-container">
      <div className="fingerprint-scan-card">
        <header className="fingerprint-scan-header">
          <h2>Fingerprint Scan</h2>
          <h3>Biometric Identity Verification</h3>
        </header>

        <form onSubmit={handleSubmit} className="fingerprint-scan-form">
          {/* Custom Fingerprint Scanning Area representing the "Group" field */}
          <div className="scanner-group-box">
            <div className="sensor-viewfinder">
              {/* Target Corners */}
              <div className="viewfinder-corner top-left"></div>
              <div className="viewfinder-corner top-right"></div>
              <div className="viewfinder-corner bottom-left"></div>
              <div className="viewfinder-corner bottom-right"></div>

              {/* Scanning animations and visual templates */}
              <div className={`fingerprint-silhouette-container ${scanStatus}`}>
                {/* Fingerprint icon path */}
                <svg className="fingerprint-silhouette" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M12 2C6.48 2 2 6.48 2 12M12 4c-4.42 0-8 3.58-8 8M12 6c-3.31 0-6 2.69-6 6M12 8c-2.21 0-4 1.79-4 4M12 10c-1.1 0-2 .9-2 2" strokeLinecap="round" />
                  <path d="M12 22c5.52 0 10-4.48 10-10M12 20c4.42 0 8-3.58 8-8M12 18c3.31 0 6-2.69 6-6M12 16c2.21 0 4-1.79 4-4M12 14c1.1 0 2-.9 2-2" strokeLinecap="round" />
                  <path d="M12 12v2M9 15c.6 1.2 1.8 2 3 2s2.4-.8 3-2" strokeLinecap="round" />
                  <path d="M7.5 17.5c1.1 2.2 3.3 3.5 4.5 3.5s3.4-1.3 4.5-3.5" strokeLinecap="round" />
                </svg>

                {/* Animated scan line */}
                {scanStatus === 'scanning' && (
                  <div className="scanner-glow-bar" style={{ top: `${scanProgress}%` }}></div>
                )}

                {/* Scanning Success Overlay */}
                {scanStatus === 'completed' && (
                  <div className="scan-success-badge animate-scale">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Scan Feedback and Trigger Controls */}
            <div className="scan-feedback-area">
              {scanStatus === 'ready' && (
                <>
                  <p className="scan-instructions">Place your registered finger on the biometric scanner and click capture.</p>
                  <button type="button" className="start-scan-btn" onClick={handleStartScan}>
                    Capture Fingerprint
                  </button>
                </>
              )}

              {scanStatus === 'scanning' && (
                <>
                  <p className="scan-status-text scanning animate-pulse">Scanning... {scanProgress}%</p>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                </>
              )}

              {scanStatus === 'completed' && (
                <p className="scan-status-text completed">Verification Complete. Proceed to submit.</p>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={scanStatus !== 'completed' || isSubmitting}
            className="fingerprint-scan-submit-btn"
          >
            {isSubmitting ? 'Completing Task...' : 'Proceed'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FingerprintScanKotak;
