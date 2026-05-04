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

export const getFormSchema = async (accessToken, formKey) => {
  const url = `https://bank-enc-dec-kotakfiplatform.bharatkioskbanking.com/kotak/los/camunda/getFormSchema/${formKey}`;
  
  const headers = {
    'Authorization': accessToken,
    'Content-Type': 'application/json'
  };

  console.log(`Calling getFormSchema for key: ${formKey}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({})
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`getFormSchema failed with status ${response.status}:`, errorText);
    throw new Error(`Server returned ${response.status} for form schema request.`);
  }

  return await response.json();
};
