import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package as PackageIcon,
  Plus,
  Check,
  Trash2,
  Clock,
  Sparkles,
  Users,
  Percent,
  Calendar,
  IndianRupee,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatINR } from '../../utils/formatters';
import Modal from '../../components/common/Modal';

export const Packages = () => {
  const { packages, clients, addPackage, deletePackage, showToast } = useData();

  // Create Package Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPkg, setNewPkg] = useState({
    name: '',
    sessionCount: 6,
    price: 11400,
    validityDays: 90,
    description: '',
    featuresText: '6 x 50-min sessions\nFlexible rescheduling\nPriority booking'
  });

  const handleCreatePackage = (e) => {
    e.preventDefault();
    const count = Number(newPkg.sessionCount) || 1;
    const price = Number(newPkg.price) || 0;
    const pricePerSession = Math.round(price / count);

    addPackage({
      name: newPkg.name,
      sessionCount: count,
      price,
      pricePerSession,
      savingsPercent: 15,
      validityDays: Number(newPkg.validityDays) || 60,
      description: newPkg.description || 'Clinical consultation package.',
      features: newPkg.featuresText.split('\n').filter(Boolean)
    });

    setCreateModalOpen(false);
  };

  // Find clients with active packages
  const clientPackages = clients.filter(c => c.package);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-vanilla pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-misty/30 px-6 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">Treatment Plans & Bundles</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
              <span className="text-xs font-semibold text-midnight-muted">{packages.length} Active Offerings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-midnight tracking-tight mt-1">
              Session Packages & Bundles
            </h1>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rosewood text-white text-sm font-semibold hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20 self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Create New Package</span>
          </button>
        </div>
      </div>

      <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-10">
        {/* Therapist Packages Catalog */}
        <div>
          <div className="mb-5">
            <h2 className="text-xl font-bold font-display text-midnight">Practice Offerings</h2>
            <p className="text-xs text-midnight-muted">
              Packages encourage treatment adherence and steady client outcomes. Displayed on your public link.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition relative border card-shadow ${
                  pkg.popular
                    ? 'bg-white border-rosewood shadow-lg shadow-rosewood/10 ring-2 ring-rosewood/20'
                    : 'bg-white border-misty/30 hover:border-blush/80'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rosewood text-white shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                      {pkg.sessionCount} Sessions
                    </span>
                    <span className="text-xs font-bold text-sage-dark bg-sage-light px-2 py-0.5 rounded-md border border-sage/40">
                      Save {pkg.savingsPercent}%
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-midnight mt-1.5">{pkg.name}</h3>
                  <p className="text-xs text-midnight-muted mt-1 leading-relaxed">{pkg.description}</p>

                  <div className="my-5 p-4 rounded-2xl bg-vanilla/50 border border-misty/30">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold font-display text-midnight">{formatINR(pkg.price)}</span>
                      <span className="text-xs text-midnight-muted">total</span>
                    </div>
                    <span className="text-xs font-semibold text-midnight-muted block mt-0.5">
                      ₹{pkg.pricePerSession}/session • {pkg.validityDays} days validity
                    </span>
                  </div>

                  {/* Included Features */}
                  <div className="space-y-2.5 text-xs text-midnight">
                    <span className="font-bold text-midnight-muted uppercase tracking-wider text-[10px] block">
                      Package Inclusions:
                    </span>
                    {pkg.features?.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={14} className="text-sage-dark flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-misty/20 flex items-center justify-between text-xs">
                  <span className="text-midnight-muted font-medium">
                    {pkg.activeClientsCount} clients enrolled
                  </span>
                  <div className="flex items-center gap-3">
                                      <button
                    onClick={() => showToast(`Link for ${pkg.name} copied!`)}
                    className="text-xs font-bold text-rosewood hover:underline"
                  >
                    Share Link →
                  </button>
                    <button
                      onClick={() => { if (window.confirm(`Delete ${pkg.name}? This cannot be undone.`)) deletePackage(pkg.id); }}
                      className="p-1.5 rounded-xl text-rosewood hover:bg-blush-light transition"
                      title="Delete package"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Packages Utilization Tracker */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-misty/20">
            <div>
              <h3 className="text-lg font-bold font-display text-midnight">
                Client Package Utilization Tracker
              </h3>
              <p className="text-xs text-midnight-muted">
                Track how many sessions each client has consumed against their purchased bundle
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-vanilla text-midnight border border-misty/30 self-start sm:self-auto">
              {clientPackages.length} Enrolled Clients
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientPackages.map((c) => {
              const pkg = c.package;
              const percentUsed = Math.round((pkg.used / pkg.total) * 100);

              return (
                <div key={c.id} className="p-5 rounded-2xl bg-vanilla/40 border border-misty/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-10 h-10 rounded-xl object-cover border border-blush"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-midnight">{c.name}</h4>
                        <span className="text-xs text-midnight-muted">{pkg.title}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono text-rosewood">
                      {pkg.used} / {pkg.total} Sessions
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="w-full bg-white rounded-full h-2.5 overflow-hidden border border-misty/20">
                      <div
                        className="bg-rosewood h-full rounded-full transition-all duration-700"
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-midnight-muted mt-1.5">
                      <span>{percentUsed}% completed</span>
                      <span>{pkg.remaining} remaining (Valid to {pkg.expiryDate})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Create Package Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Session Package"
        subtitle="Bundle clinical hours with custom pricing and expiry policies"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreatePackage} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Package Name *</label>
            <input
              type="text"
              required
              value={newPkg.name}
              onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
              placeholder="e.g. 8-Session CBT Anxiety Breakthrough"
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-midnight mb-1">Total Sessions *</label>
              <input
                type="number"
                required
                min={1}
                value={newPkg.sessionCount}
                onChange={(e) => setNewPkg({ ...newPkg, sessionCount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-midnight mb-1">Package Price (₹) *</label>
              <input
                type="number"
                required
                value={newPkg.price}
                onChange={(e) => setNewPkg({ ...newPkg, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Validity (Days)</label>
            <input
              type="number"
              value={newPkg.validityDays}
              onChange={(e) => setNewPkg({ ...newPkg, validityDays: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Description</label>
            <textarea
              rows={2}
              value={newPkg.description}
              onChange={(e) => setNewPkg({ ...newPkg, description: e.target.value })}
              placeholder="Who is this package best suited for?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Features (One per line)</label>
            <textarea
              rows={3}
              value={newPkg.featuresText}
              onChange={(e) => setNewPkg({ ...newPkg, featuresText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-misty/20">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-midnight hover:bg-vanilla"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-rosewood text-white hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20"
            >
              Save Package
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Packages;
