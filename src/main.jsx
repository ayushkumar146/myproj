import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import bpmn-io form-js base styles FIRST so our overrides always win the cascade
import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-base.css';

import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
