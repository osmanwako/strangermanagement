import React, { useEffect, useState } from "react";
import "./VisitorTable.css";
import { visitorAPI } from "../api/Api";

export default function VisitorTable() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVisitors() {
      try {
        const res = await visitorAPI.getAll();
        setVisitors(res.data);
      } catch (e) {
        setVisitors([]);
      } finally {
        setLoading(false);
      }
    }
    fetchVisitors();
  }, []);

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Recent Visitors</h2>
        <button className="btn">
          <i className="fas fa-download"></i> Export
        </button>
      </div>
      <table className="visitors-table">
        <thead>
          <tr>
            <th>Visitor</th>
            <th>ID Number</th>
            <th>Time In</th>
            <th>Destination</th>
            <th>Assets</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Loading...</td>
            </tr>
          ) : visitors.length === 0 ? (
            <tr>
              <td colSpan="6">No visitors found.</td>
            </tr>
          ) : (
            visitors.slice(0, 10).map((v, i) => (
              <tr key={v.id || i}>
                <td>
                  <div className="visitor-name-cell">
                    <img
                      src={
                        v.photo ||
                        "https://randomuser.me/api/portraits/men/32.jpg"
                      }
                      alt="visitor"
                    />
                    <span>{v.name || v.full_name || "Unknown"}</span>
                  </div>
                </td>
                <td>{v.id_number || v.id || ""}</td>
                <td>
                  {v.created_at
                    ? new Date(v.created_at).toLocaleTimeString()
                    : ""}
                </td>
                <td>{v.destination || ""}</td>
                <td>
                  {v.assets
                    ? v.assets.length
                    : v.weapons
                    ? v.weapons.length
                    : 0}
                </td>
                <td>
                  <span className="badge badge-active">Active</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
