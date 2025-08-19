import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ userRole, activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const adminMenuItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { id: 'visitors', icon: 'fas fa-users', label: 'Visitors' },
    { id: 'weapons', icon: 'fas fa-shield-alt', label: 'Weapons' },
    { id: 'appointments', icon: 'fas fa-calendar', label: 'Appointments' },
    { id: 'reports', icon: 'fas fa-chart-line', label: 'Reports' },
    { id: 'users', icon: 'fas fa-user-cog', label: 'User Management' },
  ];

  const secretaryMenuItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { id: 'register', icon: 'fas fa-user-plus', label: 'Register Visitor' },
    { id: 'visitors', icon: 'fas fa-users', label: 'Visitor Log' },
    { id: 'weapons', icon: 'fas fa-shield-alt', label: 'Weapon Registry' },
    { id: 'appointments', icon: 'fas fa-calendar', label: 'Appointments' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : secretaryMenuItems;

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white min-h-screen shadow-xl">
      <div className="p-6 border-b border-blue-700">
        <h2 className="text-xl font-bold">EFP Guest System</h2>
        <p className="text-blue-200 text-sm capitalize">{userRole} Panel</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-700 transition-colors ${
              activeTab === item.id ? 'bg-blue-700 border-r-4 border-white' : ''
            }`}
          >
            <i className={`${item.icon} mr-3`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-6 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-red-200 hover:text-white hover:bg-red-600 rounded transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-3"></i>
          Logout
        </button>
      </div>
    </div>
  );
}