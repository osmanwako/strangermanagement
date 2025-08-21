import React, { useState, useEffect } from 'react';
import { weaponAPI } from '../../api/Api';
import BarcodeGenerator from '../Common/BarcodeGenerator';

export default function WeaponManagement({ userRole }) {
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  useEffect(() => {
    fetchWeapons();
  }, []);

  const fetchWeapons = async () => {
    setLoading(true);
    try {
      const response = await weaponAPI.getAll();
      setWeapons(response.data);
    } catch (error) {
      console.error('Error fetching weapons:', error);
      setWeapons([]);
    } finally {
      setLoading(false);
    }
  };

  const showBarcode = (weapon) => {
    setSelectedWeapon(weapon);
    setShowBarcodeModal(true);
  };

  const returnWeapon = async (id) => {
    if (window.confirm('Are you sure you want to return this weapon?')) {
      try {
        await weaponAPI.return(id);
        fetchWeapons();
      } catch (error) {
        alert(error.response?.data?.message || 'Return failed');
      }
    }
  };

  const deleteWeapon = async (id) => {
    if (window.confirm('Are you sure you want to delete this weapon record?')) {
      try {
        await weaponAPI.delete(id);
        fetchWeapons();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

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
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="card-title mb-0">Registered Weapons</h5>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Weapon ID</th>
                <th>Visitor</th>
                <th>Type</th>
                <th>Serial Number</th>
                <th>Description</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {weapons.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    No weapons registered
                  </td>
                </tr>
              ) : (
                weapons.map((weapon) => (
                  <tr key={weapon.id}>
                    <td>
                      <span className="font-monospace fw-bold">
                        WPN-{weapon.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">{weapon.visitor?.name || 'Unknown'}</div>
                        <div className="text-muted small">ID: {weapon.visitor?.id_number || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">
                        {weapon.type}
                      </span>
                    </td>
                    <td className="font-monospace">{weapon.serial || 'N/A'}</td>
                    <td>{weapon.description || 'No description'}</td>
                    <td>
                      <span className={`badge ${weapon.status === 'returned' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {weapon.status}
                      </span>
                      {weapon.returned_at && (
                        <div className="text-muted small mt-1">
                          Returned: {new Date(weapon.returned_at).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="text-muted small">
                      {new Date(weapon.created_at).toLocaleString()}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          onClick={() => showBarcode(weapon)}
                          className="btn btn-outline-primary"
                          title="Show Barcode"
                        >
                          <i className="fas fa-barcode"></i>
                        </button>
                        {userRole === 'secretary' && weapon.status === 'stored' && (
                          <button
                            onClick={() => returnWeapon(weapon.id)}
                            className="btn btn-outline-success"
                            title="Return Weapon"
                          >
                            <i className="fas fa-undo"></i>
                          </button>
                        )}
                        {userRole === 'admin' && (
                          <button
                            onClick={() => deleteWeapon(weapon.id)}
                            className="btn btn-outline-danger"
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barcode Modal */}
      {showBarcodeModal && selectedWeapon && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Weapon Barcode</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBarcodeModal(false)}
                ></button>
              </div>
              
              <div className="modal-body text-center">
                <div className="mb-3">
                  <p className="text-muted mb-1">Weapon ID</p>
                  <p className="font-monospace fw-bold">WPN-{selectedWeapon.id}</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-muted mb-1">Type</p>
                  <p className="fw-bold">{selectedWeapon.type}</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-muted mb-1">Serial</p>
                  <p className="font-monospace">{selectedWeapon.serial}</p>
                </div>

                <div className="py-3">
                  <BarcodeGenerator value={`WPN-${selectedWeapon.id}`} />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary"
                >
                  <i className="fas fa-print me-2"></i>
                  Print
                </button>
                <button
                  onClick={() => setShowBarcodeModal(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}