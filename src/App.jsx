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
import LoginPage from './components/LoginPage';

function App() {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'form'
  const [formSchema, setFormSchema] = useState(null);
  const [processVariables, setProcessVariables] = useState({});
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

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

      setFormSchema({ ...schema, taskName });
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
      
      // Prepare the request body based on the task name using our configuration store
      const finalPayload = preparePayload(currentTask.name, formData);
      
      // Store in history for local reference
      setFormHistory(prev => ({
        ...prev,
        [currentTask.name]: finalPayload
      }));

      // Complete current task with the prepared payload
      const completeResponse = await completeTask(token, currentTask.userTaskKey, finalPayload);
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
  }, [token, currentTask, loadTaskForm]);

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
          <div className="form-header-bar">
            <button className="back-btn" onClick={() => setView('dashboard')}>← Back</button>
            <span className="task-status">Current Task: {currentTask.name.toUpperCase()}</span>
          </div>
          <DynamicForm
            schema={formSchema}
            processVariables={processVariables}
            onFormSubmit={handleFormSubmit}
          />
          {message && <div className="form-message">{message}</div>}
        </div>
      )}
    </div>
  );
}

export default App;
