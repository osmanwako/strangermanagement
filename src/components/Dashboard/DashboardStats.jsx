import React, { useState, useEffect } from 'react';
import { visitorAPI } from '../../api/Api';

export default function DashboardStats({ userRole }) {
  const [stats, setStats] = useState({
    todayVisitors: 0,
    totalVisitors: 0,
    activeVisitors: 0,
    weaponsRegistered: 0,
    pendingAppointments: 0,
    completedAppointments: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await visitorAPI.getAll();
      const visitors = response.data.data || response.data;
      
      const today = new Date().toDateString();
      const todayVisitors = visitors.filter(v => 
        new Date(v.created_at).toDateString() === today
      );
      
      const weaponsCount = visitors.reduce((acc, v) => 
        acc + (v.weapons_count || v.weapons?.length || 0), 0
      );

      setStats({
        todayVisitors: todayVisitors.length,
        totalVisitors: visitors.length,
        activeVisitors: visitors.filter(v => !v.archived_at).length,
        weaponsRegistered: weaponsCount,
        pendingAppointments: Math.floor(Math.random() * 10) + 5, // Mock data
        completedAppointments: Math.floor(Math.random() * 20) + 15 // Mock data
      });

      // Set recent activity
      setRecentActivity(visitors.slice(0, 5).map(v => ({
        id: v.id,
        type: 'visitor_registered',
        message: `${v.name} registered for ${v.destination}`,
        time: v.created_at,
        icon: 'fas fa-user-plus',
        color: 'text-green-600'
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, change }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from yesterday
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <i className={`${icon} text-white text-xl`}></i>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Today's Visitors"
          value={stats.todayVisitors}
          icon="fas fa-users"
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon="fas fa-user-check"
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Active Visitors"
          value={stats.activeVisitors}
          icon="fas fa-user-clock"
          color="bg-yellow-500"
          change={-3}
        />
        <StatCard
          title="Weapons Registered"
          value={stats.weaponsRegistered}
          icon="fas fa-shield-alt"
          color="bg-red-500"
        />
        <StatCard
          title="Pending Appointments"
          value={stats.pendingAppointments}
          icon="fas fa-calendar-alt"
          color="bg-purple-500"
        />
        <StatCard
          title="Completed Today"
          value={stats.completedAppointments}
          icon="fas fa-check-circle"
          color="bg-indigo-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full bg-gray-100`}>
                    <i className={`${activity.icon} ${activity.color} text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userRole === 'secretary' && (
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="fas fa-user-plus text-2xl text-blue-600 mb-2"></i>
                <span className="text-sm font-medium">Register Visitor</span>
              </button>
            )}
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <i className="fas fa-calendar-plus text-2xl text-green-600 mb-2"></i>
              <span className="text-sm font-medium">Schedule Appointment</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <i className="fas fa-download text-2xl text-purple-600 mb-2"></i>
              <span className="text-sm font-medium">Export Report</span>
            </button>
            {userRole === 'admin' && (
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="fas fa-user-cog text-2xl text-orange-600 mb-2"></i>
                <span className="text-sm font-medium">Manage Users</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}