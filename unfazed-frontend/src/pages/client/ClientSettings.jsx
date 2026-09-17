import React, { useState } from 'react';
import { User, Bell, Shield, Heart, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import ClientNavbar from '../../components/common/ClientNavbar';

export const ClientSettings = () => {
  const { currentClient } = useAuth();
  const { showToast } = useData();

  const [name, setName] = useState(currentClient.name);
  const [email, setEmail] = useState(currentClient.email);
  const [phone, setPhone] = useState(currentClient.phone);
  const [emergencyContact, setEmergencyContact] = useState(currentClient.intakeSummary?.emergencyContact || 'Dev Sen - +91 98201 98765');
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Your sanctuary profile and notification preferences have been updated');
  };

  return (
    <div className="min-h-screen bg-vanilla text-midnight flex flex-col font-sans pb-16">
      <ClientNavbar />

      <main className="max-w-3xl mx-auto w-full p-6 sm:p-10 space-y-6 flex-1">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Client Account</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-midnight mt-1">
            My Sanctuary Settings
          </h1>
          <p className="text-xs text-midnight-muted mt-1">
            Manage your personal profile, notifications, and emergency contacts.
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow space-y-6 text-xs text-midnight">
          {/* Avatar & Profile */}
          <div className="flex items-center gap-4 pb-6 border-b border-misty/20">
            <img
              src={currentClient.avatar}
              alt={currentClient.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blush"
            />
            <div>
              <h3 className="text-base font-bold text-midnight">{currentClient.name}</h3>
              <p className="text-midnight-muted">{currentClient.email}</p>
              <span className="text-[10px] text-sage-dark font-semibold">Active Client Sanctuary Member</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-midnight mb-1">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
              />
            </div>
            <div>
              <label className="block font-bold text-midnight mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-midnight mb-1">Phone (for WhatsApp Reminders)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
              />
            </div>
            <div>
              <label className="block font-bold text-midnight mb-1">Emergency Contact Information</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-xs focus:outline-none focus:border-rosewood"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="pt-4 border-t border-misty/20 space-y-3">
            <h4 className="font-bold text-sm text-midnight">Notification Preferences</h4>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-vanilla/40 border border-misty/30">
              <div>
                <p className="font-bold text-midnight">WhatsApp Session Alerts & Links</p>
                <p className="text-midnight-muted text-[11px]">Receive Google Meet links and 24h reminders on WhatsApp</p>
              </div>
              <input
                type="checkbox"
                checked={whatsappNotifications}
                onChange={(e) => setWhatsappNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-rosewood focus:ring-rosewood"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-vanilla/40 border border-misty/30">
              <div>
                <p className="font-bold text-midnight">Google Calendar Synchronisation</p>
                <p className="text-midnight-muted text-[11px]">Automatically add booked consultations to your Google Calendar</p>
              </div>
              <input
                type="checkbox"
                checked={calendarSync}
                onChange={(e) => setCalendarSync(e.target.checked)}
                className="w-4 h-4 rounded text-rosewood focus:ring-rosewood"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-misty/20">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-rosewood text-white font-bold text-xs hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20"
            >
              <Save size={14} />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ClientSettings;
