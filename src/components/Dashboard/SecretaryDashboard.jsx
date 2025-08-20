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
        // Redirect to login if not authenticated
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="secretary" activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab === 'register' ? 'Register Visitor' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Secretary</p>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0) || 'S'}
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