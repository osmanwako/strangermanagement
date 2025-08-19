import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <div className="header">
      <h1>Dashboard Overview</h1>
      <div className="user-profile">
        <div className="user-avatar">AD</div>
        <span>Commissioner Admin</span>
      </div>
    </div>
  );
}
