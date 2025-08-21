import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../../api/Api';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

export default function AppointmentManagement({ userRole }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPostponeModal, setShowPostponeModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
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
  const [postponeData, setPostponeData] = useState({
    new_date: '',
    new_time: '',
    reason: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.appointment_date === dateStr);
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      await appointmentAPI.create(newAppointment);
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
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create appointment');
    }
  };

  const handlePostpone = async (e) => {
    e.preventDefault();
    try {
      await appointmentAPI.postpone(selectedAppointment.id, postponeData);
      setShowPostponeModal(false);
      setSelectedAppointment(null);
      setPostponeData({ new_date: '', new_time: '', reason: '' });
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to postpone appointment');
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await appointmentAPI.update(id, { status });
      fetchAppointments();
    } catch (error) {
      alert('Failed to update appointment status');
    }
  };

  const deleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentAPI.delete(id);
        fetchAppointments();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete appointment');
      }
    }
  };

  const destinations = [
    'Commissioner Office',
    'CID Department',
    'System Development',
    '9th Floor',
    'HR Department',
    'Finance Department',
    'Legal Department'
  ];

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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">Appointment Management</h2>
          <p className="text-muted">Manage visitor appointments and schedules</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <i className="fas fa-plus me-2"></i>
          Schedule Appointment
        </button>
      </div>

      {/* Calendar View */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Weekly Calendar</h5>
          <div className="d-flex align-items-center">
            <button
              onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
              className="btn btn-sm btn-outline-secondary me-2"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="fw-medium mx-3">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </span>
            <button
              onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
              className="btn btn-sm btn-outline-secondary"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="row g-1 p-3">
          {weekDays.map((day) => {
            const dayAppointments = getAppointmentsForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div key={day.toISOString()} className="col">
                <div className={`card h-100 ${isToday ? 'border-primary' : ''}`} style={{minHeight: '150px'}}>
                  <div className="card-body p-2">
                    <div className={`fw-medium mb-2 ${isToday ? 'text-primary' : ''}`}>
                      {format(day, 'EEE d')}
                    </div>
                    <div className="d-flex flex-column gap-1">
                      {dayAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className={`small p-1 rounded cursor-pointer ${
                            apt.status === 'confirmed' 
                              ? 'bg-success text-white' 
                              : apt.status === 'pending'
                              ? 'bg-warning text-dark'
                              : apt.status === 'postponed'
                              ? 'bg-info text-white'
                              : 'bg-danger text-white'
                          }`}
                          style={{fontSize: '0.75rem'}}
                        >
                          <div className="fw-bold">{apt.appointment_time}</div>
                          <div className="text-truncate">{apt.visitor_name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointments List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="card-title mb-0">All Appointments</h5>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Visitor</th>
                <th>Date & Time</th>
                <th>Destination</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    <div>
                      <div className="fw-medium">{appointment.visitor_name}</div>
                      <div className="text-muted small">{appointment.visitor_phone}</div>
                    </div>
                  </td>
                  <td>
                    <div>{format(parseISO(appointment.appointment_date), 'MMM d, yyyy')}</div>
                    <div className="text-muted small">{appointment.appointment_time}</div>
                    {appointment.postponed_from && (
                      <div className="text-info small">
                        <i className="fas fa-clock me-1"></i>
                        Moved from {appointment.postponed_from}
                      </div>
                    )}
                  </td>
                  <td>{appointment.destination}</td>
                  <td>{appointment.purpose}</td>
                  <td>
                    <span className={`badge ${
                      appointment.status === 'confirmed' 
                        ? 'bg-success' 
                        : appointment.status === 'pending'
                        ? 'bg-warning text-dark'
                        : appointment.status === 'postponed'
                        ? 'bg-info'
                        : appointment.status === 'completed'
                        ? 'bg-secondary'
                        : 'bg-danger'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          className="btn btn-outline-success"
                          title="Confirm"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          className="btn btn-outline-primary"
                          title="Complete"
                        >
                          <i className="fas fa-check-double"></i>
                        </button>
                      )}
                      {userRole === 'admin' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowPostponeModal(true);
                            }}
                            className="btn btn-outline-warning"
                            title="Postpone"
                          >
                            <i className="fas fa-clock"></i>
                          </button>
                          <button
                            onClick={() => deleteAppointment(appointment.id)}
                            className="btn btn-outline-danger"
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Schedule New Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              
              <form onSubmit={handleAddAppointment}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Visitor Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAppointment.visitor_name}
                        onChange={(e) => setNewAppointment(prev => ({ ...prev, visitor_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={newAppointment.visitor_phone}
                        onChange={(e) => setNewAppointment(prev => ({ ...prev, visitor_phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newAppointment.visitor_email}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, visitor_email: e.target.value }))}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newAppointment.appointment_date}
                        onChange={(e) => setNewAppointment(prev => ({ ...prev, appointment_date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Time *</label>
                      <input
                        type="time"
                        className="form-control"
                        value={newAppointment.appointment_time}
                        onChange={(e) => setNewAppointment(prev => ({ ...prev, appointment_time: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Destination *</label>
                    <select
                      className="form-select"
                      value={newAppointment.destination}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, destination: e.target.value }))}
                      required
                    >
                      <option value="">Select Destination</option>
                      {destinations.map(dest => (
                        <option key={dest} value={dest}>{dest}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Purpose *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newAppointment.purpose}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, purpose: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Postpone Modal */}
      {showPostponeModal && selectedAppointment && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Postpone Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPostponeModal(false)}
                ></button>
              </div>
              
              <form onSubmit={handlePostpone}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <strong>Current:</strong> {selectedAppointment.visitor_name} - {format(parseISO(selectedAppointment.appointment_date), 'MMM d, yyyy')} at {selectedAppointment.appointment_time}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">New Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={postponeData.new_date}
                        onChange={(e) => setPostponeData(prev => ({ ...prev, new_date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">New Time *</label>
                      <input
                        type="time"
                        className="form-control"
                        value={postponeData.new_time}
                        onChange={(e) => setPostponeData(prev => ({ ...prev, new_time: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Reason for Postponement *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={postponeData.reason}
                      onChange={(e) => setPostponeData(prev => ({ ...prev, reason: e.target.value }))}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPostponeModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Postpone
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}