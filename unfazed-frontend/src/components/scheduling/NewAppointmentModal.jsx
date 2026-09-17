import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';

export const NewAppointmentModal = ({ isOpen, onClose }) => {
  const { clients, therapist, addAppointment } = useData();

  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || '',
    serviceId: therapist.services[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    startTime: '11:00',
    duration: 50,
    mode: 'Video Meet',
    meetLink: 'https://meet.google.com/unf-session-live',
    fee: 2200,
  });

  const handleServiceChange = (e) => {
    const srvId = e.target.value;
    const selectedSrv = therapist.services.find(s => s.id === srvId);
    setFormData({
      ...formData,
      serviceId: srvId,
      duration: selectedSrv?.duration || 50,
      fee: selectedSrv?.price || 2200
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const client = clients.find(c => c.id === formData.clientId) || clients[0];
    const service = therapist.services.find(s => s.id === formData.serviceId) || therapist.services[0];

    // Calculate end time
    const [startH, startM] = formData.startTime.split(':').map(Number);
    const endMinutesTotal = startH * 60 + startM + parseInt(formData.duration, 10);
    const endH = Math.floor(endMinutesTotal / 60) % 24;
    const endM = endMinutesTotal % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    addAppointment({
      clientId: client.id,
      clientName: client.name,
      clientAvatar: client.avatar,
      serviceTitle: service.title,
      serviceId: service.id,
      date: formData.date,
      startTime: formData.startTime,
      endTime,
      duration: parseInt(formData.duration, 10),
      mode: formData.mode,
      meetLink: formData.mode === 'Video Meet' ? formData.meetLink : null,
      fee: formData.fee,
      paymentStatus: 'Paid'
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Clinical Session"
      subtitle="Book a therapeutic appointment with your client"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-midnight mb-1">Select Client *</label>
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-midnight mb-1">Service Offering *</label>
          <select
            value={formData.serviceId}
            onChange={handleServiceChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
          >
            {therapist.services.map(s => (
              <option key={s.id} value={s.id}>
                {s.title} — {s.duration} mins (₹{s.price})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Start Time *</label>
            <input
              type="time"
              required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Duration (Mins)</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
            >
              <option value={30}>30 mins</option>
              <option value={45}>45 mins</option>
              <option value={50}>50 mins</option>
              <option value={60}>60 mins</option>
              <option value={75}>75 mins</option>
              <option value={90}>90 mins</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Session Modality</label>
            <select
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
            >
              <option value="Video Meet">Secure Video (Google Meet / Telehealth)</option>
              <option value="In-Person Clinic">In-Person Consultation (Indiranagar)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Session Fee (₹)</label>
            <input
              type="number"
              value={formData.fee}
              onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />
          </div>
        </div>

        {formData.mode === 'Video Meet' && (
          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Video Meeting Link</label>
            <input
              type="url"
              value={formData.meetLink}
              onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-misty/20">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-midnight hover:bg-vanilla transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-rosewood text-white hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20"
          >
            Confirm Appointment
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewAppointmentModal;
