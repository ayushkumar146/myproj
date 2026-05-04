import React, { useState } from 'react';
import './styles/Dashboard.css';
import { login, startProcessInstance } from './services/api';

// Components
import StatCard from './components/Dashboard/StatCard';
import ProductButton from './components/Dashboard/ProductButton';
import DashboardListItem from './components/Dashboard/DashboardListItem';

function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFISA_Click = async () => {
    setLoading(true);
    setMessage('');
    try {
      console.log('Logging in...');
      const loginResponse = await login();
      const accessToken = loginResponse.access_token;
      
      console.log('Starting process instance...');
      const processResponse = await startProcessInstance(accessToken);
      
      console.log('Success:', processResponse);
      setMessage(`Success: Process ID ${processResponse.items?.processId}`);
      alert(`Success! Process ID: ${processResponse.items?.processId}`);
    } catch (error) {
      console.error('Error:', error);
      setMessage(`Error: ${error.message}`);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      
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
    </div>
  );
}

export default App;
