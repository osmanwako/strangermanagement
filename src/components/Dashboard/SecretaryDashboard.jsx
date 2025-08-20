import React, { useState, useEffect } from 'react';
import Sidebar from '../Layout/Sidebar';
import DashboardStats from './DashboardStats';
import VisitorRegistration from '../Visitor/VisitorRegistration';
import VisitorManagement from '../Visitor/VisitorManagement';
import WeaponManagement from '../Weapon/WeaponManagement';
import AppointmentManagement from '../Appointment/AppointmentManagement';
import { authAPI } from '../../api/Api';

export default function SecretaryDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.GetUser();
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats userRole="secretary" />;
      case 'register':
        return <VisitorRegistration />;
      case 'visitors':
        return <VisitorManagement userRole="secretary" />;
      case 'weapons':
        return <WeaponManagement userRole="secretary" />;
      case 'appointments':
        return <AppointmentManagement userRole="secretary" />;
      default:
        return <DashboardStats userRole="secretary" />;
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar userRole="secretary" activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-grow-1 d-flex flex-column">
        <header className="bg-white shadow-sm border-bottom px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0">
              {activeTab === 'register' ? 'Register Visitor' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <div className="d-flex align-items-center">
              <div className="text-end me-3">
                <p className="mb-0 fw-medium">{user?.name}</p>
                <small className="text-muted">Secretary</small>
              </div>
              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                <span className="text-white fw-bold">
                  {user?.name?.charAt(0) || 'S'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow-1 p-4 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}