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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Registered Weapons</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weapon ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : weapons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No weapons registered
                  </td>
                </tr>
              ) : (
                weapons.map((weapon) => (
                  <tr key={weapon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">
                        WPN-{weapon.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {weapon.visitor?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {weapon.visitor?.id_number || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {weapon.weapon_type || weapon.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {weapon.serial || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {weapon.weapon_description || weapon.description || 'No description'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(weapon.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => showBarcode(weapon)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <i className="fas fa-barcode mr-1"></i>
                        Barcode
                      </button>
                      {userRole === 'admin' && (
                        <button
                          onClick={() => deleteWeapon(weapon.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <i className="fas fa-trash mr-1"></i>
                          Delete
                        </button>
                      )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Weapon Barcode</h3>
              <button
                onClick={() => setShowBarcodeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-gray-600">Weapon ID</p>
                <p className="font-mono font-semibold">WPN-{selectedWeapon.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-semibold">{selectedWeapon.weapon_type || selectedWeapon.type}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Serial</p>
                <p className="font-mono">{selectedWeapon.serial}</p>
              </div>

              <div className="py-4">
                <BarcodeGenerator value={`WPN-${selectedWeapon.id}`} />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-print mr-2"></i>
                  Print
                </button>
                <button
                  onClick={() => setShowBarcodeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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