

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import SecretaryDashboard from './components/Dashboard/SecretaryDashboard';
import { authAPI } from './api/Api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.GetUser();
        setUser(response.data);
      } catch (error) {
        // User not authenticated, stay on login
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            user ? 
              (user.role === 'admin' ? <AdminDashboard /> : <SecretaryDashboard />) :
              <Login setUser={setUser} />
          } 
        />
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Login setUser={setUser} />} 
        />
        <Route 
          path="/secretary" 
          element={user?.role === 'secretary' ? <SecretaryDashboard /> : <Login setUser={setUser} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
