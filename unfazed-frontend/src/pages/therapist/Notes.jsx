import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Plus,
  Lock,
  Share2,
  Trash2,
  Edit3,
  User,
  Bold,
  Italic,
  List,
  Heading,
  Check
} from 'lucide-react';

import { useData } from '../../context/DataContext';
import { useEntitlement } from '../../hooks/useEntitlement';
import QuickNoteModal from '../../components/notes/QuickNoteModal';
import UpgradeModal from '../../components/common/UpgradeModal';

export const Notes = () => {
  const {
    notes,
    clients,
    deleteNote,
    toggleNoteShared,
    updateNote
  } = useData();

  const {
    upgradeModal,
    closeUpgradeModal
  } = useEntitlement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [templateFilter, setTemplateFilter] = useState('All');

  const [selectedNote, setSelectedNote] = useState(notes[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Edit buffers
  const [editTitle, setEditTitle] = useState('');
  const [editGeneralText, setEditGeneralText] = useState('');

  const [editSOAP, setEditSOAP] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  const [editDAP, setEditDAP] = useState({
    data: '',
    assessment: '',
    plan: ''
  });

  // Keep selected note synced with notes after add/delete/update
  useEffect(() => {
    if (!selectedNote) {
      if (notes.length > 0) {
        setSelectedNote(notes[0]);
      }
      return;
    }

    const updatedSelectedNote = notes.find(
      note => note.id === selectedNote.id
    );

    if (updatedSelectedNote) {
      setSelectedNote(updatedSelectedNote);
    } else {
      setSelectedNote(notes[0] || null);
      setIsEditing(false);
    }
  }, [notes]);

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (!selectedNote) return;

    setEditTitle(selectedNote.title || '');

    if (selectedNote.templateType === 'General') {
      setEditGeneralText(selectedNote.content?.text || '');
    }

    if (selectedNote.templateType === 'SOAP') {
      setEditSOAP({
        subjective: selectedNote.content?.subjective || '',
        objective: selectedNote.content?.objective || '',
        assessment: selectedNote.content?.assessment || '',
        plan: selectedNote.content?.plan || ''
      });
    }

    if (selectedNote.templateType === 'DAP') {
      setEditDAP({
        data: selectedNote.content?.data || '',
        assessment: selectedNote.content?.assessment || '',
        plan: selectedNote.content?.plan || ''
      });
    }

    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedNote) return;

    if (!editTitle.trim()) {
      return;
    }

    let content;

    if (selectedNote.templateType === 'General') {
      content = {
        ...selectedNote.content,
        text: editGeneralText
      };
    }

    if (selectedNote.templateType === 'SOAP') {
      content = {
        ...selectedNote.content,
        subjective: editSOAP.subjective,
        objective: editSOAP.objective,
        assessment: editSOAP.assessment,
        plan: editSOAP.plan
      };
    }

    if (selectedNote.templateType === 'DAP') {
      content = {
        ...selectedNote.content,
        data: editDAP.data,
        assessment: editDAP.assessment,
        plan: editDAP.plan
      };
    }

    updateNote(selectedNote.id, {
      title: editTitle.trim(),
      content
    });

    setSelectedNote(prev => ({
      ...prev,
      title: editTitle.trim(),
      content
    }));

    setIsEditing(false);
  };

  const handleDeleteNote = () => {
    if (!selectedNote) return;

    const noteId = selectedNote.id;

    deleteNote(noteId);

    const remainingNotes = notes.filter(
      note => note.id !== noteId
    );

    setSelectedNote(remainingNotes[0] || null);
    setIsEditing(false);
  };

  const filteredNotes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return notes.filter(note => {
      const title = note.title?.toLowerCase() || '';
      const clientName = note.clientName?.toLowerCase() || '';

      const matchesSearch =
        !query ||
        title.includes(query) ||
        clientName.includes(query);

      const matchesClient =
        selectedClientId === 'All' ||
        note.clientId === selectedClientId;

      const matchesType =
        selectedType === 'All' ||
        (selectedType === 'Private' && !note.isShared) ||
        (selectedType === 'Shared' && note.isShared);

      const matchesTemplate =
        templateFilter === 'All' ||
        note.templateType === templateFilter;

      return (
        matchesSearch &&
        matchesClient &&
        matchesType &&
        matchesTemplate
      );
    });
  }, [
    notes,
    searchQuery,
    selectedClientId,
    selectedType,
    templateFilter
  ]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-vanilla pb-16">

      {/* Header */}
      <div className="bg-white border-b border-misty/30 px-6 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                Clinical Documentation
              </span>

              <span className="w-1.5 h-1.5 rounded-full bg-sage" />

              <span className="text-xs font-semibold text-midnight-muted">
                SOAP / DAP / Shared Takeaways
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-midnight tracking-tight mt-1">
              Clinical Session Notes
            </h1>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            disabled={clients.length === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rosewood text-white text-sm font-semibold hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20 self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            <span>Create New Note</span>
          </button>
        </div>
      </div>

      <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">

        {/* Filters */}
        <div className="bg-white rounded-3xl p-5 border border-misty/30 card-shadow space-y-4">

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-muted"
              />

              <input
                type="text"
                placeholder="Search notes by title, topic, or client name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-misty/40 bg-vanilla/30 text-sm text-midnight placeholder:text-midnight-muted focus:outline-none focus:border-rosewood"
              />
            </div>

            <div className="flex items-center gap-2">
              <User size={15} className="text-midnight-muted" />

              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="px-3 py-2 rounded-xl border border-misty/40 text-xs font-semibold text-midnight bg-white focus:outline-none focus:border-rosewood"
              >
                <option value="All">
                  All Clients ({notes.length})
                </option>

                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-misty/20 text-xs">

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-midnight-muted font-semibold">
                Access Level:
              </span>

              {['All', 'Private', 'Shared'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-xl font-semibold transition ${
                    selectedType === type
                      ? 'bg-midnight text-vanilla shadow-sm'
                      : 'bg-vanilla/60 text-midnight hover:bg-vanilla-dark/50'
                  }`}
                >
                  {type === 'Private'
                    ? '🔒 Private Notes'
                    : type === 'Shared'
                    ? '🌿 Shared Notes'
                    : 'All Notes'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-midnight-muted font-semibold">
                Format:
              </span>

              {['All', 'General', 'SOAP', 'DAP'].map(template => (
                <button
                  key={template}
                  onClick={() => setTemplateFilter(template)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition ${
                    templateFilter === template
                      ? 'bg-rosewood text-white'
                      : 'bg-vanilla-light text-midnight border border-misty/30 hover:bg-vanilla'
                  }`}
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Notes list */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-5 border border-misty/30 card-shadow space-y-3 max-h-[750px] overflow-y-auto">

            <div className="flex items-center justify-between pb-2 border-b border-misty/20">
              <span className="text-xs font-bold uppercase tracking-wider text-midnight-muted">
                {filteredNotes.length} Documented Notes
              </span>
            </div>

            {filteredNotes.length === 0 ? (
              <p className="text-xs text-midnight-muted text-center py-10">
                No notes found.
              </p>
            ) : (
              filteredNotes.map(note => {
                const isSelected =
                  selectedNote?.id === note.id;

                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleSelectNote(note)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition ${
                      isSelected
                        ? 'border-rosewood bg-vanilla/50 shadow-sm ring-1 ring-rosewood/30'
                        : 'border-misty/30 hover:bg-vanilla/30'
                    }`}
                  >

                    <div className="flex items-center justify-between mb-1.5 gap-2">

                      <span className="text-xs font-bold text-midnight">
                        {note.clientName}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          note.isShared
                            ? 'bg-sage-light text-sage-dark border border-sage/40'
                            : 'bg-blush-light text-rosewood border border-blush/60'
                        }`}
                      >
                        {note.isShared ? (
                          <Share2 size={10} />
                        ) : (
                          <Lock size={10} />
                        )}

                        {note.isShared
                          ? 'Shared'
                          : 'Private'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-midnight line-clamp-2">
                      {note.title}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-misty/20 text-[10px] text-midnight-muted">

                      <span>{note.sessionDate}</span>

                      <span className="font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-vanilla text-midnight">
                        {note.templateType}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Editor */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow">

            {selectedNote ? (
              <div className="space-y-6">

                {/* Top bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-misty/20 gap-4">

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          selectedNote.isShared
                            ? 'bg-sage-light text-sage-dark border border-sage/40'
                            : 'bg-blush-light text-rosewood border border-blush/60'
                        }`}
                      >
                        {selectedNote.isShared ? (
                          <Share2 size={12} />
                        ) : (
                          <Lock size={12} />
                        )}

                        {selectedNote.isShared
                          ? 'SHARED WITH CLIENT'
                          : 'STRICTLY PRIVATE THERAPIST NOTE'}
                      </span>

                      <span className="text-xs text-midnight-muted font-medium">
                        • Template: {selectedNote.templateType}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-midnight">
                      {selectedNote.title}
                    </h3>

                    <p className="text-xs text-midnight-muted mt-0.5">
                      Client:{' '}
                      <strong className="text-midnight">
                        {selectedNote.clientName}
                      </strong>{' '}
                      • Date: {selectedNote.sessionDate}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">

                    <button
                      onClick={() =>
                        toggleNoteShared(selectedNote.id)
                      }
                      className="px-3 py-1.5 rounded-xl border border-misty/40 text-xs font-semibold text-midnight hover:bg-vanilla transition flex items-center gap-1.5"
                    >
                      {selectedNote.isShared ? (
                        <Lock
                          size={13}
                          className="text-rosewood"
                        />
                      ) : (
                        <Share2
                          size={13}
                          className="text-sage"
                        />
                      )}

                      <span>
                        {selectedNote.isShared
                          ? 'Make Private'
                          : 'Share with Client'}
                      </span>
                    </button>

                    <button
                      onClick={
                        isEditing
                          ? handleSaveEdit
                          : handleStartEdit
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-midnight text-vanilla text-xs font-semibold hover:bg-midnight-light transition flex items-center gap-1.5"
                    >
                      {isEditing ? (
                        <Check size={13} />
                      ) : (
                        <Edit3 size={13} />
                      )}

                      <span>
                        {isEditing
                          ? 'Save Changes'
                          : 'Edit Note'}
                      </span>
                    </button>

                    <button
                      onClick={handleDeleteNote}
                      className="p-1.5 rounded-xl text-rosewood hover:bg-rosewood-light transition"
                      title="Delete note"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* EDIT MODE */}
                {isEditing ? (
                  <div className="space-y-4">

                    <div className="flex items-center gap-1 p-2 rounded-xl bg-vanilla/60 border border-misty/30 text-midnight-muted">
                      <button
                        type="button"
                        className="p-1.5 hover:bg-white rounded text-midnight"
                      >
                        <Bold size={14} />
                      </button>

                      <button
                        type="button"
                        className="p-1.5 hover:bg-white rounded text-midnight"
                      >
                        <Italic size={14} />
                      </button>

                      <button
                        type="button"
                        className="p-1.5 hover:bg-white rounded text-midnight"
                      >
                        <List size={14} />
                      </button>

                      <button
                        type="button"
                        className="p-1.5 hover:bg-white rounded text-midnight"
                      >
                        <Heading size={14} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(e.target.value)
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-misty/40 text-sm font-bold text-midnight focus:outline-none focus:border-rosewood"
                    />

                    {/* General */}
                    {selectedNote.templateType === 'General' && (
                      <textarea
                        rows={12}
                        value={editGeneralText}
                        onChange={(e) =>
                          setEditGeneralText(e.target.value)
                        }
                        className="w-full p-4 rounded-2xl border border-misty/40 text-sm text-midnight leading-relaxed focus:outline-none focus:border-rosewood font-sans resize-none"
                      />
                    )}

                    {/* SOAP */}
                    {selectedNote.templateType === 'SOAP' && (
                      <div className="space-y-3">

                        <div>
                          <label className="block text-[11px] font-bold text-midnight mb-1">
                            S — Subjective
                          </label>

                          <textarea
                            rows={4}
                            value={editSOAP.subjective}
                            onChange={(e) =>
                              setEditSOAP(prev => ({
                                ...prev,
                                subjective: e.target.value
                              }))
                            }
                            className="w-full p-3 rounded-xl border border-misty/40 text-sm text-midnight focus:outline-none focus:border-rosewood resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-midnight mb-1">
                            O — Objective
                          </label>

                          <textarea
                            rows={4}
                            value={editSOAP.objective}
                            onChange={(e) =>
                              setEditSOAP(prev => ({
                                ...prev,
                                objective: e.target.value
                              }))
                            }
                            className="w-full p-3 rounded-xl border border-misty/40 text-sm text-midnight focus:outline-none focus:border-rosewood resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-midnight mb-1">
                            A — Assessment
                          </label>

                          <textarea
                            rows={4}
                            value={editSOAP.assessment}
                            onChange={(e) =>
                              setEditSOAP(prev => ({
                                ...prev,
                                assessment: e.target.value
                              }))
                            }
                            className="w-full p-3 rounded-xl border border-misty/40 text-sm text-midnight focus:outline-none focus:border-rosewood resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-midnight mb-1">
                            P — Plan
                          </label>

                          <textarea
                            rows={4}
                            value={editSOAP.plan}
                            onChange={(e) =>
                              setEditSOAP(prev => ({
                                ...prev,
                                plan: e.target.value
                              }))
                            }
                            className="w-full p-3 rounded-xl border border-misty/40 text-sm text-midnight focus:outline-none focus:border-rosewood resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* DAP */}
                    {selectedNote.templateType === 'DAP' && (
                      <div className="space-y-3">

                        <div>
                          <label className="block text-[11px] font-bold text-midnight mb-1">
                            D — Data
                          </label>

                          <textarea
                            rows={5}
                            value={editDAP.data}
                            onChange={(e) =>
                              setEditDAP(prev => ({
                                ...prev,
                                data: e.target.value
                              }))
                            }
                            className="w-full p-3 rounded-xl border border-misty/40 text-sm text-midnight focus:outline-none focus:border-rosewood resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-midnight mb-1">
                            A — Assessment
                          </label>

                          <textarea
                            rows={4}
                            value={editDAP.assessment}
                            onChange={(e) =>
                              setEditDAP(prev => ({
                                ...prev,
                                assessment: e.target.value
                              }))
                            }
                            className="w-full p-3 rounded-xl border border-misty/40 text-sm text-midnight focus:outline-none focus:border-rosewood resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-midnight mb-1">
                            P — Plan
                          </label>

                          <textarea
                            rows={4}
                            value={editDAP.plan}
                            onChange={(e) =>
                              setEditDAP(prev => ({
                                ...prev,
                                plan: e.target.value
                              }))
                            }
                            className="w-full p-3 rounded-xl border border-misty/40 text-sm text-midnight focus:outline-none focus:border-rosewood resize-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-midnight hover:bg-vanilla"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleSaveEdit}
                        className="px-5 py-2 rounded-xl text-xs font-semibold bg-rosewood text-white hover:bg-rosewood-hover transition"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                ) : (

                  /* VIEW MODE */
                  <div className="space-y-4 text-xs leading-relaxed text-midnight">

                    {/* SOAP */}
                    {selectedNote.templateType === 'SOAP' && (
                      <div className="space-y-3">

                        <div className="p-4 rounded-2xl bg-vanilla/40 border border-misty/30">
                          <span className="font-bold text-rosewood block mb-1 uppercase tracking-wider text-[11px]">
                            S — Subjective Report
                          </span>
                          <p>
                            {selectedNote.content?.subjective ||
                              'No subjective report entered.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-vanilla/40 border border-misty/30">
                          <span className="font-bold text-rosewood block mb-1 uppercase tracking-wider text-[11px]">
                            O — Objective Observations
                          </span>
                          <p>
                            {selectedNote.content?.objective ||
                              'No objective observations entered.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-vanilla/40 border border-misty/30">
                          <span className="font-bold text-rosewood block mb-1 uppercase tracking-wider text-[11px]">
                            A — Clinical Assessment
                          </span>
                          <p>
                            {selectedNote.content?.assessment ||
                              'No assessment entered.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-vanilla/40 border border-misty/30">
                          <span className="font-bold text-rosewood block mb-1 uppercase tracking-wider text-[11px]">
                            P — Treatment Plan & Interventions
                          </span>
                          <p>
                            {selectedNote.content?.plan ||
                              'No plan entered.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* DAP */}
                    {selectedNote.templateType === 'DAP' && (
                      <div className="space-y-3">

                        <div className="p-4 rounded-2xl bg-vanilla/40 border border-misty/30">
                          <span className="font-bold text-rosewood block mb-1 uppercase tracking-wider text-[11px]">
                            D — Clinical Data & Events
                          </span>
                          <p>
                            {selectedNote.content?.data ||
                              'No data entered.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-vanilla/40 border border-misty/30">
                          <span className="font-bold text-rosewood block mb-1 uppercase tracking-wider text-[11px]">
                            A — Assessment
                          </span>
                          <p>
                            {selectedNote.content?.assessment ||
                              'No assessment entered.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-vanilla/40 border border-misty/30">
                          <span className="font-bold text-rosewood block mb-1 uppercase tracking-wider text-[11px]">
                            P — Plan
                          </span>
                          <p>
                            {selectedNote.content?.plan ||
                              'No plan entered.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* General */}
                    {selectedNote.templateType === 'General' && (
                      <div className="p-5 rounded-2xl bg-vanilla/40 border border-misty/30 whitespace-pre-line text-sm text-midnight/90 leading-relaxed font-sans">
                        {selectedNote.content?.text ||
                          'No content entered.'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-24 text-center">

                <FileText
                  size={40}
                  className="mx-auto text-midnight-muted mb-3 opacity-40"
                />

                <h4 className="text-base font-bold text-midnight">
                  Select a Clinical Note
                </h4>

                <p className="text-xs text-midnight-muted mt-1">
                  Choose a note from the left to view documentation or edit.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Modal */}
      <QuickNoteModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={closeUpgradeModal}
        featureTitle={upgradeModal.title}
        featureDescription={upgradeModal.description}
      />
    </div>
  );
};

export default Notes;