import React, { useState, useEffect } from 'react';
import Sidebar from '../Layout/Sidebar';
import DashboardStats from './DashboardStats';
import VisitorManagement from '../Visitor/VisitorManagement';
import WeaponManagement from '../Weapon/WeaponManagement';
import AppointmentManagement from '../Appointment/AppointmentManagement';
import ReportsSection from '../Reports/ReportsSection';
import UserManagement from '../User/UserManagement';
import { authAPI } from '../../api/Api';

export default function AdminDashboard() {
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
        return <DashboardStats userRole="admin" />;
      case 'visitors':
        return <VisitorManagement userRole="admin" />;
      case 'weapons':
        return <WeaponManagement userRole="admin" />;
      case 'appointments':
        return <AppointmentManagement userRole="admin" />;
      case 'reports':
        return <ReportsSection />;
      case 'users':
        return <UserManagement />;
      default:
        return <DashboardStats userRole="admin" />;
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar userRole="admin" activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-grow-1 d-flex flex-column">
        <header className="bg-white shadow-sm border-bottom px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0 text-capitalize">
              {activeTab}
            </h1>
            <div className="d-flex align-items-center">
              <div className="text-end me-3">
                <p className="mb-0 fw-medium">{user?.name}</p>
                <small className="text-muted">Administrator</small>
              </div>
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                <span className="text-white fw-bold">
                  {user?.name?.charAt(0) || 'A'}
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