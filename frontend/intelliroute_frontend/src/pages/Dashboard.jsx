import { useState, useEffect } from 'react';
import BackendList from '../components/BackendList';
import AddBackendForm from '../components/AddBackendForm';
import MetricsDisplay from '../components/MetricsDisplay';
import '../styles/Dashboard.css';

function Dashboard({ user, onLogout, socket, metrics }) {
  const [backends, setBackends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('backends');
  const token = localStorage.getItem('token');

  // Fetch backends on component mount
  useEffect(() => {
    fetchBackends();
  }, []);

  const fetchBackends = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/backends/list', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch backends');

      const data = await response.json();
      setBackends(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackendAdded = (newBackend) => {
    setBackends([...backends, newBackend]);
    fetchBackends();
  };

  const handleToggleBackend = async (backendId, currentStatus) => {
    // Note: Backend toggle would need an API endpoint
    // For now, this is a placeholder
    console.log('Toggle backend:', backendId);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>IntelliRoute</h1>
          <p className="user-info">Welcome, {user?.email}</p>
        </div>
        <div className="header-right">
          <span className="company-badge">Company</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'backends' ? 'active' : ''}`}
          onClick={() => setActiveTab('backends')}
        >
          Backend Services
        </button>
        <button
          className={`nav-btn ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          Real-time Metrics
        </button>
        <button
          className={`nav-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add Backend
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'backends' && (
          <section className="section">
            <h2>Configured Backend Services</h2>
            {loading ? (
              <div className="loading">Loading backends...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <BackendList 
                backends={backends} 
                onToggle={handleToggleBackend}
              />
            )}
          </section>
        )}

        {activeTab === 'metrics' && (
          <section className="section">
            <h2>Real-time Metrics</h2>
            <MetricsDisplay backends={backends} metrics={metrics} />
          </section>
        )}

        {activeTab === 'add' && (
          <section className="section">
            <h2>Add New Backend Service</h2>
            <AddBackendForm 
              onBackendAdded={handleBackendAdded}
              token={token}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
