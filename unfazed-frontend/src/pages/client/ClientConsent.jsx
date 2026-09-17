import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, AlertCircle, FileCheck, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const ClientConsent = () => {
  const navigate = useNavigate();
  const { currentClient } = useAuth();
  const { therapist, showToast } = useData();

  const [agreed, setAgreed] = useState(false);
  const [signatureName, setSignatureName] = useState(currentClient.name || '');
  const [submitted, setSubmitted] = useState(false);

  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed || !signatureName) return;

    setSubmitted(true);
    showToast('Informed consent digitally executed and archived');

    setTimeout(() => {
      navigate('/client/portal');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-vanilla text-midnight flex flex-col font-sans pb-16">
      <nav className="glass-nav sticky top-0 z-30 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blush-light text-rosewood flex items-center justify-center font-bold text-sm">
            U
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-midnight">Informed Clinical Consent</span>
        </div>
        <span className="text-xs text-sage-dark font-bold flex items-center gap-1">
          <Lock size={13} /> Encrypted Record
        </span>
      </nav>

      <main className="max-w-2xl mx-auto w-full p-6 sm:p-10 space-y-6 flex-1">
        {submitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-10 border border-sage/40 card-shadow text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-sage-light text-sage-dark flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-bold font-display text-midnight">Consent Agreement Confirmed</h2>
            <p className="text-xs text-midnight-muted max-w-md mx-auto leading-relaxed">
              Your digital signature for therapy with <strong>{therapist.name}</strong> has been legally recorded with auditable timestamp. Redirecting to your personal sanctuary...
            </p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-misty/30 card-shadow space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Patient Rights & Agreements</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-midnight mt-1">
                Informed Consent for Psychotherapy
              </h2>
              <p className="text-xs text-midnight-muted mt-1">
                Please carefully read through the clinical protocols, confidentiality boundaries, and practice terms.
              </p>
            </div>

            {/* Scrollable Terms Body */}
            <div className="max-h-72 overflow-y-auto p-4 rounded-2xl bg-vanilla/40 border border-misty/30 space-y-4 text-xs text-midnight/90 leading-relaxed">
              <div className="space-y-1">
                <h4 className="font-bold text-midnight">1. Confidentiality & Privacy Limits</h4>
                <p>
                  All discussions, assessments, and clinical documentation within therapy sessions are strictly confidential between you and {therapist.name}. Under Indian mental healthcare law, confidentiality may only be waived if there is an explicit threat of harm to yourself or others, or under valid judicial subpoena.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-midnight">2. Telehealth & Online Security</h4>
                <p>
                  Online sessions are conducted over end-to-end encrypted video channels. You are requested to attend from a quiet, private space where you cannot be overheard or interrupted.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-midnight">3. 24-Hour Rescheduling & Cancellation Policy</h4>
                <p>
                  We understand unexpected emergencies happen. You may reschedule or cancel any session free of charge up to 24 hours prior to the scheduled start time. Cancellations with less than 24 hours notice will be charged at the full session rate.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-midnight">4. Crisis Emergency Protocol</h4>
                <p>
                  Unfazed and private telehealth practices do not provide 24/7 psychiatric emergency crisis intervention. In case of acute crisis, please call Vandrevala Foundation (+91 9999 666 555), Tele-MANAS (14416), or visit the nearest hospital emergency room.
                </p>
              </div>
            </div>

            {/* Signature Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blush-light/30 border border-blush/40">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded text-rosewood focus:ring-rosewood mt-0.5"
                />
                <label htmlFor="consentCheckbox" className="text-xs text-midnight font-medium cursor-pointer leading-normal">
                  I have read, understood, and voluntarily agree to the informed consent terms, confidentiality guidelines, and cancellation policies outlined above.
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-midnight mb-1">
                  Digital Electronic Signature (Full Legal Name) *
                </label>
                <input
                  type="text"
                  required
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-misty/50 text-sm font-semibold focus:outline-none focus:border-rosewood"
                />
                <span className="text-[10px] text-midnight-muted block mt-1">
                  Audit Timestamp: {timestamp}
                </span>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={!agreed || !signatureName}
                  className="px-8 py-3.5 rounded-2xl bg-rosewood text-white font-bold text-xs hover:bg-rosewood-hover disabled:opacity-40 transition flex items-center gap-2 shadow-lg shadow-rosewood/20"
                >
                  <span>Affirm & Execute Consent</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientConsent;
