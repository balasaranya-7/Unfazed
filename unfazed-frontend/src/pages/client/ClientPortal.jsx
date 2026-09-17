import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  Sparkles,
  Calendar,
  Clock,
  Video,
  FileText,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Heart,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatTime } from '../../utils/formatters';
import ClientNavbar from '../../components/common/ClientNavbar';
import axiosInstance from '../../api/axiosInstance';

export const ClientPortal = () => {
  const navigate = useNavigate();

  const {
    user,
    role,
    currentClient: authClient,
  } = useAuth();

  const {
    therapist: demoTherapist,
    appointments = [],
    notes = [],
  } = useData();

  const [client, setClient] = useState(
    authClient || user || null
  );

  const [clientTherapist, setClientTherapist] =
    useState(
      authClient?.therapist ||
        user?.therapist ||
        null
    );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =========================================================
  // LOAD LOGGED-IN CLIENT FROM BACKEND
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const loadClient = async () => {
      const token = localStorage.getItem(
        'unfazed_auth_token'
      );

      const storedRole = localStorage.getItem(
        'unfazed_role'
      );

      if (!token || storedRole !== 'client') {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await axiosInstance.get(
          '/clients/me'
        );

        const apiClient =
          response.data?.client || null;

        const apiTherapist =
          response.data?.therapist || null;

        if (!apiClient) {
          throw new Error(
            'Client profile was not returned'
          );
        }

        if (!mounted) return;

        /*
         * Normalize the client object.
         *
         * Different parts of the original UI may use
         * different property names, so we make sure the
         * important values always exist.
         */
        const normalizedClient = {
          ...apiClient,

          id:
            apiClient.id ||
            apiClient._id ||
            null,

          _id:
            apiClient._id ||
            apiClient.id ||
            null,

          name:
            apiClient.name ||
            apiClient.fullName ||
            apiClient.clientName ||
            '',

          email:
            apiClient.email || '',

          phone:
            apiClient.phone || '',

          age:
            apiClient.age || '',

          gender:
            apiClient.gender || '',

          occupation:
            apiClient.occupation || '',

          location:
            apiClient.location || '',

          dateOfBirth:
            apiClient.dateOfBirth || '',

          tags:
            Array.isArray(apiClient.tags)
              ? apiClient.tags
              : [],

          preferredMode:
            apiClient.preferredMode || '',

          intakeSummary:
            apiClient.intakeSummary || {
              primaryConcern: '',
              medicalHistory: '',
              emergencyContact: '',
            },

          notes:
            apiClient.notes || '',

          consentSigned:
            Boolean(apiClient.consentSigned),

          status:
            apiClient.status || 'Active',

          package:
            apiClient.package || null,

          therapist:
            apiTherapist ||
            apiClient.therapist ||
            null,
        };

        setClient(normalizedClient);

        setClientTherapist(
          apiTherapist ||
            apiClient.therapist ||
            null
        );
      } catch (err) {
        console.error(
          'Failed to load client profile:',
          err
        );

        if (!mounted) return;

        /*
         * Keep the already authenticated user as a
         * fallback so the page does not become blank.
         */
        if (authClient || user) {
          const fallbackClient =
            authClient || user;

          setClient({
            ...fallbackClient,

            id:
              fallbackClient.id ||
              fallbackClient._id ||
              null,

            _id:
              fallbackClient._id ||
              fallbackClient.id ||
              null,

            name:
              fallbackClient.name ||
              fallbackClient.fullName ||
              fallbackClient.clientName ||
              '',

            email:
              fallbackClient.email || '',

            phone:
              fallbackClient.phone || '',

            therapist:
              fallbackClient.therapist || null,
          });

          setClientTherapist(
            fallbackClient.therapist || null
          );
        } else {
          setError(
            'We could not load your client profile.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadClient();

    return () => {
      mounted = false;
    };
  }, [authClient, user]);

  // =========================================================
  // CLIENT DATA
  // =========================================================

  const clientName = useMemo(() => {
    return (
      client?.name ||
      client?.fullName ||
      client?.clientName ||
      'Client'
    );
  }, [client]);

  const firstName = useMemo(() => {
    return clientName
      .trim()
      .split(/\s+/)[0] || 'Client';
  }, [clientName]);

  // =========================================================
  // THERAPIST DATA
  // =========================================================

  const therapist = useMemo(() => {
    return (
      clientTherapist ||
      client?.therapist ||
      demoTherapist ||
      {}
    );
  }, [
    clientTherapist,
    client?.therapist,
    demoTherapist,
  ]);

  const therapistName =
    therapist?.name || 'Your Therapist';

  const therapistSlug =
    therapist?.slug || '';

  const therapistAvatar =
    therapist?.avatar ||
    therapist?.profileImage ||
    '/images/default-therapist.png';

  // =========================================================
  // CLIENT ID
  // =========================================================

  const clientId =
    client?._id ||
    client?.id ||
    '';

  // =========================================================
  // CLIENT APPOINTMENTS
  // =========================================================

  const clientAppointments = useMemo(() => {
    if (!client) return [];

    return appointments.filter((appointment) => {
      const appointmentClientId =
        appointment.clientId ||
        appointment.client?._id ||
        appointment.client?.id ||
        '';

      const appointmentClientName =
        appointment.clientName ||
        appointment.client?.name ||
        '';

      return (
        String(appointmentClientId) ===
          String(clientId) ||
        (
          appointmentClientName &&
          appointmentClientName
            .trim()
            .toLowerCase() ===
            clientName
              .trim()
              .toLowerCase()
        )
      );
    });
  }, [
    appointments,
    client,
    clientId,
    clientName,
  ]);

  // =========================================================
  // UPCOMING SESSION
  // =========================================================

  const nextSession = useMemo(() => {
    return (
      clientAppointments.find(
        (appointment) =>
          appointment.status === 'Confirmed' ||
          appointment.status === 'Scheduled'
      ) ||
      null
    );
  }, [clientAppointments]);

  // =========================================================
  // SHARED NOTES
  // =========================================================

  const sharedNotes = useMemo(() => {
    if (!client) return [];

    return notes.filter((note) => {
      const noteClientId =
        note.clientId ||
        note.client?._id ||
        note.client?.id ||
        '';

      const noteClientName =
        note.clientName ||
        note.client?.name ||
        '';

      const belongsToClient =
        String(noteClientId) ===
          String(clientId) ||
        (
          noteClientName &&
          noteClientName
            .trim()
            .toLowerCase() ===
          clientName
            .trim()
            .toLowerCase()
        );

      return (
        belongsToClient &&
        Boolean(note.isShared)
      );
    });
  }, [
    notes,
    client,
    clientId,
    clientName,
  ]);

  // =========================================================
  // PACKAGE
  // =========================================================

  const pkg = client?.package || null;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-vanilla text-midnight flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-misty/30 border-t-rosewood animate-spin mx-auto mb-4" />

          <p className="text-xs font-semibold text-midnight-muted">
            Loading your private portal...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // NO CLIENT
  // =========================================================

  if (
    role &&
    role !== 'client'
  ) {
    return (
      <div className="min-h-screen bg-vanilla flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 border border-misty/30 card-shadow text-center max-w-md">
          <Heart
            size={28}
            className="text-rosewood mx-auto mb-4"
          />

          <h2 className="text-xl font-bold font-display">
            Client Portal
          </h2>

          <p className="text-xs text-midnight-muted mt-2">
            This portal is available only for client
            accounts.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="mt-5 px-5 py-3 rounded-2xl bg-rosewood text-white text-xs font-bold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-vanilla text-midnight flex items-center justify-center font-sans p-6">
        <div className="bg-white rounded-3xl p-8 border border-misty/30 card-shadow text-center max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-rosewood/10 text-rosewood flex items-center justify-center mx-auto mb-4">
            <Heart size={24} />
          </div>

          <h2 className="text-xl font-bold font-display">
            Client profile unavailable
          </h2>

          <p className="text-xs text-midnight-muted mt-2 leading-relaxed">
            {error ||
              'We could not load your client profile.'}
          </p>

          <button
            onClick={() => {
              localStorage.removeItem(
                'unfazed_auth_token'
              );

              localStorage.removeItem(
                'unfazed_role'
              );

              navigate('/login');
            }}
            className="mt-5 px-5 py-3 rounded-2xl bg-rosewood text-white text-xs font-bold hover:bg-rosewood-hover transition"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-vanilla text-midnight flex flex-col font-sans pb-16">

      <ClientNavbar />

      <main className="max-w-6xl mx-auto w-full p-6 sm:p-10 space-y-8 flex-1">

        {/* ===================================================
            WELCOME
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blush-light via-vanilla to-sage-light p-7 sm:p-9 border border-blush/50 card-shadow"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div className="max-w-xl space-y-2">

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-rosewood text-xs font-bold uppercase tracking-wider shadow-sm border border-blush/40">
                <Heart size={12} />
                Personal Wellness Sanctuary
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-midnight tracking-tight">
                Welcome back,{' '}
                {firstName} 🌿
              </h1>

              <p className="text-xs sm:text-sm text-midnight/80 leading-relaxed">
                Here is your private space to review
                collaborative therapy takeaways, track
                sessions, and connect directly with{' '}
                {therapistName}.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-3">

              <button
                onClick={() =>
                  navigate('/client/booking')
                }
                className="px-5 py-3 rounded-2xl bg-rosewood text-white font-bold text-xs hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20 flex items-center gap-2"
              >
                <Calendar size={15} />
                <span>Book Next Session</span>
              </button>

              <button
                onClick={() =>
                  navigate('/client/chat')
                }
                className="px-4 py-3 rounded-2xl bg-white text-midnight font-semibold text-xs hover:bg-vanilla-dark/40 transition border border-misty/40 flex items-center gap-2"
              >
                <MessageCircle
                  size={15}
                  className="text-rosewood"
                />

                <span>
                  Chat with {therapistName}
                </span>
              </button>

            </div>
          </div>
        </motion.div>

        {/* ===================================================
            SESSION + PACKAGE
        =================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* UPCOMING SESSION */}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow flex flex-col justify-between"
          >
            <div>

              <div className="flex items-center justify-between pb-4 mb-5 border-b border-misty/20">

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                    Next Consultation
                  </span>

                  <h3 className="text-xl font-bold font-display text-midnight mt-0.5">
                    Upcoming Therapy Session
                  </h3>
                </div>

                {nextSession && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sage-light text-sage-dark border border-sage/40 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    {nextSession.status}
                  </span>
                )}

              </div>

              {nextSession ? (

                <div className="p-5 rounded-2xl bg-vanilla/40 border border-misty/30 space-y-4">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-blush-light border-2 border-blush flex items-center justify-center text-rosewood">
                      <HeartHandshakeIcon />
                    </div>

                    <div>

                      <h4 className="text-base font-bold text-midnight">
                        {nextSession.serviceTitle ||
                          nextSession.title ||
                          'Therapy Consultation'}
                      </h4>

                      <p className="text-xs text-midnight-muted">
                        With {therapistName}
                      </p>

                      <span className="text-[11px] text-rosewood font-semibold mt-0.5 block">
                        {nextSession.duration ||
                          '50'}{' '}
                        Mins Telehealth Consultation
                      </span>

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-misty/20 text-xs text-midnight">

                    <div className="flex items-center gap-2">
                      <Calendar
                        size={15}
                        className="text-rosewood"
                      />

                      <div>
                        <span className="text-midnight-muted block text-[10px]">
                          Date
                        </span>

                        <span className="font-bold">
                          {nextSession.date ||
                            'Not scheduled'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock
                        size={15}
                        className="text-sage-dark"
                      />

                      <div>
                        <span className="text-midnight-muted block text-[10px]">
                          Time (IST)
                        </span>

                        <span className="font-bold">
                          {nextSession.startTime
                            ? formatTime(
                                nextSession.startTime
                              )
                            : 'Not scheduled'}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

              ) : (

                <div className="py-8 text-center">
                  <Calendar
                    size={24}
                    className="text-misty mx-auto mb-3"
                  />

                  <p className="text-xs text-midnight-muted">
                    No upcoming appointments scheduled.
                  </p>

                  <button
                    onClick={() =>
                      navigate('/client/booking')
                    }
                    className="mt-4 px-4 py-2.5 rounded-xl bg-rosewood text-white text-xs font-bold"
                  >
                    Book a Session
                  </button>
                </div>

              )}

            </div>

            {nextSession &&
              nextSession.meetLink && (

                <div className="mt-6 pt-4 border-t border-misty/20 flex flex-col sm:flex-row items-center justify-between gap-3">

                  <span className="text-xs text-midnight-muted">
                    Encrypted Google Meet room is open.
                  </span>

                  <a
                    href={nextSession.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-midnight hover:bg-midnight-light text-vanilla text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <Video
                      size={14}
                      className="text-blush"
                    />

                    <span>
                      Join Video Consultation
                    </span>

                    <ExternalLink size={12} />
                  </a>

                </div>
              )}

          </motion.div>

          {/* PACKAGE */}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow flex flex-col justify-between"
          >

            <div>

              <div className="flex items-center justify-between pb-4 mb-4 border-b border-misty/20">

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                    Treatment Care Plan
                  </span>

                  <h3 className="text-xl font-bold font-display text-midnight mt-0.5">
                    Session Package
                  </h3>
                </div>

                <span className="text-xs font-bold text-rosewood bg-rosewood-light px-2.5 py-1 rounded-full">
                  {pkg
                    ? 'Active Bundle'
                    : 'Pay As You Go'}
                </span>

              </div>

              {pkg ? (

                <div className="space-y-4">

                  <div>
                    <h4 className="text-base font-bold text-midnight">
                      {pkg.title ||
                        pkg.name ||
                        'Session Package'}
                    </h4>

                    <p className="text-xs text-midnight-muted">
                      Includes personalized reflections
                      and homework guides
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-vanilla/50 border border-misty/30 space-y-2">

                    <div className="flex justify-between text-xs font-bold">

                      <span className="text-midnight-muted">
                        Progress
                      </span>

                      <span className="text-rosewood">
                        {pkg.used || 0} of{' '}
                        {pkg.total || 0}{' '}
                        Completed
                      </span>

                    </div>

                    <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-misty/20">

                      <div
                        className="bg-rosewood h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${
                            pkg.total
                              ? Math.min(
                                  100,
                                  ((pkg.used || 0) /
                                    pkg.total) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                    <div className="flex justify-between text-[11px] text-midnight-muted pt-1">

                      <span>
                        {pkg.remaining ??
                          Math.max(
                            0,
                            (pkg.total || 0) -
                              (pkg.used || 0)
                          )}{' '}
                        sessions remaining
                      </span>

                      <span>
                        Expires{' '}
                        {pkg.expiryDate ||
                          '—'}
                      </span>

                    </div>

                  </div>
                </div>

              ) : (

                <div className="py-6 text-center text-xs text-midnight-muted">
                  You are currently on pay-as-you-go
                  sessions.
                </div>

              )}

            </div>

            <div className="pt-4 border-t border-misty/20 mt-4">

              <button
                onClick={() =>
                  navigate('/client/booking')
                }
                className="w-full py-3 rounded-2xl bg-vanilla hover:bg-vanilla-dark/50 text-midnight text-xs font-bold transition flex items-center justify-center gap-1.5 border border-misty/30"
              >
                <span>
                  Renew / Purchase Package
                </span>

                <ArrowRight size={13} />
              </button>

            </div>

          </motion.div>
        </div>

        {/* ===================================================
            SHARED NOTES
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow space-y-5"
        >

          <div className="flex items-center justify-between pb-4 border-b border-misty/20">

            <div>

              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                Clinical Continuity
              </span>

              <h3 className="text-xl font-bold font-display text-midnight mt-0.5">
                Shared Session Reflections & Anchors
              </h3>

              <p className="text-xs text-midnight-muted">
                Collaborative takeaways and grounding
                exercises from your work with{' '}
                {therapistName}
              </p>

            </div>

            <button
              onClick={() =>
                navigate('/client/notes')
              }
              className="text-xs font-bold text-rosewood hover:underline flex items-center gap-1"
            >
              <span>View All Notes</span>
              <ArrowRight size={13} />
            </button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {sharedNotes
              .slice(0, 2)
              .map((note) => (

                <div
                  key={
                    note.id ||
                    note._id
                  }
                  onClick={() =>
                    navigate(
                      '/client/notes'
                    )
                  }
                  className="p-5 rounded-2xl bg-vanilla/40 border border-misty/30 hover:border-blush transition cursor-pointer card-shadow-hover space-y-2"
                >

                  <div className="flex items-center justify-between text-[11px] text-midnight-muted">

                    <span className="font-semibold text-rosewood flex items-center gap-1">
                      <BookOpen size={13} />
                      Session Reflection
                    </span>

                    <span>
                      {note.sessionDate ||
                        note.date ||
                        ''}
                    </span>

                  </div>

                  <h4 className="text-sm font-bold text-midnight line-clamp-1">
                    {note.title ||
                      'Session Reflection'}
                  </h4>

                  <p className="text-xs text-midnight/80 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {note.content?.text ||
                      note.content ||
                      note.text ||
                      'Review your therapy reflections.'}
                  </p>

                </div>
              ))}

            {sharedNotes.length === 0 && (

              <div className="md:col-span-2 py-8 text-center">

                <FileText
                  size={22}
                  className="text-misty mx-auto mb-2"
                />

                <p className="text-xs text-midnight-muted">
                  No shared reflections are
                  available yet.
                </p>

              </div>
            )}

          </div>
        </motion.div>

      </main>
    </div>
  );
};

// =========================================================
// SMALL INTERNAL ICON COMPONENT
// =========================================================

const HeartHandshakeIcon = () => {
  return (
    <Heart
      size={24}
      className="text-rosewood"
    />
  );
};

export default ClientPortal;