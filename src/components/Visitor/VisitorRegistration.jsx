import React, { useState } from 'react';
import { visitorAPI } from '../../api/Api';
import BarcodeGenerator from '../Common/BarcodeGenerator';

export default function VisitorRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    id_number: '',
    id_type: 'national_id',
    wereda: '',
    subcity: '',
    destination: '',
    visit_purpose: '',
    vip: false,
    appointment_date: '',
    appointment_time: '',
    phone: '',
    email: ''
  });
  
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredVisitor, setRegisteredVisitor] = useState(null);

  const destinations = [
    'Commissioner Office',
    'CID Department',
    'System Development',
    '9th Floor',
    'HR Department',
    'Finance Department',
    'Legal Department'
  ];

  const idTypes = [
    { value: 'national_id', label: 'National ID' },
    { value: 'passport', label: 'Passport' },
    { value: 'staff_id', label: 'Staff ID' },
    { value: 'driver_license', label: 'Driver License' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addWeapon = () => {
    setWeapons(prev => [...prev, { type: '', serial: '', description: '' }]);
  };

  const updateWeapon = (index, field, value) => {
    setWeapons(prev => prev.map((weapon, i) => 
      i === index ? { ...weapon, [field]: value } : weapon
    ));
  };

  const removeWeapon = (index) => {
    setWeapons(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        weapons: weapons.filter(w => w.type && w.serial)
      };
      
      const response = await visitorAPI.create(payload);
      setRegisteredVisitor(response.data);
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        id_number: '',
        id_type: 'national_id',
        wereda: '',
        subcity: '',
        destination: '',
        visit_purpose: '',
        vip: false,
        appointment_date: '',
        appointment_time: '',
        phone: '',
        email: ''
      });
      setWeapons([]);
      
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success && registeredVisitor) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <i className="fas fa-check-circle text-green-600 text-2xl mr-3"></i>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Registration Successful!</h3>
              <p className="text-green-700">Visitor has been registered successfully.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Visitor Details</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="text-gray-900">{registeredVisitor.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Number</label>
              <p className="text-gray-900">{registeredVisitor.id_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination</label>
              <p className="text-gray-900">{registeredVisitor.destination}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Visit ID</label>
              <p className="text-gray-900 font-mono">VIS-{registeredVisitor.id}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-md font-semibold mb-2">Visitor Barcode</h4>
            <BarcodeGenerator value={`VIS-${registeredVisitor.id}`} />
          </div>

          {registeredVisitor.weapons && registeredVisitor.weapons.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">Weapon Barcodes</h4>
              <div className="space-y-4">
                {registeredVisitor.weapons.map((weapon, index) => (
                  <div key={index} className="border border-gray-200 rounded p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {weapon.type} - {weapon.serial}
                    </p>
                    <BarcodeGenerator value={`WPN-${weapon.id || index}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => setSuccess(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register Another Visitor
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-print mr-2"></i>
              Print Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Register New Visitor</h2>
          <p className="text-sm text-gray-600">Fill in the visitor information below</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Number *
                </label>
                <input
                  type="text"
                  name="id_number"
                  value={formData.id_number}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Type
                </label>
                <select
                  name="id_type"
                  value={formData.id_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {idTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wereda
                </label>
                <input
                  type="text"
                  name="wereda"
                  value={formData.wereda}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcity
                </label>
                <input
                  type="text"
                  name="subcity"
                  value={formData.subcity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Visit Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visit Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Destination</option>
                  {destinations.map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose of Visit *
                </label>
                <input
                  type="text"
                  name="visit_purpose"
                  value={formData.visit_purpose}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Time
                </label>
                <input
                  type="time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="vip"
                  checked={formData.vip}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">VIP Visitor</span>
              </label>
            </div>
          </div>

          {/* Weapons Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Weapons/Restricted Items</h3>
              <button
                type="button"
                onClick={addWeapon}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                <i className="fas fa-plus mr-1"></i>
                Add Weapon
              </button>
            </div>

            {weapons.map((weapon, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weapon Type
                    </label>
                    <input
                      type="text"
                      value={weapon.type}
                      onChange={(e) => updateWeapon(index, 'type', e.target.value)}
                      placeholder="e.g., Pistol, Knife"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      value={weapon.serial}
                      onChange={(e) => updateWeapon(index, 'serial', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeWeapon(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={weapon.description}
                    onChange={(e) => updateWeapon(index, 'description', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Registering...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  Register Visitor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}