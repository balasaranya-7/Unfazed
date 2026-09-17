import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  CreditCard,
  Lock,
  Clock,
  CheckCircle2,
  Save,
  Key,
  Globe,
  Smartphone
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Settings = () => {
  const { showToast } = useData();
  const [activeCategory, setActiveCategory] = useState('booking'); // booking, notifications, payments, security, privacy

  // Settings State
  const [settings, setSettings] = useState({
    autoConfirmBookings: true,
    advanceNoticeHours: 12,
    cancellationPolicyHours: 24,
    allowRescheduling: true,
    whatsappReminders: true,
    emailInvoices: true,
    postSessionFeedback: false,
    razorpayKey: 'rzp_test_unfazed_demo',
    upiId: 'dr.aditi@okaxis',
    gstRegistered: true,
    gstNumber: '29AABCU1234F1Z8',
    twoFactorAuth: true,
    sessionTimeoutMins: 30,
    clientDataEncryption: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Practice settings saved and applied successfully');
  };

  const categories = [
    { id: 'booking', label: 'Booking Preferences', icon: Clock },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
    { id: 'payments', label: 'Payment & Invoicing', icon: CreditCard },
    { id: 'security', label: 'Security & 2FA', icon: Lock },
    { id: 'privacy', label: 'Clinical Privacy & DPDP', icon: Shield },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-vanilla pb-16">
      {/* Header */}
      <div className="bg-white border-b border-misty/30 px-6 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Configuration Center</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
              <span className="text-xs font-semibold text-midnight-muted">Practice System Rules</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-midnight tracking-tight mt-1">
              Settings & Clinical Policies
            </h1>
          </div>
        </div>
      </div>

      <main className="p-6 sm:p-8 max-w-6xl mx-auto w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Category Navigation (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-3xl p-4 border border-misty/30 card-shadow space-y-1.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-left transition ${
                    isActive
                      ? 'bg-midnight text-vanilla shadow-sm'
                      : 'text-midnight-muted hover:text-midnight hover:bg-vanilla/60'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-blush' : 'text-midnight-muted'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Panel (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow">
            <form onSubmit={handleSave} className="space-y-6 text-xs text-midnight">
              {/* Category 1: Booking Preferences */}
              {activeCategory === 'booking' && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold font-display text-midnight pb-2 border-b border-misty/20">
                    Client Booking Preferences
                  </h3>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-vanilla/40 border border-misty/30">
                    <div>
                      <p className="font-bold text-midnight">Auto-Confirm Booking Requests</p>
                      <p className="text-midnight-muted text-[11px]">Automatically confirm and send Google Meet link upon payment</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoConfirmBookings}
                      onChange={(e) => setSettings({ ...settings, autoConfirmBookings: e.target.checked })}
                      className="w-4 h-4 rounded text-rosewood focus:ring-rosewood"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-midnight mb-1">Minimum Advance Notice Required</label>
                    <p className="text-midnight-muted text-[11px] mb-2">Prevent last-minute surprise bookings</p>
                    <select
                      value={settings.advanceNoticeHours}
                      onChange={(e) => setSettings({ ...settings, advanceNoticeHours: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 bg-white focus:outline-none focus:border-rosewood"
                    >
                      <option value={2}>2 hours prior</option>
                      <option value={6}>6 hours prior</option>
                      <option value={12}>12 hours prior (Recommended)</option>
                      <option value={24}>24 hours prior</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-midnight mb-1">Cancellation Policy Window</label>
                    <p className="text-midnight-muted text-[11px] mb-2">Full fee retained if client cancels within this threshold</p>
                    <select
                      value={settings.cancellationPolicyHours}
                      onChange={(e) => setSettings({ ...settings, cancellationPolicyHours: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 bg-white focus:outline-none focus:border-rosewood"
                    >
                      <option value={12}>12 hours before session</option>
                      <option value={24}>24 hours before session (Standard Indian Clinic Policy)</option>
                      <option value={48}>48 hours before session</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Category 2: Notifications */}
              {activeCategory === 'notifications' && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold font-display text-midnight pb-2 border-b border-misty/20">
                    Automated Client Notifications
                  </h3>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-vanilla/40 border border-misty/30">
                    <div>
                      <p className="font-bold text-midnight">WhatsApp 24-Hour & 1-Hour Reminders</p>
                      <p className="text-midnight-muted text-[11px]">Reduces no-shows by 85% via automated WhatsApp business message</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.whatsappReminders}
                      onChange={(e) => setSettings({ ...settings, whatsappReminders: e.target.checked })}
                      className="w-4 h-4 rounded text-rosewood focus:ring-rosewood"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-vanilla/40 border border-misty/30">
                    <div>
                      <p className="font-bold text-midnight">Automatic GST Invoice Delivery via Email</p>
                      <p className="text-midnight-muted text-[11px]">Email PDF receipts to clients immediately after checkout</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailInvoices}
                      onChange={(e) => setSettings({ ...settings, emailInvoices: e.target.checked })}
                      className="w-4 h-4 rounded text-rosewood focus:ring-rosewood"
                    />
                  </div>
                </div>
              )}

              {/* Category 3: Payments */}
              {activeCategory === 'payments' && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold font-display text-midnight pb-2 border-b border-misty/20">
                    Gateway & UPI Settlements
                  </h3>

                  <div>
                    <label className="block font-bold text-midnight mb-1">Razorpay Key ID (Live / Test)</label>
                    <input
                      type="text"
                      value={settings.razorpayKey}
                      onChange={(e) => setSettings({ ...settings, razorpayKey: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 bg-white font-mono focus:outline-none focus:border-rosewood"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-midnight mb-1">Practice UPI VPA</label>
                    <input
                      type="text"
                      value={settings.upiId}
                      onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 bg-white font-mono focus:outline-none focus:border-rosewood"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-midnight mb-1">GSTIN Number</label>
                      <input
                        type="text"
                        value={settings.gstNumber}
                        onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 bg-white font-mono focus:outline-none focus:border-rosewood"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Category 4: Security */}
              {activeCategory === 'security' && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold font-display text-midnight pb-2 border-b border-misty/20">
                    Account & Access Security
                  </h3>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-vanilla/40 border border-misty/30">
                    <div>
                      <p className="font-bold text-midnight">Two-Factor Authentication (OTP on Login)</p>
                      <p className="text-midnight-muted text-[11px]">Recommended for clinical health record protection</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                      className="w-4 h-4 rounded text-rosewood focus:ring-rosewood"
                    />
                  </div>
                </div>
              )}

              {/* Category 5: Privacy */}
              {activeCategory === 'privacy' && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold font-display text-midnight pb-2 border-b border-misty/20">
                    DPDP & Clinical Compliance
                  </h3>

                  <div className="p-4 rounded-2xl bg-sage-light/60 border border-sage/40 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-sage-dark flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-midnight">Client Data Privacy Sandbox Enabled</h4>
                      <p className="text-midnight-muted text-[11px] mt-0.5">
                        Private notes are encrypted and isolated from client-facing serialization layers. Only notes explicitly tagged as Shared are ever sent to client endpoints.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-misty/20">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rosewood text-white font-semibold text-xs hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20"
                >
                  <Save size={14} />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
