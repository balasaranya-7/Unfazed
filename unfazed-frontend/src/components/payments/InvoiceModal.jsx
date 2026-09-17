import React from 'react';
import Modal from '../common/Modal';
import { Printer, Download, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatINR } from '../../utils/formatters';

export const InvoiceModal = ({ transaction, isOpen, onClose }) => {
  const { therapist } = useData();

  if (!transaction) return null;

  const baseFee = transaction.amount || Math.round((transaction.totalAmount || 2200) / 1.18);
  const gstAmount = transaction.taxGst || Math.round(baseFee * 0.18);
  const cgst = Math.round(gstAmount / 2);
  const sgst = Math.round(gstAmount / 2);
  const total = transaction.totalAmount || (baseFee + gstAmount);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tax Invoice"
      subtitle={`Invoice ${transaction.invoiceNumber} • Digital Healthcare Bill`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-xs text-midnight">
        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-vanilla/40 border border-misty/30 space-y-6" id="printable-invoice">
          {/* Practice Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-misty/30 gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rosewood">UNFAZED PRACTICE NETWORK</span>
              <h3 className="text-xl font-bold font-display text-midnight">{therapist.name}</h3>
              <p className="text-midnight-muted">{therapist.title}</p>
              <p className="text-midnight-muted">{therapist.qualification}</p>
              <p className="text-midnight-muted mt-1">{therapist.location}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs font-mono font-bold text-midnight bg-white px-3 py-1 rounded-xl border border-misty/30 inline-block mb-1">
                {transaction.invoiceNumber}
              </span>
              <p className="text-midnight-muted">Invoice Date: {transaction.date}</p>
              <p className="text-midnight-muted">GSTIN: 29AABCU1234F1Z8</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-dark bg-sage-light px-2.5 py-0.5 rounded-full mt-2 border border-sage/40">
                <CheckCircle2 size={12} /> {transaction.status}
              </span>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-misty/30">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-midnight-muted block mb-1">Billed To:</span>
              <h4 className="font-bold text-sm text-midnight">{transaction.clientName}</h4>
              <p className="text-midnight-muted">Verified Client Record</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-midnight-muted block mb-1">Payment Method:</span>
              <p className="font-semibold text-midnight">{transaction.method}</p>
              <p className="text-midnight-muted">Transaction ref: TXN-{transaction.id}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-misty/20 text-[11px] font-bold uppercase tracking-wider text-midnight-muted">
                  <th className="py-2.5">Service Description</th>
                  <th className="py-2.5 text-center">HSN/SAC</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-misty/15">
                <tr>
                  <td className="py-3 font-semibold text-midnight">
                    {transaction.packageTitle}
                  </td>
                  <td className="py-3 text-center text-midnight-muted font-mono">999312</td>
                  <td className="py-3 text-right font-semibold text-midnight">
                    {formatINR(baseFee)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-misty/30 flex justify-end">
            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-midnight-muted">
                <span>Subtotal (Base Fee):</span>
                <span>{formatINR(baseFee)}</span>
              </div>
              <div className="flex justify-between text-midnight-muted">
                <span>CGST (9%):</span>
                <span>{formatINR(cgst)}</span>
              </div>
              <div className="flex justify-between text-midnight-muted">
                <span>SGST (9%):</span>
                <span>{formatINR(sgst)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-midnight pt-2 border-t border-misty/30">
                <span>Total Paid:</span>
                <span className="text-rosewood">{formatINR(total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-misty/20 text-[10px] text-midnight-muted text-center italic">
            This is a computer-generated tax invoice issued through the Unfazed therapist practice platform. No physical signature required.
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-midnight hover:bg-vanilla"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-midnight text-vanilla hover:bg-midnight-light transition flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
