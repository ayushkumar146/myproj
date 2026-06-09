const LOGIN_URL = 'https://services-v2.iserveu.online/dev/common/usermgmt/user/login';
const START_PROCESS_URL = 'https://bank-enc-dec-kotakfiplatform.bharatkioskbanking.com/kotak/los/camunda/startProcessInstance';

export const login = async () => {
  const headers = {
    'Authorization': 'Basic Y29tbW9uLWFkbWlucy1vYXV0aDItY2xpZW50OmNvbW1vbi1hZG1pbnMtb2F1dGgtcGFzc3dvcmQ=',
    'Geo-Location': JSON.stringify({
      device: 'WEB',
      latitude: 20.3419933,
      longitude: 85.8062196,
      city: 'Bhubaneshwar',
      country: 'India',
      continent: 'Asia'
    }),
    'User-Agent': 'Android',
    'Content-Type': 'application/json'
  };

  const body = {
    username: "jio_admin",
    password: "Jio@2026",
    grant_type: "password"
  };

  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return await response.json();
};

export const startProcessInstance = async (accessToken) => {
  const headers = {
    'Authorization': accessToken,
    'Content-Type': 'application/json'
  };

  const body = {
    applicationSource: "android",
    bpmnId: "kotak_sa_onboarding_stage_0"
  };

  const response = await fetch(START_PROCESS_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('Failed to start process instance');
  }

  return await response.json();
};

const getMockOtpVerificationSchema = () => {
  return {
    form: {
      "components": [
        {
          "label": "",
          "components": [
            {
              "content": " <style>\n    * {\n        margin: 0;\n        padding: 0;\n        box-sizing: border-box;\n    }\n\n    body {\n        height: 100vh;\n        display: flex;\n        justify-content: flex-start; /* move to left */\n        align-items: center;         /* keep vertical center */\n        background-color: #f5f5f5;\n        font-family: Arial, sans-serif;\n        padding-left: 20px; /* optional spacing from left edge */\n    }\n\n    .center-box {\n        padding: 20px 30px;\n        background: white;\n        text-align: center;\n    }\n</style>\n <div class=\"center-box\">\n        <h2>Validate</h2>\n    </div>",
              "type": "html",
              "layout": {
                "row": "Row_1ndfq93",
                "columns": null
              },
              "id": "Field_0q5l4ot"
            },
            {
              "content": "OTP sent to Your Mobile Number ",
              "type": "html",
              "layout": {
                "row": "Row_1g67yd4",
                "columns": null
              },
              "id": "Field_0x8w8ev"
            },
            {
              "label": "Mobile OTP",
              "type": "textfield",
              "layout": {
                "row": "Row_118c58g",
                "columns": null
              },
              "id": "Field_0nl8dpg",
              "key": "mobileOtp"
            },
            {
              "label": "Verify",
              "action": "submit",
              "type": "button",
              "layout": {
                "row": "Row_1oyi8ws",
                "columns": 3
              },
              "id": "Field_0k0jr48"
            },
            {
              "content": "OTP sent to to Your Email ID",
              "type": "html",
              "layout": {
                "row": "Row_0gb5fnq",
                "columns": null
              },
              "id": "Field_1tzp5u3"
            },
            {
              "label": "Email OTP",
              "type": "textfield",
              "layout": {
                "row": "Row_0anxqbp",
                "columns": null
              },
              "id": "Field_1tkvtg9",
              "key": "emailOTP"
            },
            {
              "label": "Verify",
              "action": "submit",
              "type": "button",
              "layout": {
                "row": "Row_1fk7wyr",
                "columns": 3
              },
              "id": "Field_0x87u46"
            },
            {
              "label": "Submit",
              "action": "submit",
              "type": "button",
              "layout": {
                "row": "Row_03sq4sz",
                "columns": null
              },
              "id": "Field_0axdwvs"
            }
          ],
          "showOutline": false,
          "type": "group",
          "layout": {
            "row": "Row_0280y5w",
            "columns": null
          },
          "id": "Field_1nir5kc",
          "path": "otpVerification"
        }
      ],
      "type": "default",
      "id": "otp_verification_sa",
      "executionPlatform": "Camunda Cloud",
      "executionPlatformVersion": "8.8.0",
      "exporter": {
        "name": "Camunda Modeler",
        "version": "5.39.0"
      },
      "schemaVersion": 19
    },
    processVariables: {}
  };
};

export const getFormSchema = async (accessToken, formKey) => {
  if (formKey === 'otp_verification_sa') {
    console.log('Returning mock OTP verification schema directly for key:', formKey);
    return getMockOtpVerificationSchema();
  }

  const url = `https://bank-enc-dec-kotakfiplatform.bharatkioskbanking.com/kotak/los/camunda/getFormSchema/${formKey}`;
  
  const headers = {
    'Authorization': accessToken,
    'Content-Type': 'application/json'
  };

  console.log(`Calling getFormSchema for key: ${formKey}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });

    if (!response.ok) {
      if (formKey && (formKey.toLowerCase().includes('otp') || formKey.toLowerCase().includes('verification'))) {
        console.warn(`getFormSchema failed with status ${response.status}, falling back to mock OTP Verification schema`);
        return getMockOtpVerificationSchema();
      }
      const errorText = await response.text();
      console.error(`getFormSchema failed with status ${response.status}:`, errorText);
      throw new Error(`Server returned ${response.status} for form schema request.`);
    }

    return await response.json();
  } catch (error) {
    if (formKey && (formKey.toLowerCase().includes('otp') || formKey.toLowerCase().includes('verification') || formKey === 'otp_verification_sa')) {
      console.warn(`getFormSchema encountered error: ${error.message}, falling back to mock OTP Verification schema`);
      return getMockOtpVerificationSchema();
    }
    throw error;
  }
};

export const completeTask = async (accessToken, userTaskKey, variables = {}) => {
  const url = `https://bank-enc-dec-kotakfiplatform.bharatkioskbanking.com/kotak/los/camunda/completeTask/${userTaskKey}`;
  
  const headers = {
    'Authorization': accessToken,
    'Content-Type': 'application/json'
  };

  const body = {
    processVariables: {
      ...variables,
      "go_next": true
    }
  };

  console.log(`Completing task ${userTaskKey} with variables:`, body);

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`completeTask failed with status ${response.status}:`, errorText);
    throw new Error(`Server returned ${response.status} for completeTask.`);
  }

  return await response.json();
};
