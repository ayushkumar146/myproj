import React, { useState, useEffect, useCallback } from 'react';
import './styles/Dashboard.css';
import './styles/Forms.css';
import { login, startProcessInstance, getFormSchema, completeTask } from './services/api';
import { preparePayload } from './services/RequestBodies';

// Components
import StatCard from './components/Dashboard/StatCard';
import ProductButton from './components/Dashboard/ProductButton';
import DashboardListItem from './components/Dashboard/DashboardListItem';
// import DynamicForm from './components/DynamicForm'; // Disabled for now
import CaptureDocumentForm from './components/CaptureDocumentForm';
import LoginPage from './components/LoginPage';
import ValidateSA from './components/Forms/ValidateSA';
import OtpVerificationSA from './components/Forms/OtpVerificationSA';
import AadhaarValidate from './components/Forms/AadhaarValidate';
import AuthConsentKotak from './components/Forms/AuthConsentKotak';
import FaceScanKotak from './components/Forms/FaceScanKotak';
import FingerprintScanKotak from './components/Forms/FingerprintScanKotak';
import CustomerDetailsSA from './components/Forms/CustomerDetailsSA';
import PersonalDetailsSA from './components/Forms/PersonalDetailsSA';
import ProductSectionSA from './components/Forms/ProductSectionSA';
import NomineeDetailsSA from './components/Forms/NomineeDetailsSA';
import DeclarationSA from './components/Forms/DeclarationSA';
import AadhaarSeedingCheckSA from './components/Forms/AadhaarSeedingCheckSA';
import AadhaarSeeding1SA from './components/Forms/AadhaarSeeding1SA';

function App() {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'form'
  const [formSchema, setFormSchema] = useState(null);
  const [processVariables, setProcessVariables] = useState({});
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  // Helper to determine if we should show the custom Capture Document form
  const isCaptureDocumentForm = (schema) => {
    if (!schema || !schema.form || !schema.form.components) return false;

    // Check top-level components and their immediate children for path: "captureDocument"
    return schema.form.components.some(comp =>
      comp.path === 'captureDocument' ||
      (comp.components && comp.components.some(inner => inner.path === 'captureDocument'))
    );
  };

  // Track current task state
  const [currentTask, setCurrentTask] = useState({
    userTaskKey: null,
    name: ''
  });

  const [formHistory, setFormHistory] = useState({});

  const handleLoginSuccess = (response) => {
    setToken(response.access_token);
    setIsAuthenticated(true);
  };

  // Helper to fetch schema and update view
  const loadTaskForm = useCallback(async (authToken, taskKey, taskName) => {
    if (!taskKey) {
      console.error('[loadTaskForm] No taskKey provided');
      return;
    }

    setLoading(true);
    setFormSchema(null); // Clear old schema to force remount/cleanup
    setCurrentTask({ userTaskKey: null, name: '' }); // Clear old task key to ensure components unmount
    
    try {
      console.log(`[loadTaskForm] Fetching schema for task: ${taskName} (${taskKey})`);
      const schema = await getFormSchema(authToken, taskKey);
      console.log(`[loadTaskForm] Schema response for ${taskName}:`, schema);

      if (!schema || !schema.form) {
        console.warn(`[loadTaskForm] Received invalid or empty schema for ${taskName}`);
      }

      // Extract the form identifier (id, keyName, or formKey) from the schema itself
      const actualFormKey = schema.form?.id || schema.form?.keyName || schema.formKey || taskKey;

      console.log(`[loadTaskForm] Updating state for task: ${taskName} with actualFormKey: ${actualFormKey}`, schema);
      setFormSchema({ ...schema, taskName, formKey: actualFormKey });
      setProcessVariables(prev => ({
        ...prev,
        ...(schema.processVariables || schema.variables || schema.form?.processVariables || schema.form?.variables || {})
      }));
      setCurrentTask({ userTaskKey: taskKey, name: taskName });
      setView('form');
      setMessage('');
    } catch (error) {
      console.error('[loadTaskForm] Failed to load form:', error);
      setMessage(`Error loading form: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);


  const handleFISA_Click = async () => {
    setLoading(true);
    setMessage('');
    try {
      console.log('Starting process instance...');
      const processResponse = await startProcessInstance(token);
      console.log('Process Response:', processResponse);

      const userTask = processResponse.items?.userTasks?.[0];
      if (userTask) {
        await loadTaskForm(token, userTask.userTaskKey, userTask.name);
      } else {
        setMessage('Process started, but no initial user task was found.');
      }
    } catch (error) {
      console.error('Error starting process:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = useCallback(async (formData) => {
    setLoading(true);
    setMessage('');
    try {
      console.log(`[handleFormSubmit] Submitting task: ${currentTask.name} (${currentTask.userTaskKey})`);

      const updatedVariables = {
        ...processVariables,
        ...formData
      };

      // Complete current task
      const completeResponse = await completeTask(token, currentTask.userTaskKey, updatedVariables);
      console.log('[handleFormSubmit] Complete Task Response:', completeResponse);

      // Check for next task in various possible response locations
      const nextTask =
        completeResponse.items?.userTasks?.[0] ||
        completeResponse.userTasks?.[0] ||
        completeResponse.data?.items?.userTasks?.[0] ||
        completeResponse.data?.userTasks?.[0];

      if (nextTask) {
        console.log(`[handleFormSubmit] Found next task: ${nextTask.name} (${nextTask.userTaskKey}). Loading form...`);

        // Update local variables before fetching next schema
        setProcessVariables(updatedVariables);
        setFormHistory(prev => ({
          ...prev,
          [currentTask.name]: updatedVariables
        }));

        // Fetch schema and update view for next task
        await loadTaskForm(token, nextTask.userTaskKey, nextTask.name);
      } else {
        console.log('[handleFormSubmit] No next task found in response. Returning to dashboard.');

        // Even if no next task, we should keep the current data
        setProcessVariables(updatedVariables);

        setMessage('Task completed successfully. No further tasks.');
        setTimeout(() => {
          setView('dashboard');
          setFormSchema(null);
        }, 2000);
      }
    } catch (error) {
      console.error('[handleFormSubmit] Error during task completion:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [token, currentTask, loadTaskForm, processVariables]);

  const renderDashboard = () => (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="header">SA Opening Dashboard</h1>
      </header>

      <main className="dashboard-content">
        <section className="stats-grid">
          <StatCard label="Submitted Leads" value="600" />
          <StatCard label="Rejection Leads" value="124" />
          <StatCard label="WIP Pending Leads" value="267" fullWidth />
        </section>

        <section className="section">
          <h2 className="section-title">All Products</h2>
          <div className="products-grid">
            <ProductButton label="FI_SA" onClick={handleFISA_Click} />
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Dashboard</h2>
          <div className="list-container">
            <DashboardListItem label="Submitted Leads" />
            <DashboardListItem label="WIP Pending Leads" />
            <DashboardListItem label="Rejection Leads" />
          </div>
        </section>
      </main>

      {message && (
        <footer className="dashboard-footer">
          <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
            {message}
          </div>
        </footer>
      )}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="container">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {view === 'dashboard' ? (
        renderDashboard()
      ) : (
        <div className="form-view">
          {/* Conditional Rendering: Custom Capture Form vs Default Dynamic Form */}
          {isCaptureDocumentForm(formSchema) || formSchema?.formKey === 'capture_document_sa' ? (
            <CaptureDocumentForm
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
              onBack={() => setView('dashboard')}
            />
          ) : formSchema?.formKey === 'validate_sa' ? (
            <ValidateSA
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
            />
          ) : formSchema?.formKey === 'otp_verification_sa' ? (
            <OtpVerificationSA
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
            />
          ) : (formSchema?.formKey === 'aadhar_validate' || formSchema?.formKey === 'auth_consent_kotak') ? (
            <>
              <AadhaarValidate
                key={formSchema?.formKey === 'aadhar_validate' ? currentTask.userTaskKey : 'aadhar-backdrop'}
                processVariables={processVariables}
                onFormSubmit={handleFormSubmit}
                readOnly={formSchema?.formKey === 'auth_consent_kotak'}
              />
              {formSchema?.formKey === 'auth_consent_kotak' && (
                <AuthConsentKotak
                  key="auth-consent-modal"
                  processVariables={processVariables}
                  onFormSubmit={handleFormSubmit}
                  onClose={() => setView('dashboard')}
                />
              )}
            </>
          ) : formSchema?.formKey === 'face_scan_kotak' ? (
            <FaceScanKotak
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
            />
          ) : formSchema?.formKey === 'finger_print_kotak' ? (
            <FingerprintScanKotak
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
            />
          ) : formSchema?.formKey === 'customer_details_sa' ? (
            <CustomerDetailsSA
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
            />
          ) : formSchema?.formKey === 'personal_details_sa' ? (
            <PersonalDetailsSA
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
            />
          ) : formSchema?.formKey === 'product_section_sa' ? (
            <ProductSectionSA
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
            />
          ) : formSchema?.formKey === 'nominee_details_sa' ? (
            <NomineeDetailsSA
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
            />
          ) : formSchema?.formKey === 'declaration_sa' ? (
            <DeclarationSA
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
            />
          ) : formSchema?.formKey === 'aadhaar_seeding_check_sa' ? (
            <AadhaarSeedingCheckSA
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
            />
          ) : formSchema?.formKey === 'aadhaar_seeding_1_sa' ? (
            <AadhaarSeeding1SA
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
            />
          ) : (
            <div className="unsupported-form-view">
              <h2>Form Implementation Pending</h2>
              <p>The form for <strong>{currentTask.name}</strong> ({currentTask.userTaskKey}) has not been custom-implemented yet.</p>
              <button className="form-back-btn" onClick={() => setView('dashboard')}>Back to Dashboard</button>
            </div>
          )}
          {message && <div className="form-message">{message}</div>}
        </div>
      )}

    </div>
  );
}


export default App;
