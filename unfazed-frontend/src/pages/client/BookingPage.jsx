import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Globe,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatINR, formatTime } from '../../utils/formatters';

export const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { therapist, appointments } = useData();

  // Wizard Step: 1: Service, 2: Date & Slot, 3: Details & Confirmation
  const [step, setStep] = useState(1);

  // Booking selections
  const defaultServiceId = location.state?.serviceId || therapist.services[0]?.id;
  const [selectedService, setSelectedService] = useState(
    therapist.services.find(s => s.id === defaultServiceId) || therapist.services[0]
  );
  const [selectedDate, setSelectedDate] = useState('2026-09-12');
  const [selectedSlot, setSelectedSlot] = useState('11:00');
  const [sessionModality, setSessionModality] = useState('Video Meet');

  // Available slots for the day (with booked ones marked disabled)
  const availableSlots = [
    { time: '10:00', available: true },
    { time: '11:00', available: true },
    { time: '12:00', available: false }, // Already booked
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: false }, // Booked
    { time: '17:00', available: true },
    { time: '18:00', available: true },
  ];

  const handleProceedToPayment = () => {
    navigate('/client/payment', {
      state: {
        service: selectedService,
        date: selectedDate,
        time: selectedSlot,
        mode: sessionModality
      }
    });
  };

  return (
    <div className="min-h-screen bg-vanilla text-midnight flex flex-col font-sans pb-16">
      {/* Top Navbar */}
      <nav className="glass-nav sticky top-0 z-30 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/therapist/${therapist.slug}`)}
            className="flex items-center gap-2 text-xs font-bold text-midnight-muted hover:text-midnight transition"
          >
            <ChevronLeft size={16} />
            <span>Back to Profile</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-rosewood">Step {step} of 3</span>
          <span className="text-xs text-midnight-muted">
            {step === 1 ? 'Select Session' : step === 2 ? 'Date & Time' : 'Review & Confirm'}
          </span>
        </div>
      </nav>

      {/* Main Booking Container */}
      <main className="max-w-4xl mx-auto w-full p-6 sm:p-10 space-y-8 flex-1">
        {/* Progress Bar */}
        <div className="w-full bg-misty/20 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="bg-rosewood h-full rounded-full"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Step 1</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-midnight mt-1">
                Select Your Consultation Service
              </h2>
              <p className="text-xs text-midnight-muted mt-1">
                Choose the session duration and format tailored to your current goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {therapist.services.map((service) => {
                const isSelected = selectedService.id === service.id;

                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-6 rounded-3xl border cursor-pointer transition relative card-shadow ${
                      isSelected
                        ? 'bg-white border-rosewood ring-2 ring-rosewood/30 shadow-lg'
                        : 'bg-white/80 border-misty/30 hover:border-blush'
                    }`}
                  >
                    {service.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-blush-light text-rosewood border border-blush/40 mb-2 inline-block">
                        {service.badge}
                      </span>
                    )}

                    <h3 className="text-lg font-bold font-display text-midnight">{service.title}</h3>
                    <p className="text-xs text-midnight-muted mt-1 leading-relaxed">{service.description}</p>

                    <div className="mt-4 pt-4 border-t border-misty/20 flex items-center justify-between">
                      <span className="text-2xl font-extrabold font-display text-midnight">
                        {formatINR(service.price)}
                      </span>
                      <span className="text-xs font-semibold text-rosewood flex items-center gap-1">
                        <Clock size={13} /> {service.duration} Mins
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-2xl bg-rosewood text-white font-bold text-xs hover:bg-rosewood-hover transition flex items-center gap-2 shadow-lg shadow-rosewood/20"
              >
                <span>Select Date & Time</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Date & Available Slot Selection */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Step 2</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-midnight mt-1">
                Choose Date & Time Slot
              </h2>
              <p className="text-xs text-midnight-muted mt-1 flex items-center justify-center gap-1">
                <Globe size={13} className="text-sage-dark" /> Showing slots in your local timezone: <strong>Asia/Kolkata (IST)</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left: Date Picker & Modality (6 cols) */}
              <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-misty/30 card-shadow space-y-4">
                <div>
                  <label className="block text-xs font-bold text-midnight mb-1">Select Consultation Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min="2026-09-10"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-misty/40 text-sm font-semibold text-midnight focus:outline-none focus:border-rosewood"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-midnight mb-2">Session Format / Modality</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSessionModality('Video Meet')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                        sessionModality === 'Video Meet'
                          ? 'bg-rosewood text-white border-rosewood'
                          : 'bg-vanilla/40 text-midnight border-misty/30 hover:bg-vanilla'
                      }`}
                    >
                      <Video size={16} />
                      <span>Online Video</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSessionModality('In-Person Clinic')}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                        sessionModality === 'In-Person Clinic'
                          ? 'bg-rosewood text-white border-rosewood'
                          : 'bg-vanilla/40 text-midnight border-misty/30 hover:bg-vanilla'
                      }`}
                    >
                      <MapPin size={16} />
                      <span>Clinic (Indiranagar)</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-vanilla/50 border border-misty/20 text-xs text-midnight-muted">
                  <span className="font-bold text-midnight block mb-0.5">15-minute clinical buffer</span>
                  Slots are spaced with built-in reflection buffers to ensure relaxed, unhurried care.
                </div>
              </div>

              {/* Right: Available Slots Grid (6 cols) */}
              <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-misty/30 card-shadow space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-misty/20">
                  <span className="text-xs font-bold text-midnight">
                    Available Slots for {selectedDate}
                  </span>
                  <span className="text-[10px] text-midnight-muted font-semibold">
                    {availableSlots.filter(s => s.available).length} slots open
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;

                    if (!slot.available) {
                      return (
                        <div
                          key={slot.time}
                          className="p-3 rounded-2xl border border-misty/20 bg-vanilla-dark/30 text-midnight-muted/40 text-xs font-semibold text-center cursor-not-allowed line-through"
                        >
                          {formatTime(slot.time)}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`p-3 rounded-2xl border text-xs font-bold text-center transition ${
                          isSelected
                            ? 'bg-rosewood text-white border-rosewood shadow-md shadow-rosewood/20 scale-102'
                            : 'bg-white border-misty/40 text-midnight hover:border-rosewood/50 hover:bg-vanilla/40'
                        }`}
                      >
                        {formatTime(slot.time)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3.5 rounded-2xl border border-misty/40 text-midnight font-bold text-xs hover:bg-vanilla"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3.5 rounded-2xl bg-rosewood text-white font-bold text-xs hover:bg-rosewood-hover transition flex items-center gap-2 shadow-lg shadow-rosewood/20"
              >
                <span>Review Booking Summary</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Review & Summary */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-xl mx-auto"
          >
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Step 3</span>
              <h2 className="text-2xl font-bold font-display text-midnight mt-1">
                Confirm Consultation Details
              </h2>
              <p className="text-xs text-midnight-muted mt-1">
                Review your session summary before proceeding to payment.
              </p>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-3xl p-7 border border-misty/30 card-shadow space-y-5">
              <div className="flex items-center gap-3.5 pb-4 border-b border-misty/20">
                <img
                  src={therapist.avatar}
                  alt={therapist.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blush"
                />
                <div>
                  <h4 className="text-sm font-bold text-midnight">{therapist.name}</h4>
                  <p className="text-xs text-midnight-muted">{therapist.title}</p>
                  <span className="text-[10px] text-sage-dark font-semibold">RCI Reg #A48921</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-midnight">
                <div className="flex justify-between">
                  <span className="text-midnight-muted">Service:</span>
                  <span className="font-bold">{selectedService.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-midnight-muted">Date:</span>
                  <span className="font-bold">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-midnight-muted">Time Slot:</span>
                  <span className="font-bold">{formatTime(selectedSlot)} (50 mins)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-midnight-muted">Modality:</span>
                  <span className="font-bold">{sessionModality}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-midnight pt-3 border-t border-misty/20">
                  <span>Session Fee:</span>
                  <span className="text-rosewood">{formatINR(selectedService.price)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sage-light/50 border border-sage/40 text-[11px] text-midnight leading-relaxed">
                <span className="font-bold text-sage-dark flex items-center gap-1 mb-0.5">
                  <ShieldCheck size={14} /> 24-Hour Cancellation Policy
                </span>
                Reschedule for free up to 24 hours prior to appointment time directly from your client portal.
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3.5 rounded-2xl border border-misty/40 text-midnight font-bold text-xs hover:bg-vanilla"
              >
                Back
              </button>
              <button
                onClick={handleProceedToPayment}
                className="px-8 py-3.5 rounded-2xl bg-rosewood text-white font-bold text-xs hover:bg-rosewood-hover transition flex items-center gap-2 shadow-lg shadow-rosewood/20"
              >
                <span>Proceed to Payment</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BookingPage;
