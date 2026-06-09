import React, { useState, useEffect } from 'react';
import './FaceScanKotak.css';

const FaceScanKotak = ({ onFormSubmit, processVariables }) => {
  const isInitiallyCompleted = 
    processVariables?.faceScanKotak?.faceScanStatus === 'SUCCESS' || 
    processVariables?.faceScanStatus === 'SUCCESS';

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
      faceScanKotak: {
        faceScanStatus: 'SUCCESS',
        scanCompletedAt: new Date().toISOString()
      },
      faceScanStatus: 'SUCCESS'
    };
    onFormSubmit(payload);
  };

  return (
    <div className="face-scan-container">
      <div className="face-scan-card">
        <header className="face-scan-header">
          <h2>Face Scan</h2>
          <h3>Biometric Identity Verification</h3>
        </header>

        <form onSubmit={handleSubmit} className="face-scan-form">
          {/* Custom Face Scanning Area representing the "Group" field */}
          <div className="scanner-group-box">
            <div className="camera-viewfinder">
              {/* Target Corners */}
              <div className="viewfinder-corner top-left"></div>
              <div className="viewfinder-corner top-right"></div>
              <div className="viewfinder-corner bottom-left"></div>
              <div className="viewfinder-corner bottom-right"></div>

              {/* Scanning animations and visual templates */}
              <div className={`face-silhouette-container ${scanStatus}`}>
                <svg className="face-silhouette" viewBox="0 0 100 100" fill="none">
                  {/* Outer head outline */}
                  <path 
                    d="M50 15 C32 15 25 28 25 48 C25 68 32 80 50 80 C68 80 75 68 75 48 C75 28 68 15 50 15 Z" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    strokeDasharray={scanStatus === 'scanning' ? '4 2' : 'none'}
                  />
                  {/* Shoulders */}
                  <path 
                    d="M15 95 C15 85 30 82 50 82 C70 82 85 85 85 95" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  />
                  {/* Eyes guidelines */}
                  <path d="M40 43 A 2.5 2.5 0 1 1 35 43 A 2.5 2.5 0 1 1 40 43" fill="currentColor" opacity="0.6" />
                  <path d="M65 43 A 2.5 2.5 0 1 1 60 43 A 2.5 2.5 0 1 1 65 43" fill="currentColor" opacity="0.6" />
                  {/* Nose guideline */}
                  <path d="M50 43 L50 53 L47 53" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                  {/* Mouth guideline */}
                  <path d="M43 62 Q50 67 57 62" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
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
                  <p className="scan-instructions">Position your face within the frame and click below to capture.</p>
                  <button type="button" className="start-scan-btn" onClick={handleStartScan}>
                    Capture Face
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
            className="face-scan-submit-btn"
          >
            {isSubmitting ? 'Completing Task...' : 'Proceed'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FaceScanKotak;
