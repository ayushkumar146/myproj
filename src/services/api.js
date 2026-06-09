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

  if (formKey === 'aadhar_validate') {
    console.log('Returning mock Aadhaar validate schema directly for key:', formKey);
    return {
      form: {
        id: "aadhar_validate",
        type: "default",
        components: []
      },
      processVariables: {}
    };
  }

  if (formKey === 'auth_consent_kotak') {
    console.log('Returning mock Auth consent schema directly for key:', formKey);
    return {
      form: {
        id: "auth_consent_kotak",
        type: "default",
        components: []
      },
      processVariables: {}
    };
  }

  if (formKey === 'face_scan_kotak') {
    console.log('Returning mock Face Scan schema directly for key:', formKey);
    return {
      form: {
        components: [
          {
            "label": "Group",
            "components": [],
            "showOutline": true,
            "type": "group",
            "layout": {
              "row": "Row_1dktbvb",
              "columns": null
            },
            "id": "Field_15m6ms7"
          },
          {
            "label": "Proceed",
            "action": "submit",
            "type": "button",
            "layout": {
              "row": "Row_1dvj3gy",
              "columns": null
            },
            "id": "Field_1g61tbl"
          }
        ],
        type: "default",
        id: "face_scan_kotak",
        executionPlatform: "Camunda Cloud",
        executionPlatformVersion: "8.8.0",
        exporter: {
          "name": "Camunda Modeler",
          "version": "5.44.0"
        },
        schemaVersion: 19
      },
      processVariables: {}
    };
  }

  if (formKey === 'finger_print_kotak') {
    console.log('Returning mock Fingerprint Scan schema directly for key:', formKey);
    return {
      form: {
        components: [
          {
            "label": "Group",
            "components": [],
            "showOutline": true,
            "type": "group",
            "layout": {
              "row": "Row_1m0uwog",
              "columns": null
            },
            "id": "Field_0j44boz"
          },
          {
            "label": "Proceed",
            "action": "submit",
            "type": "button",
            "layout": {
              "row": "Row_19u4lzu",
              "columns": null
            },
            "id": "Field_1fqmdrz"
          }
        ],
        type: "default",
        id: "finger_print_kotak",
        executionPlatform: "Camunda Cloud",
        executionPlatformVersion: "8.8.0",
        exporter: {
          "name": "Camunda Modeler",
          "version": "5.44.0"
        },
        schemaVersion: 19
      },
      processVariables: {}
    };
  }

  if (formKey === 'declaration_sa') {
    console.log('Returning mock Declaration schema directly for key:', formKey);
    return {
      form: { id: 'declaration_sa', type: 'default', components: [] },
      processVariables: {
        declaration: {
          checkbox_3q039w: false,
          checkbox_rlsaoa: false,
          checkbox_ykmhve: false,
          checkbox_7fgjrm: false,
          checkbox_fne9f: false,
          checkbox_j4c184: false,
          checkbox_y11xwl: false,
          checkbox_ysqcqs: false,
          checkbox_qtcw2a: false,
          checkbox_3nhy8h: false,
          checkbox_qykwt: false,
          customerSign: '',
          name: '',
          date: '',
          isAepsEnabled: '',
          checkbox_ocuok9: false,
          checkbox_ccsm8o: false,
          checkbox_9luyp9: false,
          checkbox_z821t2: false,
          checkbox_pnvizw: false,
          checkbox_jyva4: false,
          checkbox_8k3lwn: false,
          fieldCount: '10'
        }
      }
    };
  }

  if (formKey === 'nominee_details_sa') {
    console.log('Returning mock Nominee Details schema directly for key:', formKey);
    return {
      form: { id: 'nominee_details_sa', type: 'default', components: [] },
      processVariables: {
        nomineeDetails: {
          nomineeList: [
            {
              title: '', name: '', dob: '', phNumber: '', emailId: '', select_k3yy5h: '', radio_nwsza: '', nomineePercentage: '100'
            }
          ],
          fieldCount: '8'
        }
      }
    };
  }

  if (formKey === 'product_section_sa') {
    console.log('Returning mock Product Section schema directly for key:', formKey);
    return {
      form: { id: 'product_section_sa', type: 'default', components: [] },
      processVariables: {
        productSection: {
          branch: '',
          product: '',
          debitCards: '',
          promo: '',
          cbcCode: '',
          fieldCount: '5'
        }
      }
    };
  }

  if (formKey === 'personal_details_sa') {
    console.log('Returning mock Personal Details schema directly for key:', formKey);
    return {
      form: { id: 'personal_details_sa', type: 'default', components: [] },
      processVariables: {
        personalDetails: {
          name: '',
          motherMaidanName: '',
          motherMaidanNameCnf: '',
          fatherName: '',
          maritalStatus: '',
          annualIncome: '',
          occupation: '',
          incomeSource: '',
          riskCategory: 'LOW',
          fieldCount: '9'
        }
      }
    };
  }

  if (formKey === 'customer_details_sa') {
    console.log('Returning mock Customer Details schema directly for key:', formKey);
    return {
      form: {
        id: "customer_details_sa",
        type: "default",
        components: [
          {
            "label": "Group",
            "components": [],
            "showOutline": true,
            "type": "group",
            "layout": {
              "row": "Row_1yc6qhl",
              "columns": null
            },
            "id": "Field_1sh0gzm",
            "path": "customerDetails"
          }
        ],
        executionPlatform: "Camunda Cloud",
        executionPlatformVersion: "8.8.0",
        exporter: {
          "name": "Camunda Modeler",
          "version": "5.43.1"
        },
        schemaVersion: 19
      },
      processVariables: {
        customerDetails: {
          name: "Pabitra Patra",
          age: "28",
          gender: "MALE",
          dob: "15-08-1998",
          addressLine: "At- Po- Khandagiri",
          city: "Bhubaneswar",
          pincode: "751030",
          state: "Odisha",
          isCommunicationAddressSame: true,
          fieldCount: "8",
          commZipcode: "",
          commCity: "",
          commState: "",
          commAddrLine1: "",
          commAddrLine2: "",
          commAddrLine3: "",
          CommAddrLandmark: ""
        }
      }
    };
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
      if (formKey && (formKey.toLowerCase().includes('aadhar') || formKey.toLowerCase().includes('validate'))) {
        console.warn(`getFormSchema failed with status ${response.status}, falling back to mock Aadhaar Validate schema`);
        return { form: { id: "aadhar_validate", type: "default", components: [] }, processVariables: {} };
      }
      if (formKey && (formKey.toLowerCase().includes('auth') || formKey.toLowerCase().includes('consent') || formKey === 'auth_consent_kotak')) {
        console.warn(`getFormSchema failed with status ${response.status}, falling back to mock Auth Consent schema`);
        return { form: { id: "auth_consent_kotak", type: "default", components: [] }, processVariables: {} };
      }
      if (formKey && (formKey.toLowerCase().includes('face') || formKey.toLowerCase().includes('scan') || formKey === 'face_scan_kotak')) {
        console.warn(`getFormSchema failed with status ${response.status}, falling back to mock Face Scan schema`);
        return {
          form: {
            components: [
              { "label": "Group", "components": [], "showOutline": true, "type": "group", "id": "Field_15m6ms7" },
              { "label": "Proceed", "action": "submit", "type": "button", "id": "Field_1g61tbl" }
            ],
            type: "default",
            id: "face_scan_kotak"
          },
          processVariables: {}
        };
      }
      if (formKey && (formKey.toLowerCase().includes('finger') || formKey.toLowerCase().includes('print') || formKey === 'finger_print_kotak')) {
        console.warn(`getFormSchema failed with status ${response.status}, falling back to mock Fingerprint Scan schema`);
        return {
          form: {
            components: [
              { "label": "Group", "components": [], "showOutline": true, "type": "group", "id": "Field_0j44boz" },
              { "label": "Proceed", "action": "submit", "type": "button", "id": "Field_1fqmdrz" }
            ],
            type: "default",
            id: "finger_print_kotak"
          },
          processVariables: {}
        };
      }
      if (formKey && (formKey.toLowerCase().includes('declaration') || formKey === 'declaration_sa')) {
        console.warn(`getFormSchema encountered error/status, falling back to mock Declaration schema`);
        return {
          form: { id: 'declaration_sa', type: 'default', components: [] },
          processVariables: {
            declaration: {
              checkbox_3q039w: false,
              checkbox_rlsaoa: false,
              checkbox_ykmhve: false,
              checkbox_7fgjrm: false,
              checkbox_fne9f: false,
              checkbox_j4c184: false,
              checkbox_y11xwl: false,
              checkbox_ysqcqs: false,
              checkbox_qtcw2a: false,
              checkbox_3nhy8h: false,
              checkbox_qykwt: false,
              customerSign: '',
              name: '',
              date: '',
              isAepsEnabled: '',
              checkbox_ocuok9: false,
              checkbox_ccsm8o: false,
              checkbox_9luyp9: false,
              checkbox_z821t2: false,
              checkbox_pnvizw: false,
              checkbox_jyva4: false,
              checkbox_8k3lwn: false,
              fieldCount: '10'
            }
          }
        };
      }
      if (formKey && (formKey.toLowerCase().includes('nominee') || formKey === 'nominee_details_sa')) {
        console.warn(`getFormSchema encountered error/status, falling back to mock Nominee Details schema`);
        return {
          form: { id: 'nominee_details_sa', type: 'default', components: [] },
          processVariables: {
            nomineeDetails: {
              nomineeList: [
                {
                  title: '', name: '', dob: '', phNumber: '', emailId: '', select_k3yy5h: '', radio_nwsza: '', nomineePercentage: '100'
                }
              ],
              fieldCount: '8'
            }
          }
        };
      }
      if (formKey && (formKey.toLowerCase().includes('product') || formKey === 'product_section_sa')) {
        console.warn(`getFormSchema encountered error/status, falling back to mock Product Section schema`);
        return {
          form: { id: 'product_section_sa', type: 'default', components: [] },
          processVariables: {
            productSection: {
              branch: '',
              product: '',
              debitCards: '',
              promo: '',
              cbcCode: '',
              fieldCount: '5'
            }
          }
        };
      }
      if (formKey && (formKey.toLowerCase().includes('personal') || formKey === 'personal_details_sa')) {
        console.warn(`getFormSchema failed with status ${response.status}, falling back to mock Personal Details schema`);
        return {
          form: { id: 'personal_details_sa', type: 'default', components: [] },
          processVariables: {
            personalDetails: {
              name: '',
              motherMaidanName: '',
              motherMaidanNameCnf: '',
              fatherName: '',
              maritalStatus: '',
              annualIncome: '',
              occupation: '',
              incomeSource: '',
              riskCategory: 'LOW',
              fieldCount: '9'
            }
          }
        };
      }
      if (formKey && (formKey.toLowerCase().includes('customer') || formKey.toLowerCase().includes('details') || formKey === 'customer_details_sa')) {
        console.warn(`getFormSchema failed with status ${response.status}, falling back to mock Customer Details schema`);
        return {
          form: {
            id: "customer_details_sa",
            type: "default",
            components: [
              { "label": "Group", "components": [], "showOutline": true, "type": "group", "id": "Field_1sh0gzm", "path": "customerDetails" }
            ]
          },
          processVariables: {
            customerDetails: {
              name: "Pabitra Patra",
              age: "28",
              gender: "MALE",
              dob: "15-08-1998",
              addressLine: "At- Po- Khandagiri",
              city: "Bhubaneswar",
              pincode: "751030",
              state: "Odisha"
            }
          }
        };
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
    if (formKey && (formKey.toLowerCase().includes('aadhar') || formKey.toLowerCase().includes('validate') || formKey === 'aadhar_validate')) {
      console.warn(`getFormSchema encountered error: ${error.message}, falling back to mock Aadhaar Validate schema`);
      return { form: { id: "aadhar_validate", type: "default", components: [] }, processVariables: {} };
    }
    if (formKey && (formKey.toLowerCase().includes('auth') || formKey.toLowerCase().includes('consent') || formKey === 'auth_consent_kotak')) {
      console.warn(`getFormSchema encountered error: ${error.message}, falling back to mock Auth Consent schema`);
      return { form: { id: "auth_consent_kotak", type: "default", components: [] }, processVariables: {} };
    }
    if (formKey && (formKey.toLowerCase().includes('face') || formKey.toLowerCase().includes('scan') || formKey === 'face_scan_kotak')) {
      console.warn(`getFormSchema encountered error: ${error.message}, falling back to mock Face Scan schema`);
      return {
        form: {
          components: [
            { "label": "Group", "components": [], "showOutline": true, "type": "group", "id": "Field_15m6ms7" },
            { "label": "Proceed", "action": "submit", "type": "button", "id": "Field_1g61tbl" }
          ],
          type: "default",
          id: "face_scan_kotak"
        },
        processVariables: {}
      };
    }
    if (formKey && (formKey.toLowerCase().includes('finger') || formKey.toLowerCase().includes('print') || formKey === 'finger_print_kotak')) {
      console.warn(`getFormSchema encountered error: ${error.message}, falling back to mock Fingerprint Scan schema`);
      return {
        form: {
          components: [
            { "label": "Group", "components": [], "showOutline": true, "type": "group", "id": "Field_0j44boz" },
            { "label": "Proceed", "action": "submit", "type": "button", "id": "Field_1fqmdrz" }
          ],
          type: "default",
          id: "finger_print_kotak"
        },
        processVariables: {}
      };
    }
    if (formKey && (formKey.toLowerCase().includes('declaration') || formKey === 'declaration_sa')) {
      console.warn(`getFormSchema encountered error/status, falling back to mock Declaration schema`);
      return {
        form: { id: 'declaration_sa', type: 'default', components: [] },
        processVariables: {
          declaration: {
            checkbox_3q039w: false,
            checkbox_rlsaoa: false,
            checkbox_ykmhve: false,
            checkbox_7fgjrm: false,
            checkbox_fne9f: false,
            checkbox_j4c184: false,
            checkbox_y11xwl: false,
            checkbox_ysqcqs: false,
            checkbox_qtcw2a: false,
            checkbox_3nhy8h: false,
            checkbox_qykwt: false,
            customerSign: '',
            name: '',
            date: '',
            isAepsEnabled: '',
            checkbox_ocuok9: false,
            checkbox_ccsm8o: false,
            checkbox_9luyp9: false,
            checkbox_z821t2: false,
            checkbox_pnvizw: false,
            checkbox_jyva4: false,
            checkbox_8k3lwn: false,
            fieldCount: '10'
          }
        }
      };
    }
    if (formKey && (formKey.toLowerCase().includes('nominee') || formKey === 'nominee_details_sa')) {
      console.warn(`getFormSchema encountered error/status, falling back to mock Nominee Details schema`);
      return {
        form: { id: 'nominee_details_sa', type: 'default', components: [] },
        processVariables: {
          nomineeDetails: {
            nomineeList: [
              {
                title: '', name: '', dob: '', phNumber: '', emailId: '', select_k3yy5h: '', radio_nwsza: '', nomineePercentage: '100'
              }
            ],
            fieldCount: '8'
          }
        }
      };
    }
    if (formKey && (formKey.toLowerCase().includes('product') || formKey === 'product_section_sa')) {
      console.warn(`getFormSchema encountered error/status, falling back to mock Product Section schema`);
      return {
        form: { id: 'product_section_sa', type: 'default', components: [] },
        processVariables: {
          productSection: {
            branch: '',
            product: '',
            debitCards: '',
            promo: '',
            cbcCode: '',
            fieldCount: '5'
          }
        }
      };
    }
    if (formKey && (formKey.toLowerCase().includes('personal') || formKey === 'personal_details_sa')) {
      console.warn(`getFormSchema encountered error: ${error.message}, falling back to mock Personal Details schema`);
      return {
        form: { id: 'personal_details_sa', type: 'default', components: [] },
        processVariables: {
          personalDetails: {
            name: '',
            motherMaidanName: '',
            motherMaidanNameCnf: '',
            fatherName: '',
            maritalStatus: '',
            annualIncome: '',
            occupation: '',
            incomeSource: '',
            riskCategory: 'LOW',
            fieldCount: '9'
          }
        }
      };
    }
    if (formKey && (formKey.toLowerCase().includes('customer') || formKey.toLowerCase().includes('details') || formKey === 'customer_details_sa')) {
      console.warn(`getFormSchema encountered error: ${error.message}, falling back to mock Customer Details schema`);
      return {
        form: {
          id: "customer_details_sa",
          type: "default",
          components: [
            { "label": "Group", "components": [], "showOutline": true, "type": "group", "id": "Field_1sh0gzm", "path": "customerDetails" }
          ]
        },
        processVariables: {
          customerDetails: {
            name: "Pabitra Patra",
            age: "28",
            gender: "MALE",
            dob: "15-08-1998",
            addressLine: "At- Po- Khandagiri",
            city: "Bhubaneswar",
            pincode: "751030",
            state: "Odisha",
            isCommunicationAddressSame: true,
            fieldCount: "8",
            commZipcode: "",
            commCity: "",
            commState: "",
            commAddrLine1: "",
            commAddrLine2: "",
            commAddrLine3: "",
            CommAddrLandmark: ""
          }
        }
      };
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
