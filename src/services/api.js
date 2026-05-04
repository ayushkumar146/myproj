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
