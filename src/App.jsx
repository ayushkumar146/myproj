import React, { useState, useEffect, useCallback } from 'react';
import './styles/Dashboard.css';
import './styles/DynamicForm.css';
import { login, startProcessInstance, getFormSchema, completeTask } from './services/api';
import { preparePayload } from './services/RequestBodies';

// Components
import StatCard from './components/Dashboard/StatCard';
import ProductButton from './components/Dashboard/ProductButton';
import DashboardListItem from './components/Dashboard/DashboardListItem';
import DynamicForm from './components/DynamicForm';
import CaptureDocumentForm from './components/CaptureDocumentForm';
import LoginPage from './components/LoginPage';

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
  const loadTaskForm = async (authToken, taskKey, taskName) => {
    setLoading(true);
    try {
      console.log(`Loading form for task: ${taskName} (${taskKey})`);
      const schema = await getFormSchema(authToken, taskKey);

      // ── Sanitize schema BEFORE storing in state ──────────────────────────
      // Recursively walk every component and clear any label/description/text
      // that is literally "Checkbox" or "Radio" (bpmn-io default placeholders).
      // This runs on the raw API data so bpmn-io never sees those strings.
      const JUNK_LABEL = /^(checkbox|radio)\s*\*?\s*$/i;

      const sanitizeComponents = (components) => {
        if (!Array.isArray(components)) return components;
        return components.map((comp) => {
          const cleaned = { ...comp };
          if (JUNK_LABEL.test((cleaned.label ?? '').trim()))       cleaned.label       = '';
          if (JUNK_LABEL.test((cleaned.description ?? '').trim())) cleaned.description = '';
          if (JUNK_LABEL.test((cleaned.text ?? '').trim()))        cleaned.text        = '';
          // Recurse into nested layouts / groups / columns
          if (cleaned.components) cleaned.components = sanitizeComponents(cleaned.components);
          if (cleaned.columns)    cleaned.columns    = sanitizeComponents(cleaned.columns);
          if (cleaned.rows)       cleaned.rows       = sanitizeComponents(cleaned.rows);
          return cleaned;
        });
      };

      const sanitizedForm = schema.form
        ? {
            ...schema.form,
            components: sanitizeComponents(schema.form.components),
          }
        : schema.form;

      const sanitizedSchema = { ...schema, form: sanitizedForm };
      // ─────────────────────────────────────────────────────────────────────

      setFormSchema({ ...sanitizedSchema, taskName });
      setProcessVariables(schema.processVariables || {});
      setCurrentTask({ userTaskKey: taskKey, name: taskName });
      setView('form');
      setMessage('');
    } catch (error) {
      console.error('Failed to load form:', error);
      setMessage(`Error loading form: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


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
      console.log(`Submitting form for task: ${currentTask.name}`);

      // The formData already contains the correct hierarchy (paths/groups) 
      // as defined in the Camunda schema. We merge it directly.
      const updatedVariables = {
        ...processVariables,
        ...formData
      };
      setProcessVariables(updatedVariables);
      setFormHistory(prev => ({
        ...prev,
        [currentTask.name]: updatedVariables
      }));

      // Complete current task with the cumulative, structured data
      const completeResponse = await completeTask(token, currentTask.userTaskKey, updatedVariables);
      console.log('Complete Task Response:', completeResponse);

      // Check for next task in the response
      const nextTask = completeResponse.items?.userTasks?.[0];
      if (nextTask) {
        console.log('Moving to next task:', nextTask.name);
        await loadTaskForm(token, nextTask.userTaskKey, nextTask.name);
      } else {
        console.log('No more tasks, process completed or in background.');
        setMessage('Task completed successfully. Returning to dashboard...');
        setTimeout(() => {
          setView('dashboard');
          setFormSchema(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error completing task:', error);
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
          {isCaptureDocumentForm(formSchema) ? (
            <CaptureDocumentForm
              key={currentTask.userTaskKey}
              processVariables={processVariables}
              onFormSubmit={handleFormSubmit}
              onBack={() => setView('dashboard')}
            />
          ) : (
            <>
              <div className="form-page-header">
                <button className="form-back-btn" onClick={() => setView('dashboard')}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5" stroke="#003366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 19L5 12L12 5" stroke="#003366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="form-content-area">
                <DynamicForm
                  key={currentTask.userTaskKey}
                  schema={formSchema}
                  processVariables={processVariables}
                  onFormSubmit={handleFormSubmit}
                />
              </div>
            </>
          )}
          {message && <div className="form-message">{message}</div>}
        </div>
      )}

    </div>
  );
}


export default App;
