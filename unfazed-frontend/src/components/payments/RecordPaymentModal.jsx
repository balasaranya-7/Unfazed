import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useData } from '../../context/DataContext';

export const RecordPaymentModal = ({ isOpen, onClose }) => {
  const { clients, addTransaction } = useData();

  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || '',
    packageTitle: 'Individual Psychotherapy (Single Session)',
    amount: 2200,
    method: 'UPI (Google Pay)',
    date: new Date().toISOString().split('T')[0],
    includeGst: true
  });

  const baseAmount = Number(formData.amount) || 0;
  const taxGst = formData.includeGst ? Math.round(baseAmount * 0.18) : 0;
  const totalAmount = baseAmount + taxGst;

  const handleSubmit = (e) => {
    e.preventDefault();
    const client = clients.find(c => c.id === formData.clientId) || clients[0];

    addTransaction({
      clientId: client.id,
      clientName: client.name,
      packageTitle: formData.packageTitle,
      amount: baseAmount,
      taxGst,
      totalAmount,
      date: formData.date,
      method: formData.method,
      status: 'Completed'
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Practice Payment"
      subtitle="Log an in-person, UPI, or bank transfer transaction with GST invoice generation"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-midnight mb-1">Select Client *</label>
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-midnight mb-1">Item / Service Description *</label>
          <input
            type="text"
            required
            value={formData.packageTitle}
            onChange={(e) => setFormData({ ...formData, packageTitle: e.target.value })}
            placeholder="e.g. 6-Session Deep-Dive Pack or Single Consultation"
            className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Base Amount (₹) *</label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-midnight mb-1">Date Received</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-midnight mb-1">Payment Method</label>
          <select
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood bg-white"
          >
            <option value="UPI (Google Pay)">UPI (Google Pay)</option>
            <option value="UPI (PhonePe)">UPI (PhonePe)</option>
            <option value="UPI (Paytm)">UPI (Paytm)</option>
            <option value="Net Banking (HDFC/ICICI)">Net Banking (NEFT/IMPS)</option>
            <option value="Credit/Debit Card (Razorpay)">Credit/Debit Card (Razorpay)</option>
            <option value="Cash at Clinic">Cash at Clinic</option>
          </select>
        </div>

        <div className="p-3.5 rounded-2xl bg-vanilla/60 border border-misty/30 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-midnight">Calculate 18% Healthcare GST</p>
            <p className="text-[11px] text-midnight-muted">
              Auto-generate GST invoice itemization
            </p>
          </div>
          <input
            type="checkbox"
            checked={formData.includeGst}
            onChange={(e) => setFormData({ ...formData, includeGst: e.target.checked })}
            className="w-4 h-4 rounded text-rosewood focus:ring-rosewood"
          />
        </div>

        <div className="bg-vanilla-light p-3.5 rounded-2xl border border-misty/30 space-y-1 text-xs text-midnight">
          <div className="flex justify-between">
            <span>Base Fee:</span>
            <span>₹{baseAmount.toLocaleString('en-IN')}</span>
          </div>
          {formData.includeGst && (
            <div className="flex justify-between text-midnight-muted">
              <span>GST (18%):</span>
              <span>₹{taxGst.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-sm text-midnight pt-1 border-t border-misty/20">
            <span>Total Logged:</span>
            <span className="text-rosewood">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-misty/20">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-midnight hover:bg-vanilla transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-rosewood text-white hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20"
          >
            Record & Generate Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RecordPaymentModal;
