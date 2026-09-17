import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Check,
  ShieldCheck,
  Users,
  HardDrive,
  FileText,
  BarChart3,
  MessageCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useEntitlement, TIER_CONFIG } from '../../hooks/useEntitlement';

export const Subscription = () => {
  const { therapist, updateTherapist, clients, showToast } = useData();
  const { currentTierKey } = useEntitlement();

  const activeClientCount = clients.filter(c => c.status === 'Active').length;
  const currentPlan = therapist.subscription || {};

  const handleSelectTier = (tierKey) => {
    const config = TIER_CONFIG[tierKey];
    updateTherapist({
      subscription: {
        ...therapist.subscription,
        tier: tierKey,
        tierName: config.name,
        activeClientsLimit: config.clientCap,
        features: {
          soap_notes: config.features.soap_notes,
          dap_notes: config.features.dap_notes,
          deep_analytics: config.features.deep_analytics,
          whatsapp_notifications: config.features.whatsapp_notifications,
          custom_branding: config.features.custom_branding,
          packages_management: config.features.packages_management
        }
      }
    });
    showToast(`Switched active entitlement plan to: ${config.name}`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-vanilla pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-misty/30 px-6 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Platform Entitlement Service</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
              <span className="text-xs font-semibold text-midnight-muted">Config-Driven Feature Gating</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-midnight tracking-tight mt-1">
              Subscription & Feature Access
            </h1>
          </div>
        </div>
      </div>

      <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-10">
        {/* Current Plan & Usage Meter Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-misty/20">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Active Membership</span>
              <h2 className="text-2xl font-bold font-display text-midnight mt-1">
                {currentPlan.tierName || 'Growth Practice Tier'}
              </h2>
              <p className="text-xs text-midnight-muted mt-0.5">
                Next billing cycle renews on {currentPlan.renewalDate || 'Oct 15, 2026'} • Registered to {therapist.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-2xl bg-sage-light text-sage-dark font-bold text-xs border border-sage/40 flex items-center gap-1.5">
                <ShieldCheck size={16} />
                <span>Entitlements Active</span>
              </span>
            </div>
          </div>

          {/* Usage Meters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs text-midnight">
            {/* Active Clients Meter */}
            <div className="p-4 rounded-2xl bg-vanilla/50 border border-misty/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-midnight">
                  <Users size={14} className="text-rosewood" /> Active Client Cap
                </span>
                <span className="font-mono font-bold text-midnight">
                  {activeClientCount} / {currentPlan.activeClientsLimit || 35}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-misty/20">
                <div
                  className="bg-rosewood h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (activeClientCount / (currentPlan.activeClientsLimit || 35)) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-midnight-muted">
                {(currentPlan.activeClientsLimit || 35) - activeClientCount} client slots available on current tier
              </p>
            </div>

            {/* Storage Meter */}
            <div className="p-4 rounded-2xl bg-vanilla/50 border border-misty/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-midnight">
                  <HardDrive size={14} className="text-sage-dark" /> Clinical Storage
                </span>
                <span className="font-mono font-bold text-midnight">
                  1.8 GB / 10 GB
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-misty/20">
                <div
                  className="bg-sage-dark h-full rounded-full transition-all duration-500"
                  style={{ width: '18%' }}
                />
              </div>
              <p className="text-[11px] text-midnight-muted">
                Encrypted attachments, audio logs & note revisions
              </p>
            </div>

            {/* Features Unlocked */}
            <div className="p-4 rounded-2xl bg-vanilla/50 border border-misty/30 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-midnight">
                <Sparkles size={14} className="text-midnight" /> Unlocked Modules
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-white text-[10px] font-semibold border border-misty/30">
                  {currentTierKey === 'starter' ? 'General Notes' : 'SOAP & DAP Notes'}
                </span>
                <span className="px-2 py-0.5 rounded bg-white text-[10px] font-semibold border border-misty/30">
                  GST Invoices
                </span>
                <span className="px-2 py-0.5 rounded bg-white text-[10px] font-semibold border border-misty/30">
                  {currentTierKey === 'starter' ? 'Basic Analytics' : 'Deep Analytics'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Tier Comparison Cards */}
        <div>
          <div className="mb-6 text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-bold font-display text-midnight">
              Choose the Plan for Your Practice Stage
            </h3>
            <p className="text-xs text-midnight-muted mt-1">
              Switch anytime. Entitlements update immediately across calendar, clinical notes, and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <div className={`bg-white rounded-3xl p-7 border flex flex-col justify-between transition relative card-shadow ${
              currentTierKey === 'starter' ? 'border-rosewood ring-2 ring-rosewood/20' : 'border-misty/30'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted">Starter Practice</span>
                  {currentTierKey === 'starter' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rosewood-light text-rosewood">
                      Current Plan
                    </span>
                  )}
                </div>
                <h4 className="text-2xl font-bold font-display text-midnight">₹0</h4>
                <p className="text-xs text-midnight-muted">Forever free for solo starters</p>

                <div className="my-6 space-y-3 text-xs text-midnight">
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-sage-dark flex-shrink-0" />
                    <span>Up to 5 Active Clients</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-sage-dark flex-shrink-0" />
                    <span>General Session Notes</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-midnight-muted">
                    <span className="w-4 text-center font-bold">×</span>
                    <span>No SOAP / DAP Clinical Templates</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-midnight-muted">
                    <span className="w-4 text-center font-bold">×</span>
                    <span>No WhatsApp Reminders</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectTier('starter')}
                disabled={currentTierKey === 'starter'}
                className="w-full py-3 rounded-2xl border border-misty/50 text-xs font-bold text-midnight hover:bg-vanilla disabled:opacity-50 transition"
              >
                {currentTierKey === 'starter' ? 'Active Plan' : 'Select Starter'}
              </button>
            </div>

            {/* Growth Practice (Recommended) */}
            <div className={`bg-white rounded-3xl p-7 border flex flex-col justify-between transition relative card-shadow shadow-xl ${
              currentTierKey === 'pro' ? 'border-rosewood ring-2 ring-rosewood/30' : 'border-blush'
            }`}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rosewood text-white shadow-sm">
                Most Therapists Choose Growth
              </span>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Growth Practice</span>
                  {currentTierKey === 'pro' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sage-light text-sage-dark border border-sage/40">
                      Active Plan
                    </span>
                  )}
                </div>
                <h4 className="text-2xl font-bold font-display text-midnight">₹2,499<span className="text-xs text-midnight-muted font-normal"> / month</span></h4>
                <p className="text-xs text-midnight-muted">For busy independent practitioners</p>

                <div className="my-6 space-y-3 text-xs text-midnight">
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-sage-dark flex-shrink-0" />
                    <span>Up to 35 Active Clients</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-sage-dark flex-shrink-0" />
                    <span>SOAP, DAP & Diagnostic Templates</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-sage-dark flex-shrink-0" />
                    <span>Automated WhatsApp Session Reminders</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-sage-dark flex-shrink-0" />
                    <span>Deep Practice Analytics & Retention</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-sage-dark flex-shrink-0" />
                    <span>Session Packages & Custom Branding</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectTier('pro')}
                disabled={currentTierKey === 'pro'}
                className="w-full py-3 rounded-2xl bg-rosewood text-white text-xs font-bold hover:bg-rosewood-hover disabled:opacity-60 transition shadow-md shadow-rosewood/20"
              >
                {currentTierKey === 'pro' ? 'Current Active Tier' : 'Upgrade to Growth'}
              </button>
            </div>

            {/* Clinic / Enterprise */}
            <div className={`bg-white rounded-3xl p-7 border flex flex-col justify-between transition relative card-shadow ${
              currentTierKey === 'practice' ? 'border-rosewood ring-2 ring-rosewood/20' : 'border-misty/30'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted">Clinic & Group</span>
                  {currentTierKey === 'practice' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rosewood-light text-rosewood">
                      Current Plan
                    </span>
                  )}
                </div>
                <h4 className="text-2xl font-bold font-display text-midnight">₹5,999<span className="text-xs text-midnight-muted font-normal"> / month</span></h4>
                <p className="text-xs text-midnight-muted">For multi-therapist clinics & centers</p>

                <div className="my-6 space-y-3 text-xs text-midnight">
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-sage-dark flex-shrink-0" />
                    <span>Up to 150 Active Clients</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-sage-dark flex-shrink-0" />
                    <span>Multi-Therapist Staff Calendars</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-sage-dark flex-shrink-0" />
                    <span>Dedicated WhatsApp Dedicated Number</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={16} className="text-sage-dark flex-shrink-0" />
                    <span>Concierge Migration & Priority Support</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectTier('practice')}
                disabled={currentTierKey === 'practice'}
                className="w-full py-3 rounded-2xl border border-misty/50 text-xs font-bold text-midnight hover:bg-vanilla disabled:opacity-50 transition"
              >
                {currentTierKey === 'practice' ? 'Active Plan' : 'Upgrade to Clinic Tier'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscription;
