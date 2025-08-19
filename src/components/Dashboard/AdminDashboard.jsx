import React, { useState, useEffect } from 'react';
import Sidebar from '../Layout/Sidebar';
import DashboardStats from './DashboardStats';
import VisitorManagement from '../Visitor/VisitorManagement';
import WeaponManagement from '../Weapon/WeaponManagement';
import AppointmentManagement from '../Appointment/AppointmentManagement';
import ReportsSection from '../Reports/ReportsSection';
import UserManagement from '../User/UserManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="admin" activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}