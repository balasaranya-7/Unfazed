import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  ChevronRight,
  ChevronLeft,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const ClientIntake = () => {
  const navigate = useNavigate();
  const { currentClient } = useAuth();
  const { showToast } = useData();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: currentClient.name || '',
    email: currentClient.email || '',
    phone: currentClient.phone || '',
    age: currentClient.age || '28',
    gender: currentClient.gender || 'Female',
    occupation: currentClient.occupation || '',
    primaryConcern: currentClient.intakeSummary?.primaryConcern || '',
    symptomDuration: '6-12 months',
    goals: 'Learn emotion regulation techniques and overcome workplace panic spikes.',
    medicalHistory: 'None reported.',
    emergencyContactName: 'Dev Sen',
    emergencyContactPhone: '+91 98201 98765',
    previousTherapy: 'Yes, had short-term counselling in 2024.'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Intake information saved securely');
    navigate('/client/consent');
  };

  return (
    <div className="min-h-screen bg-vanilla text-midnight flex flex-col font-sans pb-16">
      {/* Top Navbar */}
      <nav className="glass-nav sticky top-0 z-30 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blush-light text-rosewood flex items-center justify-center font-bold text-sm">
            U
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-midnight">Confidential Clinical Intake</span>
        </div>

        <div className="text-xs text-midnight-muted">
          Step {step} of 3
        </div>
      </nav>

      <main className="max-w-2xl mx-auto w-full p-6 sm:p-10 space-y-6 flex-1">
        {/* Progress bar */}
        <div className="w-full bg-misty/20 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="bg-rosewood h-full rounded-full"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-7 sm:p-8 border border-misty/30 card-shadow space-y-6">
          {/* Step 1: Demographics */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Section 1</span>
                <h3 className="text-2xl font-bold font-display text-midnight mt-1">
                  Personal & Emergency Details
                </h3>
                <p className="text-xs text-midnight-muted mt-1">
                  Strictly confidential. Used only by your therapist for clinical safety.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-midnight mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-midnight mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-midnight mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-midnight mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-midnight mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-misty/20">
                <div>
                  <label className="block text-xs font-bold text-midnight mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-midnight mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-2xl bg-rosewood text-white text-xs font-bold hover:bg-rosewood-hover transition flex items-center gap-1.5 shadow-md"
                >
                  <span>Next: Presenting Concerns</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Presenting Concern */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Section 2</span>
                <h3 className="text-2xl font-bold font-display text-midnight mt-1">
                  What Brings You to Therapy?
                </h3>
                <p className="text-xs text-midnight-muted mt-1">
                  Sharing your thoughts in your own words helps Dr. Sharma prepare for your first session.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-midnight mb-1">Primary Stressors or Concerns</label>
                <textarea
                  rows={4}
                  value={formData.primaryConcern}
                  onChange={(e) => setFormData({ ...formData, primaryConcern: e.target.value })}
                  placeholder="Describe feelings of overwhelm, anxiety, relational tension, or burnout..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-midnight mb-1">What would success in therapy feel like for you?</label>
                <textarea
                  rows={3}
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="Your personal therapy goals..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood resize-none"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-misty/40 text-xs font-bold text-midnight hover:bg-vanilla"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-2xl bg-rosewood text-white text-xs font-bold hover:bg-rosewood-hover transition flex items-center gap-1.5 shadow-md"
                >
                  <span>Next: Medical History</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Medical & Prior History */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Section 3</span>
                <h3 className="text-2xl font-bold font-display text-midnight mt-1">
                  Health & Therapeutic History
                </h3>
                <p className="text-xs text-midnight-muted mt-1">
                  Helps coordinate safe, bio-psycho-social care.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-midnight mb-1">Current Medications or Relevant Physical Health Conditions</label>
                <textarea
                  rows={3}
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  placeholder="List any ongoing medical prescriptions or physical conditions (e.g. Thyroid, Diabetes)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-midnight mb-1">Previous Experience with Counselling or Therapy</label>
                <textarea
                  rows={2}
                  value={formData.previousTherapy}
                  onChange={(e) => setFormData({ ...formData, previousTherapy: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood resize-none"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-misty/40 text-xs font-bold text-midnight hover:bg-vanilla"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3.5 rounded-2xl bg-rosewood text-white text-xs font-bold hover:bg-rosewood-hover transition flex items-center gap-1.5 shadow-lg shadow-rosewood/20"
                >
                  <span>Submit Intake & Continue to Consent</span>
                  <CheckCircle2 size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientIntake;
