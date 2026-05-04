import React, { useState, useEffect, useCallback } from 'react';
import './styles/Dashboard.css';
import './styles/DynamicForm.css';
import { login, startProcessInstance, getFormSchema } from './services/api';

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

  // Auto-login check (optional, keeping it simple for now)
  useEffect(() => {
    // Initial load logic if any
  }, []);

  const handleLoginSuccess = (response) => {
    setToken(response.access_token);
    setIsAuthenticated(true);
  };

  const handleFISA_Click = async () => {
    setLoading(true);
    setMessage('');
    try {
      console.log('Starting process instance...');
      const processResponse = await startProcessInstance(token);
      console.log('Process Response:', processResponse);
      
      const userTask = processResponse.items?.userTasks?.[0];
      const formKey = userTask?.formKey;
      const userTaskKey = userTask?.userTaskKey;
      const taskName = userTask?.name;
      
      console.log('Task Name:', taskName);
      console.log('User Task Key:', userTaskKey);
      console.log('Form Key:', formKey);

      // User explicitly stated to use the userTaskKey
      const targetKey = userTaskKey || formKey;

      if (targetKey) {
        console.log(`Fetching form schema using userTaskKey: ${targetKey}...`);
        const schema = await getFormSchema(token, targetKey);
        setFormSchema({ ...schema, taskName }); // Include name in schema object
        setProcessVariables(schema.processVariables || {});
        setView('form');
      } else {
        setMessage('Process started, but no valid key (formKey or userTaskKey) was found.');
      }
    } catch (error) {
      console.error('Error in flow:', error);
      setMessage(`Error: ${error.message}`);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = useCallback((formData) => {
    console.log('Form Submitted Data:', formData);
    alert('Form submitted successfully! Check console for details.');
  }, []);

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
          <div className={`message-banner ${message.startsWith('Error') ? 'error' : 'success'}`}>
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
          <button className="back-btn" onClick={() => setView('dashboard')}>← Back to Dashboard</button>
          <DynamicForm 
            schema={formSchema} 
            processVariables={processVariables} 
            onFormSubmit={handleFormSubmit}
          />
        </div>
      )}
    </div>
  );
}

export default App;
