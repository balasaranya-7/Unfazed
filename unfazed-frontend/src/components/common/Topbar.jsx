import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, FileText, CreditCard, Bell, Sparkles, UserPlus } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Topbar = ({ onOpenAddClient, onOpenSchedule, onOpenAddNote, onOpenRecordPayment }) => {
  const navigate = useNavigate();
  const { therapist } = useData();

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="sticky top-0 z-10 bg-vanilla/90 backdrop-blur-md border-b border-misty/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left: Date & Status */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-midnight-muted">
            {todayFormatted}
          </h2>
          <span className="w-1.5 h-1.5 rounded-full bg-sage" />
          <span className="text-xs font-medium text-sage-dark flex items-center gap-1">
            Clinical Practice Active
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-display text-midnight tracking-tight">
          Welcome back, {therapist.name}
        </h1>
      </div>

      {/* Right: Quick Action Buttons & Notifications */}
      <div className="flex items-center flex-wrap gap-2.5">
        {onOpenAddClient ? (
          <button
            onClick={onOpenAddClient}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-misty/40 text-xs font-semibold text-midnight hover:bg-vanilla-light hover:border-rosewood/40 transition shadow-sm"
          >
            <UserPlus size={14} className="text-rosewood" />
            <span>Add Client</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/therapist/clients')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-misty/40 text-xs font-semibold text-midnight hover:bg-vanilla-light hover:border-rosewood/40 transition shadow-sm"
          >
            <UserPlus size={14} className="text-rosewood" />
            <span>Add Client</span>
          </button>
        )}

        {onOpenSchedule ? (
          <button
            onClick={onOpenSchedule}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-misty/40 text-xs font-semibold text-midnight hover:bg-vanilla-light hover:border-rosewood/40 transition shadow-sm"
          >
            <Calendar size={14} className="text-rosewood" />
            <span>Schedule</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/therapist/schedule')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-misty/40 text-xs font-semibold text-midnight hover:bg-vanilla-light hover:border-rosewood/40 transition shadow-sm"
          >
            <Calendar size={14} className="text-rosewood" />
            <span>Schedule</span>
          </button>
        )}

        {onOpenAddNote ? (
          <button
            onClick={onOpenAddNote}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-misty/40 text-xs font-semibold text-midnight hover:bg-vanilla-light hover:border-rosewood/40 transition shadow-sm"
          >
            <FileText size={14} className="text-rosewood" />
            <span>Add Note</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/therapist/notes')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-misty/40 text-xs font-semibold text-midnight hover:bg-vanilla-light hover:border-rosewood/40 transition shadow-sm"
          >
            <FileText size={14} className="text-rosewood" />
            <span>Add Note</span>
          </button>
        )}

        {onOpenRecordPayment ? (
          <button
            onClick={onOpenRecordPayment}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rosewood text-white text-xs font-semibold hover:bg-rosewood-hover transition shadow-sm shadow-rosewood/20"
          >
            <CreditCard size={14} />
            <span>Record Payment</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/therapist/payments')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rosewood text-white text-xs font-semibold hover:bg-rosewood-hover transition shadow-sm shadow-rosewood/20"
          >
            <CreditCard size={14} />
            <span>Record Payment</span>
          </button>
        )}

        <div className="h-6 w-px bg-misty/30 mx-1 hidden sm:block" />

        {/* Notification Bell */}
        <button
          onClick={() => navigate('/therapist/chat')}
          className="relative p-2 rounded-xl bg-white border border-misty/40 text-midnight-muted hover:text-midnight transition shadow-sm"
          title="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rosewood animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rosewood" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
