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
        pendingAppointments: Math.floor(Math.random() * 10) + 5,
        completedAppointments: Math.floor(Math.random() * 20) + 15
      });

      setRecentActivity(visitors.slice(0, 5).map(v => ({
        id: v.id,
        type: 'visitor_registered',
        message: `${v.name} registered for ${v.destination}`,
        time: v.created_at,
        icon: 'fas fa-user-plus',
        color: 'text-success'
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, bgColor, change }) => (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted small mb-1">{title}</p>
              <h3 className="fw-bold mb-1">{value}</h3>
              {change && (
                <p className={`small mb-0 ${change > 0 ? 'text-success' : 'text-danger'}`}>
                  {change > 0 ? '+' : ''}{change}% from yesterday
                </p>
              )}
            </div>
            <div className={`rounded-circle d-flex align-items-center justify-content-center ${bgColor}`} style={{width: '48px', height: '48px'}}>
              <i className={`${icon} text-white`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Grid */}
      <div className="row">
        <StatCard
          title="Today's Visitors"
          value={stats.todayVisitors}
          icon="fas fa-users"
          bgColor="bg-primary"
          change={12}
        />
        <StatCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon="fas fa-user-check"
          bgColor="bg-success"
          change={8}
        />
        <StatCard
          title="Active Visitors"
          value={stats.activeVisitors}
          icon="fas fa-user-clock"
          bgColor="bg-warning"
          change={-3}
        />
        <StatCard
          title="Weapons Registered"
          value={stats.weaponsRegistered}
          icon="fas fa-shield-alt"
          bgColor="bg-danger"
        />
        <StatCard
          title="Pending Appointments"
          value={stats.pendingAppointments}
          icon="fas fa-calendar-alt"
          bgColor="bg-info"
        />
        <StatCard
          title="Completed Today"
          value={stats.completedAppointments}
          icon="fas fa-check-circle"
          bgColor="bg-secondary"
        />
      </div>

      {/* Recent Activity */}
      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="card-title mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              {recentActivity.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">No recent activity</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-start">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                          <i className={`${activity.icon} ${activity.color}`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1">{activity.message}</p>
                          <small className="text-muted">
                            {new Date(activity.time).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {userRole === 'secretary' && (
                  <div className="col-6">
                    <button className="btn btn-outline-primary w-100 d-flex flex-column align-items-center py-3">
                      <i className="fas fa-user-plus fs-4 mb-2"></i>
                      <span className="small">Register Visitor</span>
                    </button>
                  </div>
                )}
                <div className="col-6">
                  <button className="btn btn-outline-success w-100 d-flex flex-column align-items-center py-3">
                    <i className="fas fa-calendar-plus fs-4 mb-2"></i>
                    <span className="small">Schedule Appointment</span>
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-info w-100 d-flex flex-column align-items-center py-3">
                    <i className="fas fa-download fs-4 mb-2"></i>
                    <span className="small">Export Report</span>
                  </button>
                </div>
                {userRole === 'admin' && (
                  <div className="col-6">
                    <button className="btn btn-outline-warning w-100 d-flex flex-column align-items-center py-3">
                      <i className="fas fa-user-cog fs-4 mb-2"></i>
                      <span className="small">Manage Users</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}