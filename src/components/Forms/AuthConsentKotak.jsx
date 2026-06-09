import React, { useState, useEffect } from 'react';
import './AuthConsentKotak.css';

const AuthConsentKotak = ({ onFormSubmit, onClose }) => {
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Audio Simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isPlaying && audioTime < 20) {
      interval = setInterval(() => {
        setAudioTime(prev => prev + 1);
      }, 1000);
    } else if (audioTime >= 20) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, audioTime]);

  const togglePlay = () => {
    if (audioTime >= 20) {
      setAudioTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const formatAudioTime = (seconds) => {
    return `0:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consentChecked) return;

    setIsSubmitting(true);
    const payload = {
      authConsentKotak: {
        consentProvided: true
      },
      consentProvided: true
    };
    onFormSubmit(payload);
  };

  return (
    <div className="modal-backdrop">
      <div className="consent-modal-card">
        {/* Close Button */}
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close biometric consent modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Modal Title */}
        <h2 className="modal-title">Biometric Consent</h2>

        {/* Consent Audio Section */}
        <div className="modal-audio-section">
          <h4 className="audio-section-title">Aadhaar Consent Audio</h4>
          
          <div className="custom-audio-player">
            <button type="button" className="audio-play-btn" onClick={togglePlay}>
              {isPlaying ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
              )}
            </button>

            <span className="audio-timer-display">
              {formatAudioTime(audioTime)} <span className="timer-total">/ 0:20</span>
            </span>

            <div className="audio-progress-bar-container">
              <div 
                className="audio-progress-bar-fill" 
                style={{ width: `${(audioTime / 20) * 100}%` }}
              ></div>
            </div>

            <button type="button" className="audio-volume-btn" aria-label="Volume control">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button>

            <div className="audio-lang-selector">
              <span className="lang-icon">🌐</span>
              <span className="lang-name">English</span>
              <span className="lang-arrow">▼</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-consent-form">
          
          {/* Legal Text with custom checkbox */}
          <div className="modal-consent-text-row">
            <label className="checkbox-label modal-checkbox-label">
              <span className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="hidden-checkbox"
                />
                <span className={`checkbox-custom-box ${consentChecked ? 'checked' : ''}`}>
                  {consentChecked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
              </span>
              <div className="consent-scroll-text">
                I hereby voluntarily provide my consent to Kotak Mahindra Bank to obtain my Aadhaar number, Biometric and/or One Time PIN (OTP) data for authenticating my demographic details (including photograph/eKYC) from UIDAI
                <br /><br />
                I consent to the use of Aadhaar-based authentication for the purpose of processing my request with Kotak Mahindra Bank. I agree and understand that the demographic data or eKYC information received from UIDAI will be used to process my request with Kotak Mahindra Bank
                <br /><br />
                I voluntarily consent to update and link my Aadhaar to all my existing or new bank account/s and customer profile/s for the purpose of operating my account/s and availing banking services,
              </div>
            </label>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!consentChecked || isSubmitting}
            className="modal-proceed-btn"
          >
            {isSubmitting ? 'Processing...' : 'Proceed'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthConsentKotak;
