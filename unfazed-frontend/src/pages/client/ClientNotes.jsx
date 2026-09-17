import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ShieldCheck, Heart, Sparkles, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import ClientNavbar from '../../components/common/ClientNavbar';

export const ClientNotes = () => {
  const { currentClient } = useAuth();
  const { therapist, notes } = useData();

  // STRICT COMPLIANCE RULE: Filter ONLY notes marked as isShared === true for this client!
  const sharedNotes = notes.filter(n =>
    (n.clientId === currentClient.id || n.clientName === currentClient.name) && n.isShared
  );

  const [selectedNote, setSelectedNote] = useState(sharedNotes[0] || null);

  return (
    <div className="min-h-screen bg-vanilla text-midnight flex flex-col font-sans pb-16">
      <ClientNavbar />

      <main className="max-w-5xl mx-auto w-full p-6 sm:p-10 space-y-8 flex-1">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush-light text-rosewood text-xs font-bold uppercase tracking-wider">
            <BookOpen size={13} /> Collaborative Growth
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-midnight tracking-tight">
            Shared Reflections & Anchors
          </h1>
          <p className="text-xs sm:text-sm text-midnight-muted leading-relaxed">
            Personalized homework, grounding worksheets, and key insights curated specifically for you by {therapist.name}.
          </p>
        </div>

        {/* Security / Privacy Banner */}
        <div className="p-4 rounded-2xl bg-white border border-sage/40 flex items-center justify-between text-xs text-midnight card-shadow">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-sage-dark flex-shrink-0" />
            <span>
              <strong>Private Clinical Notes Protected:</strong> You are viewing collaborative takeaways published to your portal. Internal diagnostic notes are strictly confidential.
            </span>
          </div>
          <span className="text-[11px] font-bold text-sage-dark bg-sage-light px-2.5 py-0.5 rounded-full border border-sage/40 hidden sm:inline-block">
            Verified Safe
          </span>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Notes Navigation (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-3xl p-4 border border-misty/30 card-shadow space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-midnight-muted px-2 block mb-1">
              Session Takeaways ({sharedNotes.length})
            </span>

            {sharedNotes.length === 0 ? (
              <p className="text-xs text-midnight-muted py-8 text-center">No shared notes published yet.</p>
            ) : (
              sharedNotes.map((note) => {
                const isSelected = selectedNote?.id === note.id;

                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition ${
                      isSelected
                        ? 'bg-rosewood text-white border-rosewood shadow-md'
                        : 'bg-vanilla/40 border-misty/30 text-midnight hover:bg-vanilla'
                    }`}
                  >
                    <span className={`text-[10px] font-semibold block ${isSelected ? 'text-blush' : 'text-midnight-muted'}`}>
                      {note.sessionDate}
                    </span>
                    <h4 className="text-xs font-bold mt-0.5 line-clamp-2">{note.title}</h4>
                  </div>
                );
              })
            )}
          </div>

          {/* Reading Viewer (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-9 border border-misty/30 card-shadow space-y-6">
            {selectedNote ? (
              <div className="space-y-6">
                <div className="pb-4 border-b border-misty/20">
                  <div className="flex items-center gap-2 text-xs text-midnight-muted mb-1">
                    <Calendar size={13} className="text-rosewood" />
                    <span>Session Date: <strong>{selectedNote.sessionDate}</strong></span>
                    <span>•</span>
                    <span>Curated by {therapist.name}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-midnight">
                    {selectedNote.title}
                  </h2>
                </div>

                {/* Content body */}
                <div className="p-6 rounded-2xl bg-vanilla/40 border border-misty/30 text-sm text-midnight/90 leading-relaxed whitespace-pre-line font-sans">
                  {selectedNote.content?.text || selectedNote.content?.subjective || 'Note content.'}
                </div>

                <div className="p-4 rounded-2xl bg-sage-light/40 border border-sage/30 flex items-center justify-between text-xs text-midnight">
                  <span className="flex items-center gap-2">
                    <Heart size={14} className="text-rosewood" />
                    <span>Practice these tools gently throughout your week.</span>
                  </span>
                  <span className="text-sage-dark font-bold">Unfazed Sanctuary</span>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-midnight-muted">
                Select a session reflection to view takeaways.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientNotes;
