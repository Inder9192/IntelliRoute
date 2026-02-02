import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [metrics, setMetrics] = useState({});

  // Initialize Socket.io connection
  useEffect(() => {
    if (!isAuthenticated) return;

    const newSocket = io('http://localhost:4000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to metrics server');
    });

    newSocket.on('metricsUpdate', (data) => {
      setMetrics(prev => ({
        ...prev,
        [data.tenantId]: data
      }));
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from metrics server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setMetrics({});
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <AuthPage onLogin={handleLogin} />
      ) : (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          socket={socket}
          metrics={metrics}
        />
      )}
    </div>
  );
}

export default App;
