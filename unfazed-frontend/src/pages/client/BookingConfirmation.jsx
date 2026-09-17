import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  HeartHandshake,
  Download,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatTime } from '../../utils/formatters';

export const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { therapist } = useData();

  const appointment = location.state?.appointment || {
    serviceTitle: 'Individual Psychotherapy',
    date: '2026-09-12',
    startTime: '11:00',
    endTime: '11:50',
    mode: 'Video Meet',
    meetLink: 'https://meet.google.com/unf-session-live'
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${appointment.serviceTitle} with ${therapist.name}`);
    const details = encodeURIComponent(`Telehealth therapy session. Room: ${appointment.meetLink || 'Unfazed'}`);
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
    window.open(gCalUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-vanilla text-midnight flex flex-col font-sans pb-16 items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-blush/40 card-shadow shadow-2xl text-center space-y-6"
      >
        {/* Success Icon */}
        <div className="relative w-20 h-20 rounded-3xl bg-sage-light border-2 border-sage text-sage-dark flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={42} />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-2 -right-2 p-1.5 bg-rosewood rounded-full text-white"
          >
            <Sparkles size={14} />
          </motion.div>
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-rosewood">
            Payment & Booking Confirmed
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-midnight mt-1">
            Your Session is Scheduled!
          </h2>
          <p className="text-xs text-midnight-muted mt-1 leading-relaxed max-w-md mx-auto">
            A calendar invitation and WhatsApp confirmation have been dispatched. We look forward to holding space with you.
          </p>
        </div>

        {/* Appointment Card */}
        <div className="p-6 rounded-2xl bg-vanilla/50 border border-misty/30 text-left space-y-3.5 text-xs text-midnight">
          <div className="flex items-center gap-3 pb-3 border-b border-misty/20">
            <img
              src={therapist.avatar}
              alt={therapist.name}
              className="w-12 h-12 rounded-xl object-cover border border-blush"
            />
            <div>
              <h4 className="text-sm font-bold text-midnight">{therapist.name}</h4>
              <p className="text-xs text-midnight-muted">{therapist.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-midnight-muted block mb-0.5">Session:</span>
              <span className="font-bold">{appointment.serviceTitle}</span>
            </div>
            <div>
              <span className="text-midnight-muted block mb-0.5">Date:</span>
              <span className="font-bold">{appointment.date}</span>
            </div>
            <div>
              <span className="text-midnight-muted block mb-0.5">Time:</span>
              <span className="font-bold">{formatTime(appointment.startTime)}</span>
            </div>
            <div>
              <span className="text-midnight-muted block mb-0.5">Format:</span>
              <span className="font-bold">{appointment.mode}</span>
            </div>
          </div>

          {appointment.mode === 'Video Meet' && appointment.meetLink && (
            <div className="pt-2 border-t border-misty/20 flex items-center justify-between">
              <span className="text-midnight-muted">Encrypted Meet Room:</span>
              <a
                href={appointment.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-rosewood font-bold hover:underline flex items-center gap-1"
              >
                <span>join-call</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => navigate('/client/portal')}
            className="w-full py-4 rounded-2xl bg-rosewood hover:bg-rosewood-hover text-white font-bold text-sm transition shadow-lg shadow-rosewood/20 flex items-center justify-center gap-2"
          >
            <span>Enter My Client Sanctuary</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={handleAddToCalendar}
            className="w-full py-3 rounded-2xl bg-vanilla hover:bg-vanilla-dark/50 text-midnight font-semibold text-xs transition flex items-center justify-center gap-2 border border-misty/30"
          >
            <Calendar size={15} />
            <span>Add to Google Calendar</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;
