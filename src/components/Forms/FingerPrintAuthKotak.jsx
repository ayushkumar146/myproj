import React, { useState, useEffect } from 'react';
import { checkBiometricDevice, captureBiometricData } from '../../biometric/deviceCheck';

const FingerPrintAuthKotak = ({ onFormSubmit, processVariables }) => {
  const [deviceStatus, setDeviceStatus] = useState('checking'); // 'checking', 'ready', 'error'
  const [captureStatus, setCaptureStatus] = useState(''); // 'capturing', 'success', 'failed'
  const [errorMessage, setErrorMessage] = useState('');
  const [port, setPort] = useState(null);

  useEffect(() => {
    const initDevice = async () => {
      try {
        const response = await checkBiometricDevice("MANTRA", "http");
        setPort(response.port);
        setDeviceStatus('ready');
      } catch (err) {
        setDeviceStatus('error');
        setErrorMessage(err.message || 'Device not found.');
      }
    };
    initDevice();

    // 1-minute auto-submit timeout
    const timeoutId = setTimeout(() => {
      setCaptureStatus((prev) => {
        if (prev === 'success') return prev; // already succeeded
        
        console.log('1 minute timeout reached. Auto-submitting Fingerprint Auth as FAILED.');
        onFormSubmit({
          fingerPrintAuthKotak: {
            status: 'FAILED',
            captureData: 'TIMEOUT'
          },
          authfinger: 'FAILED'
        });
        return prev;
      });
    }, 20000);

    return () => clearTimeout(timeoutId);
  }, [onFormSubmit]);

  const handleCapture = async () => {
    if (deviceStatus !== 'ready' || !port || captureStatus === 'capturing') return;
    setCaptureStatus('capturing');
    setErrorMessage('');
    
    try {
      const res = await captureBiometricData(port, "http");
      const xmlData = res?.data || "";
      
      // Check for failure based on string length or errCode in XML
      const isShort = xmlData.length < 100;
      const hasError = xmlData.includes('errCode="') && !xmlData.includes('errCode="0"');
      
      if (isShort || hasError) {
        setCaptureStatus('failed');
        // Extract error info if possible
        const errInfoMatch = xmlData.match(/errInfo="([^"]+)"/);
        const errorMsg = errInfoMatch ? errInfoMatch[1] : "Capture failed or invalid data. Please try again.";
        setErrorMessage(errorMsg);
        return; // Do NOT auto-submit, let them retry until 1 min timeout
      }

      setCaptureStatus('success');
      
      // Parse the XML to a clean JSON object for Camunda
      const parseXmlToJson = (xmlString) => {
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlString, "text/xml");
          
          const xmlToJson = (node) => {
            let obj = {};
            if (node.attributes && node.attributes.length > 0) {
              for (let i = 0; i < node.attributes.length; i++) {
                const attr = node.attributes[i];
                obj[attr.nodeName] = attr.nodeValue;
              }
            }
            if (node.children && node.children.length > 0) {
              for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                const childName = child.nodeName;
                const childObj = xmlToJson(child);
                if (obj[childName] === undefined) {
                  obj[childName] = childObj;
                } else {
                  if (!Array.isArray(obj[childName])) {
                    obj[childName] = [obj[childName]];
                  }
                  obj[childName].push(childObj);
                }
              }
            } else if (node.textContent && node.textContent.trim() !== '') {
               if (Object.keys(obj).length > 0) {
                   obj.text = node.textContent.trim();
               } else {
                   return node.textContent.trim();
               }
            }
            return obj;
          };
          
          const rootElement = xmlDoc.documentElement;
          return { [rootElement.nodeName]: xmlToJson(rootElement) };
        } catch (e) {
          console.error("XML parse error:", e);
          return xmlString; // Fallback to raw string
        }
      };

      const captureDataJson = parseXmlToJson(xmlData);
      
      setTimeout(() => {
        onFormSubmit({
          fingerPrintAuthKotak: {
            status: 'SUCCESS',
            captureData: captureDataJson
          },
          authfinger: 'SUCCESS'
        });
      }, 1500);
    } catch (err) {
      setCaptureStatus('failed');
      setErrorMessage(err.message || 'Capture failed. Please try again.');
    }
  };

  const styles = {
    container: {
      position: 'fixed',
      bottom: 0,
      top: 'auto',
      left: '50%',
      transform: 'translate(-50%, 0)',
      width: '430px',
      maxWidth: '100%',
      height: 'auto',
      minHeight: '350px',
      background: '#fff',
      textAlign: 'center',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      padding: '40px 24px',
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
      zIndex: 1000,
      fontFamily: '"Frutiger LT Std", "Outfit", sans-serif',
      boxSizing: 'border-box'
    },
    overlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 999
    },
    title: { fontSize: '20px', fontWeight: 600, marginBottom: '10px', color: '#333' },
    subtitle: { fontSize: '14px', color: '#666', marginBottom: '40px', lineHeight: 1.4 },
    fingerprint: { margin: '20px 0', cursor: deviceStatus === 'ready' && captureStatus !== 'capturing' ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center' },
    instruction: { fontSize: '13px', color: '#777', marginTop: '20px' },
    error: { color: 'red', fontSize: '12px', marginTop: '10px' }
  };

  return (
    <>
      <div style={styles.overlay}></div>
      <div style={styles.container}>
        <div style={styles.title}>Confirm Aadhaar Auth</div>
        <div style={styles.subtitle}>
          Confirm your Bio-metric for Aadhaar Authentication.
        </div>
        <div 
          style={styles.fingerprint} 
          onClick={handleCapture}
        >
          <svg width="48" height="54" viewBox="0 0 48 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: deviceStatus === 'ready' ? 1 : 0.5 }}>
            <path d="M39.5018 6.58667C39.2884 6.58667 39.0751 6.53333 38.8884 6.42667C33.7684 3.78667 29.3418 2.66667 24.0351 2.66667C18.7551 2.66667 13.7418 3.92 9.18176 6.42667C8.54176 6.77333 7.74176 6.53333 7.36842 5.89333C7.02176 5.25333 7.26176 4.42667 7.90176 4.08C12.8618 1.38667 18.3018 0 24.0351 0C29.7151 0 34.6751 1.25333 40.1151 4.05333C40.7818 4.4 41.0218 5.2 40.6751 5.84C40.4351 6.32 39.9818 6.58667 39.5018 6.58667ZM1.34176 20.5867C1.07509 20.5867 0.808424 20.5067 0.568424 20.3467C-0.0449097 19.92 -0.178243 19.0933 0.248423 18.48C2.88842 14.7467 6.24842 11.8133 10.2484 9.76C18.6218 5.44 29.3418 5.41333 37.7418 9.73333C41.7418 11.7867 45.1018 14.6933 47.7418 18.4C48.1684 18.9867 48.0351 19.84 47.4218 20.2667C46.8084 20.6933 45.9818 20.56 45.5551 19.9467C43.1551 16.5867 40.1151 13.9467 36.5151 12.1067C28.8618 8.18667 19.0751 8.18667 11.4484 12.1333C7.82176 14 4.78176 16.6667 2.38176 20.0267C2.16842 20.4 1.76842 20.5867 1.34176 20.5867ZM18.0084 52.7733C17.6618 52.7733 17.3151 52.64 17.0751 52.3733C14.7551 50.0533 13.5018 48.56 11.7151 45.3333C9.87509 42.0533 8.91509 38.0533 8.91509 33.76C8.91509 25.84 15.6884 19.3867 24.0084 19.3867C32.3284 19.3867 39.1018 25.84 39.1018 33.76C39.1018 34.5067 38.5151 35.0933 37.7684 35.0933C37.0218 35.0933 36.4351 34.5067 36.4351 33.76C36.4351 27.3067 30.8618 22.0533 24.0084 22.0533C17.1551 22.0533 11.5818 27.3067 11.5818 33.76C11.5818 37.6 12.4351 41.1467 14.0618 44.0267C15.7684 47.0933 16.9418 48.4 18.9951 50.48C19.5018 51.0133 19.5018 51.84 18.9951 52.3733C18.7018 52.64 18.3551 52.7733 18.0084 52.7733ZM37.1284 47.84C33.9551 47.84 31.1551 47.04 28.8618 45.4667C24.8884 42.7733 22.5151 38.4 22.5151 33.76C22.5151 33.0133 23.1018 32.4267 23.8484 32.4267C24.5951 32.4267 25.1818 33.0133 25.1818 33.76C25.1818 37.52 27.1018 41.0667 30.3551 43.2533C32.2484 44.5333 34.4618 45.1467 37.1284 45.1467C37.7684 45.1467 38.8351 45.0667 39.9018 44.88C40.6218 44.7467 41.3151 45.2267 41.4484 45.9733C41.5818 46.6933 41.1018 47.3867 40.3551 47.52C38.8351 47.8133 37.5018 47.84 37.1284 47.84ZM31.7684 53.3333C31.6618 53.3333 31.5284 53.3067 31.4218 53.28C27.1818 52.1067 24.4084 50.5333 21.5018 47.68C17.7684 43.9733 15.7151 39.04 15.7151 33.76C15.7151 29.44 19.3951 25.92 23.9284 25.92C28.4618 25.92 32.1418 29.44 32.1418 33.76C32.1418 36.6133 34.6218 38.9333 37.6884 38.9333C40.7551 38.9333 43.2351 36.6133 43.2351 33.76C43.2351 23.7067 34.5684 15.5467 23.9018 15.5467C16.3284 15.5467 9.39509 19.76 6.27509 26.2933C5.23509 28.4533 4.70176 30.9867 4.70176 33.76C4.70176 35.84 4.88842 39.12 6.48842 43.3867C6.75509 44.08 6.40842 44.8533 5.71509 45.0933C5.02176 45.36 4.24842 44.9867 4.00842 44.32C2.70176 40.8267 2.06176 37.36 2.06176 33.76C2.06176 30.56 2.67509 27.6533 3.87509 25.12C7.42176 17.68 15.2884 12.8533 23.9018 12.8533C36.0351 12.8533 45.9018 22.2133 45.9018 33.7333C45.9018 38.0533 42.2218 41.5733 37.6884 41.5733C33.1551 41.5733 29.4751 38.0533 29.4751 33.7333C29.4751 30.88 26.9951 28.56 23.9284 28.56C20.8618 28.56 18.3818 30.88 18.3818 33.7333C18.3818 38.2933 20.1418 42.56 23.3684 45.76C25.9018 48.2667 28.3284 49.6533 32.0884 50.6933C32.8084 50.88 33.2084 51.6267 33.0218 52.32C32.8884 52.9333 32.3284 53.3333 31.7684 53.3333Z" fill={deviceStatus === 'ready' ? "#2D639E" : "#999"}/>
          </svg>
        </div>
        
        <div style={styles.instruction}>
          {deviceStatus === 'checking' && "Checking device connection..."}
          {deviceStatus === 'error' && "Device not found. Please connect it."}
          {deviceStatus === 'ready' && captureStatus === '' && "Touch the fingerprint sensor"}
          {captureStatus === 'capturing' && "Capturing... Please wait."}
          {captureStatus === 'success' && <span style={{color: 'green'}}>Capture successful! Submitting...</span>}
        </div>

        {errorMessage && (
          <div style={styles.error}>{errorMessage}</div>
        )}
      </div>
    </>
  );
};

export default FingerPrintAuthKotak;
