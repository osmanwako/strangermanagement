// import React, { useEffect, useState } from "react";
// import "./WidgetSection.css";
// import { visitorAPI, weaponAPI } from "../api/Api";

// export default function WidgetSection() {
//   const [stats, setStats] = useState({
//     visitors: 0,
//     weapons: 0,
//     alerts: 0,
//     staff: 0,
//     loading: true,
//   });

//   useEffect(() => {
//     async function fetchStats() {
//       try {
//         // Fetch visitors
//         const visitorsRes = await visitorAPI.getAll();
//         const today = new Date().toISOString().slice(0, 10);
//         const todaysVisitors = visitorsRes.data.filter(
//           (v) => v.created_at && v.created_at.startsWith(today)
//         );
//         // Fetch weapons
//         const weaponsRes = await weaponAPI.getAll();
//         const todaysWeapons = weaponsRes.data.filter(
//           (w) => w.created_at && w.created_at.startsWith(today)
//         );
//         // TODO: Fetch alerts and staff from backend when available
//         setStats({
//           visitors: todaysVisitors.length,
//           weapons: todaysWeapons.length,
//           alerts: 5, // Placeholder, replace with real API when available
//           staff: 42, // Placeholder, replace with real API when available
//           loading: false,
//         });
//       } catch (e) {
//         setStats({
//           visitors: 0,
//           weapons: 0,
//           alerts: 0,
//           staff: 0,
//           loading: false,
//         });
//       }
//     }
//     fetchStats();
//   }, []);

//   if (stats.loading) {
//     return <div className="dashboard-widgets">Loading...</div>;
//   }

//   return (
//     <div className="dashboard-widgets">
//       <div className="widget visitors">
//         <div className="widget-header">
//           <span className="widget-title">Today's Visitors</span>
//           {/* You can add a trend indicator here if you have historical data */}
//         </div>
//         <div className="widget-value">{stats.visitors}</div>
//         <div className="widget-icon">
//           <i className="fas fa-user-check"></i>
//         </div>
//       </div>

//       <div className="widget weapons">
//         <div className="widget-header">
//           <span className="widget-title">Weapons Declared</span>
//         </div>
//         <div className="widget-value">{stats.weapons}</div>
//         <div className="widget-icon">
//           <i className="fas fa-gun"></i>
//         </div>
//       </div>

//       <div className="widget alerts">
//         <div className="widget-header">
//           <span className="widget-title">Security Alerts</span>
//         </div>
//         <div className="widget-value">{stats.alerts}</div>
//         <div className="widget-icon">
//           <i className="fas fa-shield-alt"></i>
//         </div>
//       </div>

//       <div className="widget staff">
//         <div className="widget-header">
//           <span className="widget-title">Active Staff</span>
//         </div>
//         <div className="widget-value">{stats.staff}</div>
//         <div className="widget-icon">
//           <i className="fas fa-user-tie"></i>
//         </div>
//       </div>
//     </div>
//   );
// }
