import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Trash2,
  Search,
  UserPlus,
  ArrowUpDown,
  Clock
} from 'lucide-react';

import { useData } from '../../context/DataContext';
import { getStatusBadgeColor } from '../../utils/formatters';
import ClientProfileDrawer from '../../components/crm/ClientProfileDrawer';
import AddClientModal from '../../components/crm/AddClientModal';

export const Clients = () => {
  const { clients, deleteClient } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const [selectedClient, setSelectedClient] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Client waiting for delete confirmation
  const [clientToDelete, setClientToDelete] = useState(null);

  // ============================================================
  // ALL TAGS
  // ============================================================

  const allTags = useMemo(() => {
    const tagsSet = new Set();

    clients.forEach((client) => {
      client.tags?.forEach((tag) => {
        tagsSet.add(tag);
      });
    });

    return ['All', ...Array.from(tagsSet)];
  }, [clients]);

  // ============================================================
  // FILTER + SORT
  // ============================================================

  const filteredClients = useMemo(() => {
    return clients
      .filter((client) => {
        const name = client.name?.toLowerCase() || '';
        const email = client.email?.toLowerCase() || '';
        const occupation =
          client.occupation?.toLowerCase() || '';

        const query = searchQuery.toLowerCase();

        const matchesSearch =
          name.includes(query) ||
          email.includes(query) ||
          occupation.includes(query);

        const matchesStatus =
          selectedStatus === 'All' ||
          client.status === selectedStatus;

        const matchesTag =
          selectedTag === 'All' ||
          client.tags?.includes(selectedTag);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesTag
        );
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return (a.name || '').localeCompare(
            b.name || ''
          );
        }

        if (sortBy === 'totalSessions') {
          return (
            (b.totalSessions || 0) -
            (a.totalSessions || 0)
          );
        }

        if (sortBy === 'lastSession') {
          if (!a.lastSession) return 1;
          if (!b.lastSession) return -1;

          return (
            new Date(b.lastSession) -
            new Date(a.lastSession)
          );
        }

        return 0;
      });
  }, [
    clients,
    searchQuery,
    selectedStatus,
    selectedTag,
    sortBy
  ]);

  // ============================================================
  // OPEN PROFILE
  // ============================================================

  const handleOpenClient = (client) => {
    setSelectedClient(client);
    setDrawerOpen(true);
  };

  // ============================================================
  // OPEN DELETE CONFIRMATION
  // ============================================================

  const handleDeleteClick = (client, event) => {
    event.stopPropagation();

    // No browser alert / confirm
    setClientToDelete(client);
  };

  // ============================================================
  // ACTUAL DELETE
  // ============================================================

  const confirmDeleteClient = () => {
    if (!clientToDelete) return;

    const id = clientToDelete.id;

    deleteClient(id);

    if (selectedClient?.id === id) {
      setSelectedClient(null);
      setDrawerOpen(false);
    }

    setClientToDelete(null);
  };

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-vanilla pb-16">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="bg-white border-b border-misty/30 px-6 sm:px-8 py-6">

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">

              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                Client Relationship Management
              </span>

              <span className="w-1.5 h-1.5 rounded-full bg-sage" />

              <span className="text-xs font-semibold text-midnight-muted">
                {clients.length} Total Records
              </span>

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-midnight tracking-tight mt-1">
              Therapy Practice CRM
            </h1>

          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rosewood text-white text-sm font-semibold hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20 self-start sm:self-auto"
          >
            <UserPlus size={16} />
            <span>Add New Client</span>
          </button>

        </div>

      </div>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">

        {/* ====================================================
            SEARCH / SORT / FILTER
        ==================================================== */}

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
                placeholder="Search by client name, email, or occupation..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-misty/40 bg-vanilla/30 text-sm text-midnight placeholder:text-midnight-muted focus:outline-none focus:border-rosewood"
              />

            </div>


            {/* SORT */}

            <div className="flex items-center gap-2 self-end md:self-auto">

              <ArrowUpDown
                size={15}
                className="text-midnight-muted"
              />

              <span className="text-xs font-semibold text-midnight-muted">
                Sort:
              </span>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="px-3 py-2 rounded-xl border border-misty/40 text-xs font-semibold text-midnight bg-white focus:outline-none focus:border-rosewood"
              >

                <option value="name">
                  Full Name (A - Z)
                </option>

                <option value="lastSession">
                  Most Recent Session
                </option>

                <option value="totalSessions">
                  Session Volume
                </option>

              </select>

            </div>

          </div>


          {/* STATUS + TAGS */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-misty/20 text-xs">

            {/* STATUS */}

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">

              <span className="text-midnight-muted font-semibold mr-1 flex-shrink-0">
                Status:
              </span>

              {[
                'All',
                'Active',
                'Lead',
                'Paused',
                'Completed'
              ].map((status) => (

                <button
                  key={status}
                  onClick={() =>
                    setSelectedStatus(status)
                  }
                  className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition ${
                    selectedStatus === status
                      ? 'bg-midnight text-vanilla shadow-sm'
                      : 'bg-vanilla/60 text-midnight hover:bg-vanilla-dark/50'
                  }`}
                >
                  {status}
                </button>

              ))}

            </div>


            {/* TAGS */}

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">

              <span className="text-midnight-muted font-semibold mr-1 flex-shrink-0">
                Clinical Tag:
              </span>

              {allTags
                .slice(0, 5)
                .map((tag) => (

                  <button
                    key={tag}
                    onClick={() =>
                      setSelectedTag(tag)
                    }
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition ${
                      selectedTag === tag
                        ? 'bg-rosewood text-white'
                        : 'bg-vanilla-light text-midnight border border-misty/30 hover:bg-vanilla'
                    }`}
                  >

                    {tag === 'All'
                      ? 'All Tags'
                      : `#${tag}`}

                  </button>

                ))}

            </div>

          </div>

        </div>


        {/* ====================================================
            CLIENT TABLE
        ==================================================== */}

        <div className="bg-white rounded-3xl border border-misty/30 card-shadow overflow-hidden">

          {filteredClients.length === 0 ? (

            <div className="py-16 text-center">

              <Users
                size={40}
                className="mx-auto text-midnight-muted mb-3 opacity-50"
              />

              <h3 className="text-base font-bold text-midnight">
                No clients matched your filter
              </h3>

              <p className="text-xs text-midnight-muted mt-1">
                Try resetting the search terms or status criteria.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse text-sm">

                <thead>

                  <tr className="border-b border-misty/20 bg-vanilla/40 text-midnight-muted text-[11px] font-bold uppercase tracking-wider">

                    <th className="py-3.5 px-6">
                      Client
                    </th>

                    <th className="py-3.5 px-4">
                      Status
                    </th>

                    <th className="py-3.5 px-4">
                      Clinical Focus
                    </th>

                    <th className="py-3.5 px-4">
                      Package
                    </th>

                    <th className="py-3.5 px-4">
                      Last Session
                    </th>

                    <th className="py-3.5 px-4">
                      Next Session
                    </th>

                    <th className="py-3.5 px-6 text-right">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-misty/20">

                  {filteredClients.map((client) => (

                    <tr
                      key={client.id}
                      onClick={() =>
                        handleOpenClient(client)
                      }
                      className="hover:bg-vanilla/30 transition cursor-pointer group"
                    >

                      {/* CLIENT */}

                      <td className="py-4 px-6">

                        <div className="flex items-center gap-3.5">

                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-10 h-10 rounded-2xl object-cover border-2 border-blush/60 flex-shrink-0"
                          />

                          <div>

                            <span className="font-bold text-midnight group-hover:text-rosewood transition block">
                              {client.name}
                            </span>

                            <span className="text-xs text-midnight-muted">
                              {client.occupation ||
                                client.email}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* STATUS */}

                      <td className="py-4 px-4">

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
                            client.status
                          )}`}
                        >
                          {client.status}
                        </span>

                      </td>


                      {/* CLINICAL FOCUS */}

                      <td className="py-4 px-4">

                        <div className="flex flex-wrap gap-1 max-w-xs">

                          {client.tags
                            ?.slice(0, 2)
                            .map((tag, index) => (

                              <span
                                key={index}
                                className="px-2 py-0.5 rounded-md bg-blush-light text-rosewood text-[11px] font-medium border border-blush/40"
                              >
                                {tag}
                              </span>

                            ))}

                          {client.tags?.length > 2 && (

                            <span className="text-[10px] text-midnight-muted font-medium self-center">
                              +{client.tags.length - 2}
                            </span>

                          )}

                        </div>

                      </td>


                      {/* PACKAGE */}

                      <td className="py-4 px-4">

                        {client.package ? (

                          <div>

                            <span className="text-xs font-bold text-midnight block">
                              {client.package.title}
                            </span>

                            <span className="text-[11px] text-midnight-muted">

                              {client.package.used}/
                              {client.package.total}
                              {' '}used (
                              {client.package.remaining}
                              {' '}left)

                            </span>

                          </div>

                        ) : (

                          <span className="text-xs text-midnight-muted italic">
                            Pay per session
                          </span>

                        )}

                      </td>


                      {/* LAST SESSION */}

                      <td className="py-4 px-4 text-xs text-midnight-muted">

                        {client.lastSession
                          ? client.lastSession
                          : '—'}

                      </td>


                      {/* NEXT SESSION */}

                      <td className="py-4 px-4 text-xs">

                        {client.nextSession ? (

                          <span className="font-semibold text-rosewood flex items-center gap-1">

                            <Clock size={12} />

                            {new Date(
                              client.nextSession
                            ).toLocaleDateString(
                              'en-IN',
                              {
                                month: 'short',
                                day: 'numeric'
                              }
                            )}

                          </span>

                        ) : (

                          <span className="text-midnight-muted">
                            None booked
                          </span>

                        )}

                      </td>


                      {/* ACTIONS */}

                      <td className="py-4 px-6 text-right">

                        <div className="flex items-center justify-end gap-2">

                          {/* VIEW PROFILE */}

                          <button
                            onClick={(e) => {

                              e.stopPropagation();

                              handleOpenClient(
                                client
                              );

                            }}
                            className="px-3 py-1.5 rounded-xl border border-misty/40 text-xs font-semibold text-midnight hover:bg-white hover:border-rosewood/40 transition"
                          >
                            View Profile
                          </button>


                          {/* DELETE */}

                          <button
                            onClick={(e) =>
                              handleDeleteClick(
                                client,
                                e
                              )
                            }
                            className="p-2 rounded-xl border border-misty/40 text-midnight-muted hover:text-rosewood hover:bg-rosewood/10 hover:border-rosewood/30 transition"
                            title="Delete Client"
                            aria-label="Delete Client"
                          >

                            <Trash2 size={16} />

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>


      {/* ========================================================
          CLIENT PROFILE DRAWER
      ======================================================== */}

      <ClientProfileDrawer
        client={selectedClient}
        isOpen={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
      />


      {/* ========================================================
          ADD CLIENT MODAL
      ======================================================== */}

      <AddClientModal
        isOpen={addModalOpen}
        onClose={() =>
          setAddModalOpen(false)
        }
      />


      {/* ========================================================
          CUSTOM DELETE CONFIRMATION MODAL
      ======================================================== */}

      <AnimatePresence>

        {clientToDelete && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          >

            {/* BACKDROP */}

            <div
              className="absolute inset-0 bg-midnight/50 backdrop-blur-sm"
              onClick={() =>
                setClientToDelete(null)
              }
            />


            {/* MODAL */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 20
              }}
              transition={{
                duration: 0.2
              }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-misty/30 shadow-2xl p-6"
            >

              {/* ICON */}

              <div className="w-12 h-12 rounded-2xl bg-rosewood/10 flex items-center justify-center mb-4">

                <Trash2
                  size={22}
                  className="text-rosewood"
                />

              </div>


              {/* TITLE */}

              <h2 className="text-xl font-bold text-midnight">
                Delete Client?
              </h2>


              {/* MESSAGE */}

              <p className="text-sm text-midnight-muted mt-2 leading-6">

                Are you sure you want to remove{' '}

                <span className="font-bold text-midnight">
                  {clientToDelete.name}
                </span>

                {' '}from your practice?

              </p>


              <p className="text-xs text-midnight-muted mt-2">
                This action will remove the client from your CRM.
              </p>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 mt-6">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() =>
                    setClientToDelete(null)
                  }
                  className="px-5 py-2.5 rounded-xl border border-misty/40 text-sm font-semibold text-midnight hover:bg-vanilla transition"
                >
                  Cancel
                </button>


                {/* DELETE */}

                <button
                  type="button"
                  onClick={confirmDeleteClient}
                  className="px-5 py-2.5 rounded-xl bg-rosewood text-white text-sm font-semibold hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20"
                >
                  Delete Client
                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default Clients;