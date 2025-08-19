import React, { useEffect, useState } from "react";
import { dashboardAPI, visitorAPI } from "../api/Api";
import "./AdminDashboard.css"; // Assuming you have some styles for the dashboard

export default function AdminDashboard() {
  const [stats, setStats] = useState({ today_visitors: 0, with_weapons: 0, destinations: [] });
  const [recent, setRecent] = useState([]);
  const [filters, setFilters] = useState({ date_from: "", date_to: "", destination: "", q: "" });

  useEffect(() => {
    dashboardAPI.stats().then(res => setStats(res.data)).catch(() => {});
    visitorAPI.getAll({ per_page: 10 }).then(res => setRecent(res.data.data || res.data)).catch(()=>{});
  }, []);

  const runReport = async () => {
    // open export directly with selected filters (downloads CSV)
    const res = await visitorAPI.export(filters);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url; a.download = `report_${new Date().toISOString()}.csv`; a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-grid">
      <section className="widgets">
        <div className="card"><h3>Today's Visitors</h3><p>{stats.today_visitors}</p></div>
        <div className="card"><h3>With Weapons</h3><p>{stats.with_weapons}</p></div>
        <div className="card">
          <h3>Top Destinations</h3>
          <ul>{stats.destinations?.map(d => <li key={d.destination}>{d.destination}: {d.total}</li>)}</ul>
        </div>
      </section>

      <section className="card">
        <h3>Recent Activity</h3>
        <table className="visitors-table">
          <thead><tr><th>Name</th><th>Destination</th><th>Weapons</th><th>Time In</th></tr></thead>
          <tbody>
            {recent.map((v) => (
              <tr key={v.id}><td>{v.name}</td><td>{v.destination}</td><td>{v.weapons_count || (v.weapons?.length || 0)}</td><td>{new Date(v.created_at).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>Generate Report</h3>
        <div className="filters">
          <input placeholder="Search" value={filters.q} onChange={(e)=>setFilters({...filters,q:e.target.value})} />
          <input type="date" value={filters.date_from} onChange={(e)=>setFilters({...filters,date_from:e.target.value})} />
          <input type="date" value={filters.date_to} onChange={(e)=>setFilters({...filters,date_to:e.target.value})} />
          <button className="btn-primary" onClick={runReport}>Export CSV</button>
        </div>
      </section>
    </div>
  );
}
