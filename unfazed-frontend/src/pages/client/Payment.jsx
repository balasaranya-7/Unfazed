import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  QrCode,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Loader2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR, formatTime } from '../../utils/formatters';

export const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { therapist, addAppointment, addTransaction } = useData();
  const { currentClient } = useAuth();

  // Booking details passed from BookingPage
  const bookingState = location.state || {
    service: therapist.services[0],
    date: '2026-09-12',
    time: '11:00',
    mode: 'Video Meet'
  };

  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, netbanking
  const [upiVpa, setUpiVpa] = useState('ananya.sen@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  const basePrice = bookingState.service.price || 2200;
  const gst = Math.round(basePrice * 0.18);
  const total = basePrice + gst;

  const handlePayNow = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate 1.5s secure payment gateway checkout
    setTimeout(() => {
      // 1. Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // 2. Add appointment to state
      const newApt = addAppointment({
        clientId: currentClient.id,
        clientName: currentClient.name,
        clientAvatar: currentClient.avatar,
        serviceTitle: bookingState.service.title,
        serviceId: bookingState.service.id,
        date: bookingState.date,
        startTime: bookingState.time,
        endTime: '11:50',
        duration: bookingState.service.duration,
        mode: bookingState.mode,
        meetLink: 'https://meet.google.com/unf-session-live',
        fee: total,
        paymentStatus: 'Paid'
      });

      // 3. Log transaction
      addTransaction({
        clientId: currentClient.id,
        clientName: currentClient.name,
        packageTitle: bookingState.service.title,
        amount: basePrice,
        taxGst: gst,
        totalAmount: total,
        method: paymentMethod === 'upi' ? `UPI (${upiVpa})` : 'Razorpay Credit Card'
      });

      setIsProcessing(false);

      // 4. Navigate to confirmation
      navigate('/client/confirmation', {
        state: {
          appointment: newApt,
          totalAmount: total
        }
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-vanilla text-midnight flex flex-col font-sans pb-16">
      <nav className="glass-nav sticky top-0 z-30 px-6 sm:px-12 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-midnight-muted hover:text-midnight"
        >
          <ChevronLeft size={16} />
          <span>Back to Booking</span>
        </button>
        <span className="text-xs text-sage-dark font-bold flex items-center gap-1">
          <ShieldCheck size={14} /> 256-Bit Encrypted Checkout
        </span>
      </nav>

      <main className="max-w-4xl mx-auto w-full p-6 sm:p-10 space-y-8 flex-1">
        <div className="text-center max-w-md mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Secure Session Checkout</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-midnight mt-1">
            Complete Your Booking Payment
          </h2>
          <p className="text-xs text-midnight-muted mt-1">
            Pay safely via Razorpay UPI or Card. Instant appointment confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Payment Method Selector (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow space-y-6">
            <h3 className="text-base font-bold font-display text-midnight">Select Payment Method</h3>

            {/* Methods Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'upi'
                    ? 'bg-rosewood text-white border-rosewood shadow-sm'
                    : 'bg-vanilla/40 text-midnight border-misty/30 hover:bg-vanilla'
                }`}
              >
                <Smartphone size={18} />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'card'
                    ? 'bg-rosewood text-white border-rosewood shadow-sm'
                    : 'bg-vanilla/40 text-midnight border-misty/30 hover:bg-vanilla'
                }`}
              >
                <CreditCard size={18} />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'netbanking'
                    ? 'bg-rosewood text-white border-rosewood shadow-sm'
                    : 'bg-vanilla/40 text-midnight border-misty/30 hover:bg-vanilla'
                }`}
              >
                <QrCode size={18} />
                <span>NetBanking</span>
              </button>
            </div>

            {/* UPI View */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-midnight mb-1">Enter UPI VPA / ID</label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full px-4 py-3 rounded-2xl border border-misty/40 text-xs font-mono font-bold focus:outline-none focus:border-rosewood"
                  />
                  <p className="text-[11px] text-midnight-muted mt-1">Google Pay, PhonePe, Paytm, CRED or any BHIM UPI app.</p>
                </div>

                <div className="p-4 rounded-2xl bg-vanilla/50 border border-misty/30 flex items-center gap-3">
                  <QrCode size={28} className="text-rosewood flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-midnight block">Instant QR Checkout</span>
                    <span className="text-midnight-muted text-[11px]">Scan with any camera app to approve payment request.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Card View */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block font-bold text-midnight mb-1">Card Number</label>
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 4242"
                    className="w-full px-4 py-2.5 rounded-xl border border-misty/40 font-mono focus:outline-none focus:border-rosewood"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-midnight mb-1">Expiry</label>
                    <input
                      type="text"
                      defaultValue="08/28"
                      className="w-full px-4 py-2.5 rounded-xl border border-misty/40 font-mono focus:outline-none focus:border-rosewood"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-midnight mb-1">CVV</label>
                    <input
                      type="password"
                      defaultValue="•••"
                      className="w-full px-4 py-2.5 rounded-xl border border-misty/40 font-mono focus:outline-none focus:border-rosewood"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NetBanking View */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-3 pt-2 text-xs">
                <label className="block font-bold text-midnight mb-1">Select Bank</label>
                <select className="w-full px-4 py-3 rounded-2xl border border-misty/40 bg-white font-semibold focus:outline-none focus:border-rosewood">
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-rosewood hover:bg-rosewood-hover disabled:opacity-60 text-white font-bold text-sm transition shadow-lg shadow-rosewood/25 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Pay {formatINR(total)} (Demo)</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Order Summary Breakdown (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-misty/30 card-shadow space-y-4">
            <h3 className="text-base font-bold font-display text-midnight pb-2 border-b border-misty/20">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-midnight">
              <div className="flex justify-between">
                <span className="text-midnight-muted">Therapist:</span>
                <span className="font-bold">{therapist.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-midnight-muted">Service:</span>
                <span className="font-bold">{bookingState.service.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-midnight-muted">Date:</span>
                <span className="font-bold">{bookingState.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-midnight-muted">Time:</span>
                <span className="font-bold">{formatTime(bookingState.time)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-midnight-muted">Modality:</span>
                <span className="font-bold">{bookingState.mode}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-misty/20 space-y-1.5 text-xs">
              <div className="flex justify-between text-midnight-muted">
                <span>Base Session Fee:</span>
                <span>{formatINR(basePrice)}</span>
              </div>
              <div className="flex justify-between text-midnight-muted">
                <span>GST (18% Healthcare):</span>
                <span>{formatINR(gst)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-midnight pt-2 border-t border-misty/20">
                <span>Total Amount Due:</span>
                <span className="text-rosewood">{formatINR(total)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-vanilla/40 border border-misty/20 text-[11px] text-midnight-muted leading-relaxed">
              Upon successful payment, an automated calendar invite and Google Meet link will be issued to your email.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
