import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Receipt,
  Trash2
} from 'lucide-react';

import { useData } from '../../context/DataContext';
import { formatINR } from '../../utils/formatters';

import RecordPaymentModal from '../../components/payments/RecordPaymentModal';
import InvoiceModal from '../../components/payments/InvoiceModal';


// ==================================================
// PAYMENT NORMALIZER
// ==================================================

const normalizeTransaction = (transaction) => {
  if (!transaction) {
    return null;
  }

  const amount =
    Number(
      transaction.totalAmount ??
      transaction.amount ??
      transaction.netAmount ??
      0
    ) || 0;

  return {
    ...transaction,

    id:
      transaction.id ||
      transaction._id ||
      `tx-${Date.now()}`,

    invoiceNumber:
      transaction.invoiceNumber ||
      transaction.invoice_number ||
      'INV-PENDING',

    clientId:
      transaction.clientId ||
      transaction.client_id ||
      '',

    clientName:
      transaction.clientName ||
      transaction.client_name ||
      transaction.name ||
      'Client',

    packageTitle:
      transaction.packageTitle ||
      transaction.package_title ||
      transaction.serviceName ||
      transaction.service ||
      'Therapy Session',

    date:
      transaction.date ||
      transaction.createdAt ||
      new Date().toISOString().split('T')[0],

    method:
      transaction.method ||
      transaction.paymentMethod ||
      transaction.payment_method ||
      'UPI',

    status:
      transaction.status ||
      'Completed',

    amount,

    totalAmount:
      amount,

    receiptUrl:
      transaction.receiptUrl ||
      '#'
  };
};


// ==================================================
// PAYMENTS PAGE
// ==================================================

export const Payments = () => {

  const {
    transactions = [],
    clients = [],
    showToast,
    deleteTransaction
  } = useData();


  // ==================================================
  // SAFE TRANSACTIONS
  // ==================================================

  const safeTransactions = useMemo(() => {

    if (!Array.isArray(transactions)) {
      return [];
    }

    return transactions
      .map(normalizeTransaction)
      .filter(Boolean);

  }, [transactions]);


  // ==================================================
  // FILTER STATE
  // ==================================================

  const [searchQuery, setSearchQuery] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('All');

  const [clientFilter, setClientFilter] =
    useState('All');


  // ==================================================
  // MODAL STATE
  // ==================================================

  const [recordModalOpen, setRecordModalOpen] =
    useState(false);

  const [selectedTx, setSelectedTx] =
    useState(null);

  const [invoiceModalOpen, setInvoiceModalOpen] =
    useState(false);


  // ==================================================
  // FINANCIAL SUMMARY
  // ==================================================

  const completedTx =
    safeTransactions.filter(
      (transaction) =>
        transaction.status === 'Completed'
    );


  const pendingTx =
    safeTransactions.filter(
      (transaction) =>
        transaction.status === 'Pending'
    );


  const refundedTx =
    safeTransactions.filter(
      (transaction) =>
        transaction.status === 'Refunded'
    );


  const totalRevenue =
    completedTx.reduce(
      (sum, transaction) =>
        sum +
        Number(
          transaction.totalAmount ||
          transaction.amount ||
          0
        ),
      0
    );


  const pendingRevenue =
    pendingTx.reduce(
      (sum, transaction) =>
        sum +
        Number(
          transaction.totalAmount ||
          transaction.amount ||
          0
        ),
      0
    );


  const totalRefunds =
    refundedTx.reduce(
      (sum, transaction) =>
        sum +
        Number(
          transaction.totalAmount ||
          transaction.amount ||
          0
        ),
      0
    );


  // ==================================================
  // FILTERED TRANSACTIONS
  // ==================================================

  const filteredTransactions = useMemo(() => {

    const query =
      searchQuery
        .toLowerCase()
        .trim();


    return safeTransactions.filter(
      (transaction) => {

        const clientName =
          String(
            transaction.clientName || ''
          ).toLowerCase();

        const invoiceNumber =
          String(
            transaction.invoiceNumber || ''
          ).toLowerCase();

        const packageTitle =
          String(
            transaction.packageTitle || ''
          ).toLowerCase();


        const matchesSearch =
          !query ||
          clientName.includes(query) ||
          invoiceNumber.includes(query) ||
          packageTitle.includes(query);


        const matchesStatus =
          statusFilter === 'All' ||
          transaction.status === statusFilter;


        const matchesClient =
          clientFilter === 'All' ||
          String(transaction.clientId) ===
            String(clientFilter);


        return (
          matchesSearch &&
          matchesStatus &&
          matchesClient
        );
      }
    );

  }, [
    safeTransactions,
    searchQuery,
    statusFilter,
    clientFilter
  ]);


  // ==================================================
  // OPEN INVOICE
  // ==================================================

  const handleOpenInvoice = (transaction) => {

    setSelectedTx(
      transaction
    );

    setInvoiceModalOpen(
      true
    );
  };


  // ==================================================
  // REFUND
  // ==================================================

  const handleRefund = (transaction) => {

    if (showToast) {

      showToast(
        `Refund processed for ${transaction.invoiceNumber}`
      );

    }
  };


  // ==================================================
  // DELETE PAYMENT
  // ==================================================

  const handleDeletePayment = (
    event,
    transaction
  ) => {

    event.stopPropagation();


    if (
      !deleteTransaction
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        `Delete payment ${transaction.invoiceNumber}? This cannot be undone.`
      );


    if (!confirmed) {
      return;
    }


    deleteTransaction(
      transaction.id
    );
  };


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div className="flex-1 flex flex-col min-w-0 bg-vanilla pb-16">

      {/* ==================================================
          TOP HEADER
          ================================================== */}

      <div className="bg-white border-b border-misty/30 px-6 sm:px-8 py-6">

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">

              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                Financial Ledger & Billing
              </span>

              <span className="w-1.5 h-1.5 rounded-full bg-sage" />

              <span className="text-xs font-semibold text-midnight-muted">
                GST Registered • Automated Invoicing
              </span>

            </div>


            <h1 className="text-2xl sm:text-3xl font-bold font-display text-midnight tracking-tight mt-1">
              Practice Finances & Billing
            </h1>

          </div>


          <button
            onClick={() =>
              setRecordModalOpen(true)
            }
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rosewood text-white text-sm font-semibold hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20 self-start sm:self-auto"
          >

            <CreditCard size={16} />

            <span>
              Record Offline/UPI Payment
            </span>

          </button>

        </div>

      </div>


      {/* ==================================================
          MAIN
          ================================================== */}

      <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">


        {/* ==================================================
            KPI CARDS
            ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">


          {/* TOTAL REVENUE */}

          <div className="bg-white rounded-3xl p-6 border border-misty/30 card-shadow">

            <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted block mb-1">
              Total Revenue Collected
            </span>

            <h3 className="text-3xl font-extrabold font-display text-midnight tracking-tight">

              {formatINR(
                totalRevenue
              )}

            </h3>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage-dark mt-2">

              <TrendingUp size={13} />

              {completedTx.length} completed transactions

            </span>

          </div>


          {/* PENDING */}

          <div className="bg-white rounded-3xl p-6 border border-misty/30 card-shadow">

            <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted block mb-1">
              Pending Session Fees
            </span>

            <h3 className="text-3xl font-extrabold font-display text-rosewood tracking-tight">

              {formatINR(
                pendingRevenue
              )}

            </h3>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-midnight-muted mt-2">

              <Clock size={13} />

              {pendingTx.length} awaiting UPI settlement

            </span>

          </div>


          {/* AVERAGE */}

          <div className="bg-white rounded-3xl p-6 border border-misty/30 card-shadow">

            <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted block mb-1">
              Avg Transaction Value
            </span>

            <h3 className="text-3xl font-extrabold font-display text-midnight tracking-tight">

              {formatINR(
                completedTx.length
                  ? Math.round(
                      totalRevenue /
                      completedTx.length
                    )
                  : 0
              )}

            </h3>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage-dark mt-2">
              Includes multi-session packs
            </span>

          </div>


          {/* REFUNDS */}

          <div className="bg-white rounded-3xl p-6 border border-misty/30 card-shadow">

            <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted block mb-1">
              Total Refunds
            </span>

            <h3 className="text-3xl font-extrabold font-display text-midnight tracking-tight">

              {formatINR(
                totalRefunds
              )}

            </h3>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage-dark mt-2">

              <CheckCircle2 size={13} />

              {refundedTx.length} refunded transactions

            </span>

          </div>

        </div>


        {/* ==================================================
            FILTER BAR
            ================================================== */}

        <div className="bg-white rounded-3xl p-5 border border-misty/30 card-shadow space-y-4">

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">


            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-muted"
              />

              <input
                type="text"
                placeholder="Search transactions by invoice #, client name, or service..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-misty/40 bg-vanilla/30 text-sm text-midnight placeholder:text-midnight-muted focus:outline-none focus:border-rosewood"
              />

            </div>


            {/* CLIENT FILTER */}

            <select
              value={clientFilter}
              onChange={(event) =>
                setClientFilter(
                  event.target.value
                )
              }
              className="px-3 py-2 rounded-xl border border-misty/40 text-xs font-semibold text-midnight bg-white focus:outline-none focus:border-rosewood"
            >

              <option value="All">
                All Clients ({clients.length})
              </option>

              {clients.map(
                (client) => (

                  <option
                    key={
                      client.id ||
                      client._id
                    }
                    value={
                      client.id ||
                      client._id
                    }
                  >
                    {client.name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* STATUS */}

          <div className="flex items-center gap-2 pt-3 border-t border-misty/20 text-xs">

            <span className="text-midnight-muted font-semibold mr-1">
              Status:
            </span>

            {[
              'All',
              'Completed',
              'Pending',
              'Refunded'
            ].map(
              (status) => (

                <button
                  key={status}
                  onClick={() =>
                    setStatusFilter(
                      status
                    )
                  }
                  className={`px-3 py-1 rounded-xl font-semibold transition ${
                    statusFilter === status
                      ? 'bg-midnight text-vanilla shadow-sm'
                      : 'bg-vanilla/60 text-midnight hover:bg-vanilla-dark/50'
                  }`}
                >
                  {status}
                </button>

              )
            )}

          </div>

        </div>


        {/* ==================================================
            TRANSACTIONS TABLE
            ================================================== */}

        <div className="bg-white rounded-3xl border border-misty/30 card-shadow overflow-hidden">

          {filteredTransactions.length === 0 ? (

            <div className="py-16 text-center">

              <Receipt
                size={40}
                className="mx-auto text-midnight-muted mb-3 opacity-40"
              />

              <h4 className="text-base font-bold text-midnight">
                No payment records match criteria
              </h4>

              <p className="text-xs text-midnight-muted mt-1">
                Try resetting filters or log a new payment.
              </p>

              {/* Reset */}

              {(searchQuery ||
                statusFilter !== 'All' ||
                clientFilter !== 'All') && (

                <button
                  onClick={() => {

                    setSearchQuery('');
                    setStatusFilter('All');
                    setClientFilter('All');

                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-midnight text-white text-xs font-semibold hover:opacity-90 transition"
                >
                  Reset Filters
                </button>

              )}

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse text-sm">

                <thead>

                  <tr className="border-b border-misty/20 bg-vanilla/40 text-midnight-muted text-[11px] font-bold uppercase tracking-wider">

                    <th className="py-3.5 px-6">
                      Invoice #
                    </th>

                    <th className="py-3.5 px-4">
                      Client
                    </th>

                    <th className="py-3.5 px-4">
                      Service / Package
                    </th>

                    <th className="py-3.5 px-4">
                      Date
                    </th>

                    <th className="py-3.5 px-4">
                      Method
                    </th>

                    <th className="py-3.5 px-4">
                      Status
                    </th>

                    <th className="py-3.5 px-4 text-right">
                      Amount
                    </th>

                    <th className="py-3.5 px-6 text-right">
                      Invoice
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-misty/20">

                  {filteredTransactions.map(
                    (transaction) => (

                      <tr
                        key={
                          transaction.id
                        }
                        onClick={() =>
                          handleOpenInvoice(
                            transaction
                          )
                        }
                        className="hover:bg-vanilla/30 transition cursor-pointer group"
                      >


                        {/* INVOICE */}

                        <td className="py-4 px-6 font-mono text-xs font-bold text-midnight group-hover:text-rosewood">

                          {
                            transaction.invoiceNumber
                          }

                        </td>


                        {/* CLIENT */}

                        <td className="py-4 px-4 font-semibold text-midnight">

                          {
                            transaction.clientName
                          }

                        </td>


                        {/* PACKAGE */}

                        <td className="py-4 px-4 text-xs text-midnight-muted">

                          {
                            transaction.packageTitle
                          }

                        </td>


                        {/* DATE */}

                        <td className="py-4 px-4 text-xs text-midnight-muted">

                          {
                            transaction.date
                          }

                        </td>


                        {/* METHOD */}

                        <td className="py-4 px-4 text-xs text-midnight">

                          {
                            transaction.method
                          }

                        </td>


                        {/* STATUS */}

                        <td className="py-4 px-4">

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              transaction.status ===
                              'Completed'
                                ? 'bg-sage-light text-sage-dark'
                                : transaction.status ===
                                  'Pending'
                                ? 'bg-rosewood-light text-rosewood'
                                : 'bg-vanilla-dark/40 text-midnight'
                            }`}
                          >

                            {
                              transaction.status
                            }

                          </span>

                        </td>


                        {/* AMOUNT */}

                        <td className="py-4 px-4 text-right">

                          <span className="font-extrabold text-midnight">

                            {formatINR(
                              transaction.totalAmount ||
                              transaction.amount ||
                              0
                            )}

                          </span>

                          <span className="block text-[10px] text-midnight-muted">
                            Incl. 18% GST
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td className="py-4 px-6 text-right">

                          <div className="flex items-center justify-end gap-1">

                            <button
                              onClick={(event) => {

                                event.stopPropagation();

                                handleOpenInvoice(
                                  transaction
                                );

                              }}
                              className="px-3 py-1.5 rounded-xl border border-misty/40 text-xs font-semibold text-midnight hover:bg-white hover:border-rosewood/40 transition flex items-center gap-1"
                            >

                              <FileText
                                size={13}
                                className="text-rosewood"
                              />

                              <span>
                                View Bill
                              </span>

                            </button>


                            <button
                              onClick={(event) =>
                                handleDeletePayment(
                                  event,
                                  transaction
                                )
                              }
                              className="p-1.5 rounded-xl text-rosewood hover:bg-blush-light transition"
                              title="Delete payment record"
                            >

                              <Trash2
                                size={15}
                              />

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>


      {/* ==================================================
          RECORD PAYMENT MODAL
          ================================================== */}

      <RecordPaymentModal
        isOpen={
          recordModalOpen
        }
        onClose={() =>
          setRecordModalOpen(false)
        }
      />


      {/* ==================================================
          INVOICE MODAL
          ================================================== */}

      <InvoiceModal
        transaction={
          selectedTx
        }
        isOpen={
          invoiceModalOpen
        }
        onClose={() =>
          setInvoiceModalOpen(false)
        }
      />

    </div>
  );
};


export default Payments;