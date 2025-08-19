import React from 'react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <h2>EFP Admin</h2>
      </div>
      <div className="nav-menu">
        <div className="nav-item active">
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-users"></i>
          <span>Visitors</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-user-shield"></i>
          <span>Accounts</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-boxes"></i>
          <span>Weapons</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-chart-line"></i>
          <span>Reports</span>
        </div>
        <div className="nav-item">
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
}
