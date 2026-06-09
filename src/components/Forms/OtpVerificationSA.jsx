import React, { useState, useEffect } from 'react';
import './OtpVerificationSA.css';

const OtpVerificationSA = ({ onFormSubmit, processVariables, onBack }) => {
  // Helpers
  const getMaskedMobileNumber = () => {
    const num = processVariables?.validateDetails?.mobileNumberLinkedToAadhaar || '';
    if (num.length >= 10) {
      return `XXXXXX${num.slice(-4)}`;
    }
    return 'XXXXXX8945'; // Fallback to mockup phone number
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}.${s < 10 ? '0' : ''}${s}`;
  };

  // State management
  const [mobileOtp, setMobileOtp] = useState(Array(6).fill(''));
  const [emailOtp, setEmailOtp] = useState(Array(6).fill(''));

  // Timers: 5 minutes 30 seconds = 330 seconds
  const [mobileTimer, setMobileTimer] = useState(330);
  const [emailTimer, setEmailTimer] = useState(330);

  // Resend attempts
  const [mobileAttempts, setMobileAttempts] = useState(3);
  const [emailAttempts, setEmailAttempts] = useState(3);

  // Verification states
  const [isMobileVerifying, setIsMobileVerifying] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [mobileError, setMobileError] = useState('');

  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timers
  useEffect(() => {
    let mInterval;
    if (mobileTimer > 0 && !isMobileVerified) {
      mInterval = setInterval(() => {
        setMobileTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(mInterval);
  }, [mobileTimer, isMobileVerified]);

  useEffect(() => {
    let eInterval;
    if (emailTimer > 0 && !isEmailVerified) {
      eInterval = setInterval(() => {
        setEmailTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(eInterval);
  }, [emailTimer, isEmailVerified]);

  // Handle digit changes
  const handleOtpChange = (type, index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const otp = type === 'mobile' ? [...mobileOtp] : [...emailOtp];
    const setOtp = type === 'mobile' ? setMobileOtp : setEmailOtp;

    otp[index] = value.slice(-1);
    setOtp(otp);

    if (type === 'mobile') setMobileError('');
    else setEmailError('');

    // Focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`${type}-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (type, index, e) => {
    const otp = type === 'mobile' ? [...mobileOtp] : [...emailOtp];
    const setOtp = type === 'mobile' ? setMobileOtp : setEmailOtp;

    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otp[index - 1] = '';
        setOtp(otp);
        const prevInput = document.getElementById(`${type}-otp-${index - 1}`);
        if (prevInput) prevInput.focus();
      } else {
        otp[index] = '';
        setOtp(otp);
      }
    }
  };

  const handlePaste = (type, e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split('');
    const otp = type === 'mobile' ? [...mobileOtp] : [...emailOtp];
    const setOtp = type === 'mobile' ? setMobileOtp : setEmailOtp;

    for (let i = 0; i < 6; i++) {
      otp[i] = digits[i] || '';
    }
    setOtp(otp);

    const nextFocusIndex = Math.min(digits.length, 5);
    const nextFocusInput = document.getElementById(`${type}-otp-${nextFocusIndex}`);
    if (nextFocusInput) nextFocusInput.focus();
  };

  const verifyMobileOtp = () => {
    const otpString = mobileOtp.join('');
    if (otpString.length < 6) {
      setMobileError('Please enter a 6-digit OTP.');
      return;
    }
    if (mobileTimer <= 0) {
      setMobileError('OTP has expired.');
      return;
    }

    setMobileError('');
    setIsMobileVerifying(true);
    setTimeout(() => {
      setIsMobileVerifying(false);
      setIsMobileVerified(true);
    }, 1200);
  };

  const verifyEmailOtp = () => {
    const otpString = emailOtp.join('');
    if (otpString.length < 6) {
      setEmailError('Please enter a 6-digit OTP.');
      return;
    }
    if (emailTimer <= 0) {
      setEmailError('OTP has expired.');
      return;
    }

    setEmailError('');
    setIsEmailVerifying(true);
    setTimeout(() => {
      setIsEmailVerifying(false);
      setIsEmailVerified(true);
    }, 1200);
  };

  const handleResend = (type) => {
    if (type === 'mobile') {
      if (mobileAttempts <= 0) return;
      setMobileOtp(Array(6).fill(''));
      setIsMobileVerified(false);
      setMobileTimer(330); // reset to 5:30
      setMobileAttempts(prev => prev - 1);
      setMobileError('');
      const firstInput = document.getElementById('mobile-otp-0');
      if (firstInput) firstInput.focus();
    } else {
      if (emailAttempts <= 0) return;
      setEmailOtp(Array(6).fill(''));
      setIsEmailVerified(false);
      setEmailTimer(330);
      setEmailAttempts(prev => prev - 1);
      setEmailError('');
      const firstInput = document.getElementById('email-otp-0');
      if (firstInput) firstInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isMobileVerified || !isEmailVerified) return;

    setIsSubmitting(true);
    const payload = {
      otpVerification: {
        mobileOtp: mobileOtp.join(''),
        emailOTP: emailOtp.join('')
      }
    };
    onFormSubmit(payload);
  };

  return (
    <div className="otp-form-container">
      <div className="otp-card">
        
        {/* Card Header */}
        <header className="otp-header">
          <h2>Validate</h2>
          {/* <h3>OTP Verification</h3> */}
          {/* <p>Please enter the OTP details sent to your registered contact information to proceed.</p> */}
        </header>

        <form onSubmit={handleSubmit} className="otp-form-content">
          
          {/* Mobile OTP Card Section */}
          <div className="otp-card-section">
            <h4 className="otp-sent-title">OTP sent to Your Mobile Number {getMaskedMobileNumber()}</h4>
            
            <div className="form-group-label">
              <span className="otp-label-text">Mobile OTP</span>
              <span className="required-star">*</span>
            </div>

            <div className="otp-boxes-container">
              {mobileOtp.map((digit, idx) => (
                <input
                  key={`mobile-otp-${idx}`}
                  id={`mobile-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  disabled={isMobileVerified || isMobileVerifying || mobileTimer <= 0}
                  onChange={(e) => handleOtpChange('mobile', idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown('mobile', idx, e)}
                  onPaste={(e) => handlePaste('mobile', e)}
                  className={`otp-digit-input ${isMobileVerified ? 'verified' : ''} ${mobileError ? 'error' : ''}`}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <div className="expiry-timer-text">
              OTP will expire in <strong>{formatTimer(mobileTimer)} minutes.</strong>
            </div>

            <div className="resend-action-container">
              {mobileAttempts > 0 && mobileTimer <= 0 ? (
                <button type="button" onClick={() => handleResend('mobile')} className="resend-active-link">
                  Resend OTP ({mobileAttempts})
                </button>
              ) : mobileAttempts > 0 ? (
                <button 
                  type="button" 
                  onClick={() => handleResend('mobile')} 
                  disabled={isMobileVerified} 
                  className="resend-active-link"
                >
                  Resend OTP ({mobileAttempts})
                </button>
              ) : (
                <span className="resend-disabled-text">Resend limit reached</span>
              )}
            </div>

            {mobileError && <div className="otp-error-message">{mobileError}</div>}

            <div className="verify-btn-container">
              <button
                type="button"
                onClick={verifyMobileOtp}
                disabled={isMobileVerified || isMobileVerifying || mobileOtp.join('').length < 6 || mobileTimer <= 0}
                className={`verify-pill-btn ${isMobileVerified ? 'verified' : ''}`}
              >
                {isMobileVerifying ? (
                  <span className="pill-spinner"></span>
                ) : isMobileVerified ? (
                  <>
                    <svg className="check-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Verified
                  </>
                ) : 'Verify'}
              </button>
            </div>
          </div>

          {/* Email OTP Card Section */}
          <div className="otp-card-section">
            <h4 className="otp-sent-title">OTP sent to Your Email ID</h4>
            
            <div className="form-group-label">
              <span className="otp-label-text">Email OTP</span>
              <span className="required-star">*</span>
            </div>

            <div className="otp-boxes-container">
              {emailOtp.map((digit, idx) => (
                <input
                  key={`email-otp-${idx}`}
                  id={`email-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  disabled={isEmailVerified || isEmailVerifying || emailTimer <= 0}
                  onChange={(e) => handleOtpChange('email', idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown('email', idx, e)}
                  onPaste={(e) => handlePaste('email', e)}
                  className={`otp-digit-input ${isEmailVerified ? 'verified' : ''} ${emailError ? 'error' : ''}`}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <div className="expiry-timer-text">
              OTP will expire in <strong>{formatTimer(emailTimer)} minutes.</strong>
            </div>

            <div className="resend-action-container">
              {emailAttempts > 0 && emailTimer <= 0 ? (
                <button type="button" onClick={() => handleResend('email')} className="resend-active-link">
                  Resend OTP ({emailAttempts})
                </button>
              ) : emailAttempts > 0 ? (
                <button 
                  type="button" 
                  onClick={() => handleResend('email')} 
                  disabled={isEmailVerified} 
                  className="resend-active-link"
                >
                  Resend OTP ({emailAttempts})
                </button>
              ) : (
                <span className="resend-disabled-text">Resend limit reached</span>
              )}
            </div>

            {emailError && <div className="otp-error-message">{emailError}</div>}

            <div className="verify-btn-container">
              <button
                type="button"
                onClick={verifyEmailOtp}
                disabled={isEmailVerified || isEmailVerifying || emailOtp.join('').length < 6 || emailTimer <= 0}
                className={`verify-pill-btn ${isEmailVerified ? 'verified' : ''}`}
              >
                {isEmailVerifying ? (
                  <span className="pill-spinner"></span>
                ) : isEmailVerified ? (
                  <>
                    <svg className="check-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Verified
                  </>
                ) : 'Verify'}
              </button>
            </div>
          </div>

          {/* Global Submit Action */}
          <button
            type="submit"
            disabled={!isMobileVerified || !isEmailVerified || isSubmitting}
            className="proceed-submit-btn"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default OtpVerificationSA;
