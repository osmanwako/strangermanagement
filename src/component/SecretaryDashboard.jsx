import React, { useEffect, useState } from "react";
import { visitorAPI } from "../api/Api";
import { QRCodeCanvas } from "qrcode.react";


export default function SecretaryDashboard() {
  // form state (visitor registration)
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idType, setIdType] = useState("national_id");
  const [wereda, setWereda] = useState("");
  const [subcity, setSubcity] = useState("");
  const [destination, setDestination] = useState("");
  const [visitPurpose, setVisitPurpose] = useState("");
  const [isVIP, setIsVIP] = useState(false);
  const [weapons, setWeapons] = useState([]); // [{ type, serial }]
  const [photoDataUrl, setPhotoDataUrl] = useState(null); // optional capture
  const [loading, setLoading] = useState(false);

  // log & filters
  const [filters, setFilters] = useState({
    q: "",
    destination: "",
    has_weapon: "",
    date_from: "",
    date_to: "",
  });
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loadingList, setLoadingList] = useState(false);

  // OCR / camera placeholder
  const handleRunOCR = async (imageDataUrl) => {
    // Hook for OCR service: send imageDataUrl to OCR API, parse name/id etc.
    // Example: const res = await fetch('/ocr', {method:'POST', body: imageDataUrl});
    // Then setName(...), setIdNumber(...), setIdType(...)
    console.log("OCR hook (implement real OCR)", imageDataUrl);
  };

  // add/remove weapon
  const addWeapon = () => setWeapons((s) => [...s, { type: "", serial: "" }]);
  const updateWeapon = (i, key, val) => {
    setWeapons((s) => s.map((w, idx) => (idx === i ? { ...w, [key]: val } : w)));
  };
  const removeWeapon = (i) => setWeapons((s) => s.filter((_, idx) => idx !== i));

  // register visitor
  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!destination || !visitPurpose) {
      alert("Destination and purpose are required");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name,
        id_number: idNumber,
        id_type: idType,
        wereda,
        subcity,
        photo: photoDataUrl,
        destination,
        visit_purpose: visitPurpose,
        vip: !!isVIP,
        weapons,
      };
      const res = await visitorAPI.create(payload);
      // Clear form but keep useful values
      setName(""); setIdNumber(""); setWeapons([]); setVisitPurpose("");
      // refresh log
      fetchVisitorLog();
      alert("Visitor registered successfully");
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  // fetch paginated log
  const fetchVisitorLog = async () => {
    setLoadingList(true);
    try {
      const res = await visitorAPI.getAll({
        ...filters,
        page,
        per_page: perPage,
        sort_by: "created_at",
        sort_order: "desc",
      });
      setRows(res.data.data || res.data);
      setMeta(res.data.meta || res.data.meta || null);
    } catch (err) {
      setRows([]);
      setMeta(null);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { fetchVisitorLog(); }, [page, perPage]); // initial + paging
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchVisitorLog(); }, 300);
    return () => clearTimeout(t);
  }, [filters]);

  const exportCSV = async () => {
    const res = await visitorAPI.export({ ...filters });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitors_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="secretary-container">
      <h2>Visitor Registration (Secretary)</h2>

      <form onSubmit={handleRegister} className="register-card">
        {/* OCR / camera area */}
        <div className="ocr-area">
          <label>Camera / Upload (OCR)</label>
          <input type="file" accept="image/*" onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = () => {
              setPhotoDataUrl(reader.result);
              handleRunOCR(reader.result);
            };
            reader.readAsDataURL(f);
          }} />
        </div>

        <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="ID number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
        <select value={idType} onChange={(e) => setIdType(e.target.value)}>
          <option value="national_id">National ID</option>
          <option value="staff_id">Organization ID</option>
          <option value="passport">Passport</option>
        </select>

        <input placeholder="Wereda" value={wereda} onChange={(e) => setWereda(e.target.value)} />
        <input placeholder="Subcity" value={subcity} onChange={(e) => setSubcity(e.target.value)} />

        <select value={destination} onChange={(e) => setDestination(e.target.value)}>
          <option value="">Select Destination Office</option>
          <option value="Commissioner">Commissioner</option>
          <option value="CID">CID</option>
          <option value="System Development">System Development</option>
          <option value="9th Floor">9th Floor</option>
        </select>

        <input placeholder="Purpose of visit" value={visitPurpose} onChange={(e) => setVisitPurpose(e.target.value)} />

        <label><input type="checkbox" checked={isVIP} onChange={(e) => setIsVIP(e.target.checked)} /> VIP (pre-authorized)</label>

        <div className="weapons-section">
          <h4>Restricted Items (weapons)</h4>
          {weapons.map((w, i) => (
            <div className="weapon-row" key={i}>
              <input placeholder="Type" value={w.type} onChange={(e) => updateWeapon(i, "type", e.target.value)} />
              <input placeholder="Serial / Tag" value={w.serial} onChange={(e) => updateWeapon(i, "serial", e.target.value)} />
              <button type="button" onClick={() => removeWeapon(i)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addWeapon}>Add Weapon</button>
        </div>

        <div className="register-actions">
          <button className="btn-primary" disabled={loading} type="submit">Register Visitor</button>
        </div>
      </form>

      {/* Live visitor log & filters */}
      <section className="visitor-log-section">
        <div className="filters">
          <input placeholder="Search name / ID / destination" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
          <select value={filters.destination} onChange={(e) => setFilters({ ...filters, destination: e.target.value })}>
            <option value="">All Destinations</option>
            <option value="Commissioner">Commissioner</option>
            <option value="CID">CID</option>
            <option value="System Development">System Development</option>
            <option value="9th Floor">9th Floor</option>
          </select>
          <select value={filters.has_weapon} onChange={(e) => setFilters({ ...filters, has_weapon: e.target.value })}>
            <option value="">With/Without Weapons</option>
            <option value="true">With Weapons</option>
            <option value="false">No Weapons</option>
          </select>
          <input type="date" value={filters.date_from} onChange={(e) => setFilters({ ...filters, date_from: e.target.value })} />
          <input type="date" value={filters.date_to} onChange={(e) => setFilters({ ...filters, date_to: e.target.value })} />
          <button className="btn" onClick={exportCSV}>Export CSV</button>
        </div>

        <div className="table-wrap">
          <table className="visitors-table">
            <thead>
              <tr><th>Name</th><th>ID</th><th>Destination</th><th>Purpose</th><th>Weapons</th><th>Time In</th></tr>
            </thead>
            <tbody>
              {loadingList ? (
                <tr><td colSpan="6">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan="6">No visitors</td></tr>
              ) : rows.map((v) => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.id_number}</td>
                  <td>{v.destination}</td>
                  <td>{v.visit_purpose}</td>
                  <td>{v.weapons_count ?? (v.weapons?.length || 0)}</td>
                  <td>{new Date(v.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button disabled={!meta || meta.current_page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <span>{meta ? `Page ${meta.current_page} of ${meta.last_page}` : ""}</span>
          <button disabled={!meta || meta.current_page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>Next</button>
          <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option></select>
        </div>
      </section>
    </div>
  );
}
