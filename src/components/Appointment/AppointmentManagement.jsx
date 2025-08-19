import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

export default function AppointmentManagement({ userRole }) {
  const [appointments, setAppointments] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    visitor_name: '',
    visitor_phone: '',
    visitor_email: '',
    appointment_date: '',
    appointment_time: '',
    destination: '',
    purpose: '',
    notes: ''
  });

  // Mock appointments data
  useEffect(() => {
    const mockAppointments = [
      {
        id: 1,
        visitor_name: 'John Doe',
        visitor_phone: '+251911234567',
        appointment_date: format(new Date(), 'yyyy-MM-dd'),
        appointment_time: '10:00',
        destination: 'Commissioner Office',
        purpose: 'Meeting with Commissioner',
        status: 'confirmed'
      },
      {
        id: 2,
        visitor_name: 'Jane Smith',
        visitor_phone: '+251922345678',
        appointment_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        appointment_time: '14:30',
        destination: 'CID Department',
        purpose: 'Document submission',
        status: 'pending'
      },
      {
        id: 3,
        visitor_name: 'Ahmed Hassan',
        visitor_phone: '+251933456789',
        appointment_date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
        appointment_time: '09:15',
        destination: 'HR Department',
        purpose: 'Job interview',
        status: 'confirmed'
      }
    ];
    setAppointments(mockAppointments);
  }, []);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.appointment_date === dateStr);
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    const appointment = {
      id: Date.now(),
      ...newAppointment,
      status: 'pending'
    };
    setAppointments(prev => [...prev, appointment]);
    setNewAppointment({
      visitor_name: '',
      visitor_phone: '',
      visitor_email: '',
      appointment_date: '',
      appointment_time: '',
      destination: '',
      purpose: '',
      notes: ''
    });
    setShowAddModal(false);
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
  };

  const deleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
          <p className="text-gray-600">Manage visitor appointments and schedules</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          Schedule Appointment
        </button>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Weekly Calendar</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="font-medium">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </span>
            <button
              onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map((day) => {
            const dayAppointments = getAppointmentsForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                className={`bg-white p-4 min-h-32 ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {format(day, 'EEE d')}
                </div>
                <div className="space-y-1">
                  {dayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className={`text-xs p-2 rounded cursor-pointer ${
                        apt.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : apt.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="font-medium">{apt.appointment_time}</div>
                      <div className="truncate">{apt.visitor_name}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">All Appointments</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.visitor_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.visitor_phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(parseISO(appointment.appointment_date), 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.appointment_time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Confirm
                      </button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => deleteAppointment(appointment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Schedule New Appointment</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visitor Name *
                </label>
                <input
                  type="text"
                  value={newAppointment.visitor_name}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, visitor_name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newAppointment.visitor_phone}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, visitor_phone: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newAppointment.appointment_date}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, appointment_date: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={newAppointment.appointment_time}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, appointment_time: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <select
                  value={newAppointment.destination}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, destination: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Destination</option>
                  <option value="Commissioner Office">Commissioner Office</option>
                  <option value="CID Department">CID Department</option>
                  <option value="System Development">System Development</option>
                  <option value="9th Floor">9th Floor</option>
                  <option value="HR Department">HR Department</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose *
                </label>
                <input
                  type="text"
                  value={newAppointment.purpose}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, purpose: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}