import React, { useState, useRef } from 'react';
import '../styles/CaptureDocumentForm.css';

const CaptureDocumentForm = ({ processVariables, onFormSubmit, onBack }) => {
    const crn = processVariables.crn || "Not Available";
    const accountNumber = processVariables.accountNumber || "Not Available";

    const [captures, setCaptures] = useState({
        mitc: null,
        signatureCard: null,
        others1: null,
        others2: null,
        others3: null
    });

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const openCamera = async (slotId) => {
        setActiveSlot(slotId);
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please ensure you have given permission.");
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
        setActiveSlot(null);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg');
            setCaptures(prev => ({
                ...prev,
                [activeSlot]: imageData
            }));
            stopCamera();
        }
    };

    const handleProceed = () => {
        // Validation: Ensure required fields are captured
        if (!captures.mitc || !captures.signatureCard) {
            alert("Please capture the required documents (MITC Signature and Signature Card)");
            return;
        }

        console.log("[CaptureDocumentForm] Proceeding with capture submission...", captures);

        // We wrap the data in the "captureDocument" key so Camunda's path mapping works correctly
        onFormSubmit({
            captureDocument: {
                mitc: captures.mitc,
                signatureCard: captures.signatureCard,
                others1: captures.others1,
                others2: captures.others2,
                others3: captures.others3
            }
        });
    };


    const ApertureIcon = () => (
        <svg className="aperture-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
            <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
            <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
            <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
            <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
            <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
        </svg>
    );

    const CaptureSlot = ({ id, label, placeholder, required, optional }) => {
        const isCaptured = !!captures[id];

        return (
            <div className="capture-section">
                <div className="section-label">
                    {label}
                    {required && <span className="required">*</span>}
                    {optional && <span className="optional">(Optional)</span>}
                </div>
                <div
                    className={`capture-slot ${isCaptured ? 'captured' : ''}`}
                    onClick={() => openCamera(id)}
                >
                    {isCaptured ? (
                        <div className="preview-container">
                            <img src={captures[id]} alt={label} className="capture-preview" />
                            <div className="retake-overlay">Retake</div>
                        </div>
                    ) : (
                        <>
                            <ApertureIcon />
                            <span className="slot-placeholder">{placeholder}</span>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="pd-container" style={{ minHeight: '100vh', fontFamily: "'Frutiger LT Std', 'Outfit', 'Inter', sans-serif" }}>
            <div className="pd-card" style={{ padding: 0, overflow: 'hidden' }}>
                <header className="capture-header">
                    <h1 className="capture-title">Capture Document</h1>
                </header>

                <main className="capture-content">
                    <p className="product-instruction">Product Provide The Bellow Documents</p>

                    <div className="info-table">
                        <div className="info-row">
                            <div className="info-label">CRN :</div>
                            <div className="info-value">{crn}</div>
                        </div>
                        <div className="info-row">
                            <div className="info-label">Account Number :</div>
                            <div className="info-value">{accountNumber}</div>
                        </div>
                    </div>

                    <CaptureSlot id="mitc" label="MITC Signature" placeholder="Capture MITC Signature" required />
                    <CaptureSlot id="signatureCard" label="Signature Card" placeholder="Capture Signature Card" required />
                    <CaptureSlot id="others1" label="Others 1" placeholder="Capture Other 1 Documents" optional />
                    <CaptureSlot id="others2" label="Others 2" placeholder="Capture Other 2 Documents" optional />
                    <CaptureSlot id="others3" label="Others 3" placeholder="Capture Other 3 Documents" optional />
                </main>

                <footer className="footer-actions">
                    <button className="proceed-btn" onClick={handleProceed}>Proceed</button>
                </footer>
            </div>

            {isCameraOpen && (
                <div className="camera-overlay">
                    <div className="camera-modal">
                        <div className="camera-header">
                            <h3>Capture Document</h3>
                            <button className="close-camera" onClick={stopCamera}>×</button>
                        </div>
                        <div className="camera-view">
                            <video ref={videoRef} autoPlay playsInline muted className="video-feed" />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                        <div className="camera-controls">
                            <button className="capture-btn" onClick={capturePhoto}>Capture</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaptureDocumentForm;
