import React from 'react';
import './ActivityTimeline.css';

export default function ActivityTimeline() {
  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Recent System Activity</h2>
        <button className="btn">
          <i className="fas fa-history"></i> View All
        </button>
      </div>

      <div className="timeline">
        <div className="timeline-item">
          <div className="timeline-time">Today, 11:45 AM</div>
          <div className="timeline-content">
            <strong>Officer Teshome</strong> checked out visitor <strong>Hana Mohammed</strong>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-time">Today, 11:30 AM</div>
          <div className="timeline-content">
            <strong>System Alert:</strong> Unauthorized access attempt at <strong>Gate B</strong>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-time">Today, 10:15 AM</div>
          <div className="timeline-content">
            <strong>Commissioner Admin</strong> registered new secretary <strong>Yohannes</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
