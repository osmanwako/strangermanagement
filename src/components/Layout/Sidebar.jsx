import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/Api';

export default function Sidebar({ userRole, activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.Logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/');
    }
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
    <div className="sidebar shadow-lg" style={{width: '250px'}}>
      <div className="p-4 border-bottom border-light border-opacity-25">
        <h4 className="text-white fw-bold mb-1">EFP Guest System</h4>
        <p className="text-white-50 small mb-0 text-capitalize">{userRole} Panel</p>
      </div>
      
      <nav className="nav flex-column mt-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-link text-start border-0 bg-transparent py-3 px-4 ${
              activeTab === item.id ? 'active' : ''
            }`}
          >
            <i className={`${item.icon} me-3`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="position-absolute bottom-0 w-100 p-4 border-top border-light border-opacity-25">
        <button
          onClick={handleLogout}
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
        >
          <i className="fas fa-sign-out-alt me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
}