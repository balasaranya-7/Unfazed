import React, { useState } from 'react';
import Drawer from '../common/Drawer';
import { useData } from '../../context/DataContext';
import { formatINR, formatTime, getStatusBadgeColor } from '../../utils/formatters';
import {
  User,
  Calendar,
  FileText,
  CreditCard,
  Lock,
  Share2,
  Clock,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Plus,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

import axiosInstance from '../../api/axiosInstance';

import NewAppointmentModal from '../scheduling/NewAppointmentModal';
import QuickNoteModal from '../notes/QuickNoteModal';
import RecordPaymentModal from '../payments/RecordPaymentModal';

export const ClientProfileDrawer = ({
  client,
  isOpen,
  onClose
}) => {
  const {
    appointments,
    notes,
    transactions,
    toggleNoteShared
  } = useData();

  const [activeTab, setActiveTab] = useState('overview');

  // Modals
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Password modal
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  if (!client) return null;

  // =========================================================
  // FILTERED RELATIONS
  // =========================================================

  const clientAppointments = appointments.filter(
    (a) => a.clientId === client.id
  );

  const clientNotes = notes.filter(
    (n) => n.clientId === client.id
  );

  const clientSharedNotes = clientNotes.filter(
    (n) => n.isShared
  );

  const clientTransactions = transactions.filter(
    (t) => t.clientId === client.id
  );

  // =========================================================
  // PASSWORD HANDLER
  // =========================================================

  const openPasswordModal = () => {
    setPassword('');
    setConfirmPassword('');
    setPasswordMessage('');
    setPasswordError('');
    setPasswordOpen(true);
  };

  const closePasswordModal = () => {
    if (passwordLoading) return;

    setPasswordOpen(false);
    setPassword('');
    setConfirmPassword('');
    setPasswordMessage('');
    setPasswordError('');
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();

    setPasswordMessage('');
    setPasswordError('');

    if (!password || !confirmPassword) {
      setPasswordError(
        'Please enter and confirm the password.'
      );
      return;
    }

    if (password.length < 6) {
      setPasswordError(
        'Password must be at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(
        'Passwords do not match.'
      );
      return;
    }

    if (!client.id) {
      setPasswordError(
        'Client ID is missing.'
      );
      return;
    }

    setPasswordLoading(true);

    try {
      await axiosInstance.put(
        `/clients/${client.id}/password`,
        {
          password
        }
      );

      setPasswordMessage(
        'Client password set successfully.'
      );

      setPassword('');

      setConfirmPassword('');

    } catch (error) {
      console.error(
        'Set client password error:',
        error
      );

      setPasswordError(
        error?.response?.data?.message ||
        'Failed to set client password.'
      );

    } finally {
      setPasswordLoading(false);
    }
  };

  // =========================================================
  // TABS
  // =========================================================

  const tabs = [
    {
      id: 'overview',
      label: 'Overview'
    },
    {
      id: 'sessions',
      label: `Sessions (${clientAppointments.length})`
    },
    {
      id: 'intake',
      label: 'Intake & Consent'
    },
    {
      id: 'payments',
      label: `Payments (${clientTransactions.length})`
    },
    {
      id: 'notes',
      label: `Clinical Notes (${clientNotes.length})`
    },
    {
      id: 'shared',
      label: `Shared (${clientSharedNotes.length})`
    }
  ];

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={client.name}
        subtitle={`${client.age || 28} y/o • ${client.occupation || 'Professional'} • ${client.location || 'India'}`}
        width="max-w-3xl"
      >
        <div className="space-y-6">

          {/* =====================================================
              CLIENT HEADER CARD
          ===================================================== */}

          <div className="p-5 rounded-3xl bg-vanilla/60 border border-misty/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <img
                src={client.avatar}
                alt={client.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blush shadow-sm"
              />

              <div>

                <div className="flex items-center gap-2">

                  <h3 className="text-xl font-bold font-display text-midnight">
                    {client.name}
                  </h3>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeColor(client.status)}`}
                  >
                    {client.status}
                  </span>

                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-midnight-muted mt-1">

                  <span className="flex items-center gap-1">
                    <Mail size={13} />
                    {client.email}
                  </span>

                  <span className="flex items-center gap-1">
                    <Phone size={13} />
                    {client.phone}
                  </span>

                </div>

              </div>

            </div>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() => setScheduleOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-midnight text-vanilla text-xs font-semibold hover:bg-midnight-light transition flex items-center gap-1.5"
              >
                <Calendar size={13} />
                <span>Book</span>
              </button>

              <button
                onClick={() => setNoteOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white border border-misty/40 text-midnight text-xs font-semibold hover:bg-vanilla transition flex items-center gap-1.5"
              >
                <FileText
                  size={13}
                  className="text-rosewood"
                />
                <span>Add Note</span>
              </button>

              <button
                onClick={() => setPaymentOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-rosewood text-white text-xs font-semibold hover:bg-rosewood-hover transition flex items-center gap-1.5"
              >
                <CreditCard size={13} />
                <span>Payment</span>
              </button>

              <button
                onClick={openPasswordModal}
                className="px-3 py-1.5 rounded-xl bg-white border border-misty/40 text-midnight text-xs font-semibold hover:bg-vanilla transition flex items-center gap-1.5"
              >
                <KeyRound
                  size={13}
                  className="text-rosewood"
                />
                <span>Password</span>
              </button>

            </div>

          </div>


          {/* =====================================================
              NAVIGATION TABS
          ===================================================== */}

          <div className="flex items-center gap-1 border-b border-misty/20 overflow-x-auto pb-1">

            {tabs.map((tab) => (

              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-midnight text-vanilla shadow-sm'
                    : 'text-midnight-muted hover:text-midnight hover:bg-vanilla'
                }`}
              >
                {tab.label}
              </button>

            ))}

          </div>


          {/* =====================================================
              TAB 1 — OVERVIEW
          ===================================================== */}

          {activeTab === 'overview' && (

            <div className="space-y-5">

              {client.package && (

                <div className="p-4 rounded-2xl bg-white border border-blush/40 shadow-sm">

                  <div className="flex items-center justify-between mb-2">

                    <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                      Active Session Package
                    </span>

                    <span className="text-xs font-semibold text-midnight">
                      {client.package.used} / {client.package.total} Used
                    </span>

                  </div>

                  <h4 className="text-base font-bold text-midnight">
                    {client.package.title}
                  </h4>

                  <div className="w-full bg-vanilla rounded-full h-2.5 my-2.5 overflow-hidden">

                    <div
                      className="bg-rosewood h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(client.package.used / client.package.total) * 100}%`
                      }}
                    />

                  </div>

                  <p className="text-[11px] text-midnight-muted">
                    {client.package.remaining} sessions remaining • Valid until {client.package.expiryDate}
                  </p>

                </div>

              )}


              {/* Clinical Tags */}

              <div className="p-4 rounded-2xl bg-white border border-misty/30 shadow-sm">

                <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted block mb-2">
                  Clinical Focus Areas & Tags
                </span>

                <div className="flex flex-wrap gap-1.5">

                  {client.tags?.map((tag, i) => (

                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-blush-light text-rosewood font-medium text-xs border border-blush/50"
                    >
                      #{tag}
                    </span>

                  ))}

                </div>

              </div>


              {/* Key Practice Information */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">

                <div className="p-4 rounded-2xl bg-white border border-misty/30">

                  <span className="text-midnight-muted block mb-1">
                    First Joined Practice
                  </span>

                  <span className="font-bold text-midnight text-sm">
                    {client.joinedDate || '2026-06-12'}
                  </span>

                </div>


                <div className="p-4 rounded-2xl bg-white border border-misty/30">

                  <span className="text-midnight-muted block mb-1">
                    Total Consultations
                  </span>

                  <span className="font-bold text-midnight text-sm">
                    {client.totalSessions || clientAppointments.length} sessions completed
                  </span>

                </div>


                <div className="p-4 rounded-2xl bg-white border border-misty/30">

                  <span className="text-midnight-muted block mb-1">
                    Next Scheduled Session
                  </span>

                  <span className="font-bold text-rosewood text-sm">

                    {client.nextSession
                      ? new Date(client.nextSession).toLocaleString(
                          'en-IN',
                          {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          }
                        )
                      : 'No upcoming session'}

                  </span>

                </div>


                <div className="p-4 rounded-2xl bg-white border border-misty/30">

                  <span className="text-midnight-muted block mb-1">
                    Consent Agreement
                  </span>

                  <span className="font-bold text-sage-dark text-sm flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    Signed & Auditable
                  </span>

                </div>

              </div>

            </div>

          )}


          {/* =====================================================
              TAB 2 — SESSIONS
          ===================================================== */}

          {activeTab === 'sessions' && (

            <div className="space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold text-midnight-muted">
                  Appointment History
                </span>

                <button
                  onClick={() => setScheduleOpen(true)}
                  className="text-xs font-semibold text-rosewood hover:underline flex items-center gap-1"
                >
                  <Plus size={13} />
                  Book New Session
                </button>

              </div>


              {clientAppointments.length === 0 ? (

                <p className="text-xs text-midnight-muted py-6 text-center">
                  No sessions recorded yet.
                </p>

              ) : (

                clientAppointments.map((apt) => (

                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl bg-white border border-misty/30 flex items-center justify-between"
                  >

                    <div>

                      <div className="flex items-center gap-2">

                        <span className="text-xs font-bold text-midnight">
                          {apt.serviceTitle}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(apt.status)}`}
                        >
                          {apt.status}
                        </span>

                      </div>

                      <p className="text-[11px] text-midnight-muted mt-0.5 flex items-center gap-2">

                        <span>
                          {apt.date} at {formatTime(apt.startTime)}
                        </span>

                        <span>•</span>

                        <span>
                          {apt.mode}
                        </span>

                        <span>•</span>

                        <span>
                          ₹{apt.fee}
                        </span>

                      </p>

                    </div>

                  </div>

                ))

              )}

            </div>

          )}


          {/* =====================================================
              TAB 3 — INTAKE & CONSENT
          ===================================================== */}

          {activeTab === 'intake' && (

            <div className="space-y-4">

              <div className="p-5 rounded-2xl bg-white border border-misty/30 space-y-3">

                <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                  Presenting Clinical Concern
                </span>

                <p className="text-xs text-midnight leading-relaxed bg-vanilla/40 p-3.5 rounded-xl border border-misty/20">
                  {client.intakeSummary?.primaryConcern ||
                    'Patient registered through branded link.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">

                  <div>

                    <span className="text-midnight-muted block">
                      Medical / Medication History
                    </span>

                    <span className="font-semibold text-midnight">
                      {client.intakeSummary?.medicalHistory ||
                        'None'}
                    </span>

                  </div>

                  <div>

                    <span className="text-midnight-muted block">
                      Emergency Contact
                    </span>

                    <span className="font-semibold text-midnight">
                      {client.intakeSummary?.emergencyContact ||
                        'Family contact on file'}
                    </span>

                  </div>

                </div>

              </div>


              <div className="p-4 rounded-2xl bg-sage-light/60 border border-sage/40 flex items-start gap-3">

                <CheckCircle2
                  size={18}
                  className="text-sage-dark flex-shrink-0 mt-0.5"
                />

                <div className="text-xs">

                  <h5 className="font-bold text-midnight">
                    Telehealth & Practice Consent Executed
                  </h5>

                  <p className="text-midnight-muted mt-0.5">
                    Consent form digitally affirmed on{' '}
                    {client.consentDate
                      ? new Date(
                          client.consentDate
                        ).toLocaleDateString('en-IN')
                      : '2026-06-12'}.
                    Stored with IP & timestamp audit trail.
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* =====================================================
              TAB 4 — PAYMENTS
          ===================================================== */}

          {activeTab === 'payments' && (

            <div className="space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold text-midnight-muted">
                  Financial Transactions
                </span>

                <button
                  onClick={() => setPaymentOpen(true)}
                  className="text-xs font-semibold text-rosewood hover:underline flex items-center gap-1"
                >
                  <Plus size={13} />
                  Log Payment
                </button>

              </div>


              {clientTransactions.length === 0 ? (

                <p className="text-xs text-midnight-muted py-6 text-center">
                  No payment history found.
                </p>

              ) : (

                clientTransactions.map((tx) => (

                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-white border border-misty/30 flex items-center justify-between"
                  >

                    <div>

                      <div className="flex items-center gap-2">

                        <span className="text-xs font-bold font-mono text-midnight">
                          {tx.invoiceNumber}
                        </span>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sage-light text-sage-dark">
                          {tx.status}
                        </span>

                      </div>

                      <p className="text-xs text-midnight mt-0.5">
                        {tx.packageTitle}
                      </p>

                      <p className="text-[11px] text-midnight-muted">
                        {tx.date} • {tx.method}
                      </p>

                    </div>

                    <div className="text-right">

                      <span className="font-extrabold text-sm text-rosewood">
                        ₹{(tx.totalAmount || tx.amount).toLocaleString('en-IN')}
                      </span>

                      <span className="block text-[10px] text-midnight-muted">
                        Incl. 18% GST
                      </span>

                    </div>

                  </div>

                ))

              )}

            </div>

          )}


          {/* =====================================================
              TAB 5 — ALL CLINICAL NOTES
          ===================================================== */}

          {activeTab === 'notes' && (

            <div className="space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold text-midnight-muted">
                  All Notes (Private & Shared)
                </span>

                <button
                  onClick={() => setNoteOpen(true)}
                  className="text-xs font-semibold text-rosewood hover:underline flex items-center gap-1"
                >
                  <Plus size={13} />
                  Write Note
                </button>

              </div>


              {clientNotes.length === 0 ? (

                <p className="text-xs text-midnight-muted py-6 text-center">
                  No clinical notes recorded yet.
                </p>

              ) : (

                clientNotes.map((note) => (

                  <div
                    key={note.id}
                    className={`p-4 rounded-2xl border ${
                      note.isShared
                        ? 'bg-sage-light/30 border-sage/40'
                        : 'bg-white border-blush/40'
                    }`}
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <div className="flex items-center gap-2">

                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                              note.isShared
                                ? 'bg-sage-light text-sage-dark border border-sage/30'
                                : 'bg-blush-light text-rosewood border border-blush'
                            }`}
                          >

                            {note.isShared
                              ? <Share2 size={10} />
                              : <Lock size={10} />}

                            {note.isShared
                              ? 'Shared with Client'
                              : 'Private Therapist Note'}

                          </span>

                          <span className="text-[11px] text-midnight-muted">
                            {note.sessionDate}
                          </span>

                        </div>

                        <h4 className="text-sm font-bold text-midnight mt-1.5">
                          {note.title}
                        </h4>

                      </div>


                      <button
                        onClick={() =>
                          toggleNoteShared(note.id)
                        }
                        className="text-[11px] font-semibold text-rosewood hover:underline"
                        title="Change sharing status"
                      >
                        {note.isShared
                          ? 'Make Private'
                          : 'Share with Client'}
                      </button>

                    </div>


                    <div className="mt-2.5 text-xs text-midnight/90 whitespace-pre-line bg-vanilla/40 p-3 rounded-xl border border-misty/20">
                      {note.content?.text ||
                        note.content?.subjective ||
                        note.content?.data ||
                        'Clinical note details.'}
                    </div>

                  </div>

                ))

              )}

            </div>

          )}


          {/* =====================================================
              TAB 6 — SHARED NOTES
          ===================================================== */}

          {activeTab === 'shared' && (

            <div className="space-y-3">

              <div className="p-3.5 rounded-2xl bg-sage-light/50 border border-sage/40 text-xs text-midnight">

                <span className="font-bold flex items-center gap-1.5 text-sage-dark mb-1">

                  <Share2 size={14} />

                  Client Portal Visibility Mirror

                </span>

                These are the specific reflections, homework,
                and session anchors visible to{' '}

                <strong>
                  {client.name}
                </strong>

                {' '}inside their Client Portal.
                Private therapist observations are never exposed.

              </div>


              {clientSharedNotes.length === 0 ? (

                <p className="text-xs text-midnight-muted py-6 text-center">
                  No shared notes published yet.
                </p>

              ) : (

                clientSharedNotes.map((note) => (

                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-white border border-sage/40 shadow-sm space-y-2"
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-bold text-midnight">
                        {note.title}
                      </span>

                      <span className="text-[11px] text-midnight-muted">
                        {note.sessionDate}
                      </span>

                    </div>

                    <div className="text-xs text-midnight/90 whitespace-pre-line bg-sage-light/30 p-3 rounded-xl border border-sage/20">
                      {note.content?.text ||
                        'Shared takeaways.'}
                    </div>

                  </div>

                ))

              )}

            </div>

          )}

        </div>
      </Drawer>


      {/* =========================================================
          PASSWORD MODAL
      ========================================================= */}

      {passwordOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-midnight/40 backdrop-blur-sm p-4">

          <div className="w-full max-w-md bg-white rounded-3xl border border-misty/30 shadow-2xl p-6">

            <div className="flex items-start justify-between gap-4 mb-5">

              <div>

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-xl bg-blush-light flex items-center justify-center">
                    <KeyRound
                      size={18}
                      className="text-rosewood"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-midnight">
                    Client Portal Password
                  </h3>

                </div>

                <p className="text-xs text-midnight-muted mt-2">
                  Set a password for {client.name} to sign in to their Client Portal.
                </p>

              </div>

              <button
                onClick={closePasswordModal}
                className="text-midnight-muted hover:text-midnight text-lg"
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleSetPassword}
              className="space-y-4"
            >

              {/* Password */}

              <div>

                <label className="block text-xs font-bold text-midnight mb-1.5">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 pr-11 rounded-xl border border-misty/40 bg-vanilla/30 text-sm text-midnight outline-none focus:border-rosewood transition"
                    disabled={passwordLoading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-midnight-muted hover:text-midnight"
                  >
                    {showPassword
                      ? <EyeOff size={16} />
                      : <Eye size={16} />}
                  </button>

                </div>

              </div>


              {/* Confirm Password */}

              <div>

                <label className="block text-xs font-bold text-midnight mb-1.5">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm password"
                    className="w-full px-3.5 py-2.5 pr-11 rounded-xl border border-misty/40 bg-vanilla/30 text-sm text-midnight outline-none focus:border-rosewood transition"
                    disabled={passwordLoading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-midnight-muted hover:text-midnight"
                  >
                    {showConfirmPassword
                      ? <EyeOff size={16} />
                      : <Eye size={16} />}
                  </button>

                </div>

              </div>


              {/* Error */}

              {passwordError && (

                <div className="flex items-start gap-2 p-3 rounded-xl bg-blush-light border border-blush/50 text-xs text-rosewood">

                  <AlertCircle
                    size={15}
                    className="flex-shrink-0 mt-0.5"
                  />

                  <span>
                    {passwordError}
                  </span>

                </div>

              )}


              {/* Success */}

              {passwordMessage && (

                <div className="flex items-start gap-2 p-3 rounded-xl bg-sage-light/60 border border-sage/40 text-xs text-sage-dark">

                  <CheckCircle2
                    size={15}
                    className="flex-shrink-0 mt-0.5"
                  />

                  <span>
                    {passwordMessage}
                  </span>

                </div>

              )}


              <div className="flex justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={passwordLoading}
                  className="px-4 py-2 rounded-xl bg-white border border-misty/40 text-midnight text-xs font-semibold hover:bg-vanilla transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 rounded-xl bg-rosewood text-white text-xs font-semibold hover:bg-rosewood-hover transition disabled:opacity-50 flex items-center gap-2"
                >

                  <KeyRound size={14} />

                  {passwordLoading
                    ? 'Saving...'
                    : 'Set Password'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =========================================================
          ACTION MODALS
      ========================================================= */}

      <NewAppointmentModal
        isOpen={scheduleOpen}
        onClose={() =>
          setScheduleOpen(false)
        }
      />

      <QuickNoteModal
        isOpen={noteOpen}
        onClose={() =>
          setNoteOpen(false)
        }
        preselectedClientId={client.id}
      />

      <RecordPaymentModal
        isOpen={paymentOpen}
        onClose={() =>
          setPaymentOpen(false)
        }
      />

    </>
  );
};

export default ClientProfileDrawer;