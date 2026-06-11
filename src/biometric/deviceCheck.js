export const checkBiometricDevice = async (selectedDevice = "MANTRA", protocol = "http") => {
  return new Promise((resolve, reject) => {
    let check_device_status = 'NOTREADY';
    let portuse = null;

    const recursiveCheckDevice = (index) => {
      setTimeout(async () => {
        // Format index to have leading zero if less than 10 (e.g. 00, 01, ..., 09)
        const indexNum = index < 10 ? `0${Math.abs(index)}` : index;
        const port = `111${indexNum}`;
        const url = `${protocol}://127.0.0.1:${port}/`;
        
        let pidOptions = "";
        
        if (selectedDevice === 'IDEMIA_L1_RDSERVICE' || selectedDevice === 'Morpho_RD_Service') {
          pidOptions = "<PidOptions ver='1.0'><Opts env='S' fCount='1' fType='2' format='0' pType='0' pCount='0' pgCount='0' pTimeout='10000' pidVer='2.0' otp='' wadh=''></Opts><Demo></Demo><CustOpts></CustOpts><Bios></Bios></PidOptions>";
        } else {
          // Default payload for Mantra and others
          pidOptions = '<PidOptions ver="1.0"><Opts fCount="1" fType="2" iCount="0" iType="0" pCount="0" format="0" pidVer="2.0" timeout="20000" env="P" posh="UNKNOWN"/><Demo></Demo><CustOpts><Param name="ValidationKey" value="" /></CustOpts></PidOptions>';
        }

        try {
          // Using fetch instead of $.ajax
          const response = await fetch(url, {
            method: 'RDSERVICE',
            headers: {
              'Content-Type': 'text/xml; charset=utf-8'
            },
            body: pidOptions 
          });

          const data = await response.text();
          let convStr = data;

          if (convStr.includes('status="READY"') && convStr.includes(selectedDevice)) {
            check_device_status = 'READY';
            portuse = port;
            resolve({ status: 'READY', port: portuse, message: 'Device connected successfully.' });
          } else if (convStr.includes('status="READY"') && !convStr.includes(selectedDevice)) {
            check_device_status = selectedDevice;
            portuse = port;
            resolve({ status: 'WRONG_DEVICE', port: portuse, message: 'Kindly Choose Connected Device' });
          } else if (convStr.includes('status="NOTREADY"')) {
            // Device found but not ready
            if (index < 21) {
              recursiveCheckDevice(index + 1);
            } else {
              reject({ status: 'NOTREADY', message: 'Device not connected...' });
            }
          } else {
            // Unrecognized response
            if (index < 21) {
              recursiveCheckDevice(index + 1);
            } else {
              reject({ status: 'NOTREADY', message: 'Device not connected...' });
            }
          }
        } catch (error) {
          check_device_status = 'ERROR';
          // On network error (e.g., port not open), try the next port
          if (index < 21) {
            recursiveCheckDevice(index + 1);
          } else {
            reject({ status: 'ERROR', message: 'Device not connected...' });
          }
        }
      }, 300); // 300ms delay between port checks
    };

    // Start recursion at index 0 (Port 11100)
    recursiveCheckDevice(0);
  });
};

export const captureBiometricData = async (port, protocol = "http") => {
  return new Promise(async (resolve, reject) => {
    // Note: the original snippet used '111' + port, but our port variable already includes 111 (e.g., '11100').
    // Ensure we just use the port directly.
    const url = `${protocol}://127.0.0.1:${port}/rd/capture`;
    
    // User provided payload for Irish originally, updating it for Fingerprint capture (adding fCount="1" iCount="0" iType="0")
    const dataPayload = '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" iType="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="20000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';

    try {
      const response = await fetch(url, {
        method: 'CAPTURE',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8'
        },
        body: dataPayload
      });

      const data = await response.text();
      resolve({ httpStatus: true, data: data });
    } catch (error) {
      reject({
        httpStatus: false,
        message: `${error.message || 'Error occurred.'} If you are using tatvik device then select the Device from the last page`
      });
    }
  });
};
