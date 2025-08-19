

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import AdminDashboard from './component/AdminDashboard';
import SecretaryDashboard from './component/SecretaryDashboard';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Login setUser={setUser} />} />
        <Route path="/secretary" element={user?.role === 'secretary' ? <SecretaryDashboard /> : <Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
