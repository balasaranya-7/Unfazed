import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const UpgradeModal = ({ isOpen, onClose, featureTitle, featureDescription }) => {
  const { therapist, updateTherapist, showToast } = useData();

  if (!isOpen) return null;

  const handleUpgradeToPro = () => {
    updateTherapist({
      subscription: {
        ...therapist.subscription,
        tier: 'pro',
        tierName: 'Growth Practice Tier',
        activeClientsLimit: 35,
        features: {
          soap_notes: true,
          dap_notes: true,
          deep_analytics: true,
          whatsapp_notifications: true,
          custom_branding: true,
          packages_management: true
        }
      }
    });
    showToast('🎉 Practice successfully upgraded to Growth Practice Tier!');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-midnight/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-blush/40 z-10 my-auto text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-midnight-muted hover:text-midnight hover:bg-vanilla rounded-full transition"
          >
            <X size={20} />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-blush-light text-rosewood flex items-center justify-center mx-auto mb-5 shadow-sm border border-blush/60">
            <Sparkles size={32} />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rosewood-light text-rosewood mb-3">
            Therapist Entitlement Tier Gate
          </span>

          <h3 className="text-2xl font-bold font-display text-midnight mb-2">
            {featureTitle || 'Unlock Growth Practice Features'}
          </h3>

          <p className="text-sm text-midnight-muted leading-relaxed mb-6 max-w-md mx-auto">
            {featureDescription || 'This clinical tool requires an active Growth Practice subscription. Power your clinical documentation and practice analytics without friction.'}
          </p>

          <div className="bg-vanilla/60 rounded-2xl p-5 border border-misty/30 text-left mb-6 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-midnight-muted">Included in Growth Practice (₹2,499/mo):</p>
            <div className="grid grid-cols-1 gap-2 text-sm text-midnight">
              <div className="flex items-center gap-2.5">
                <Check size={16} className="text-sage-dark flex-shrink-0" />
                <span>Unlimited SOAP, DAP & Clinical Assessment Templates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check size={16} className="text-sage-dark flex-shrink-0" />
                <span>Deep Practice Analytics (Cohort Retention, No-show pipeline)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check size={16} className="text-sage-dark flex-shrink-0" />
                <span>Up to 35 Active Clients & Automated WhatsApp Reminders</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check size={16} className="text-sage-dark flex-shrink-0" />
                <span>Custom Branded Client Portal & Session Packages</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleUpgradeToPro}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-rosewood text-white font-semibold shadow-md hover:bg-rosewood-hover transition flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              Upgrade to Growth (Demo)
            </button>
            <button
              onClick={onClose}
              className="py-3.5 px-5 rounded-2xl bg-vanilla text-midnight font-medium hover:bg-vanilla-dark/50 transition"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UpgradeModal;
