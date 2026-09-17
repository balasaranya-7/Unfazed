import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import {
  initStorage,
  getStoredData,
  setStoredData,
  STORAGE_KEYS
} from '../data/mockStorage';

import {
  initialTherapist,
  initialClients,
  initialAppointments,
  initialClinicalNotes,
  initialPackages,
  initialTransactions,
  initialMessages
} from '../data/mockData';

import axiosInstance from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);


// ==================================================
// STORAGE VERSION
// ==================================================

const DATA_VERSION_KEY = 'unfazed_data_version';
const DATA_VERSION = '4';


// ==================================================
// HELPERS
// ==================================================

const normalizeId = (item) => {
  if (!item) return null;

  return (
    item.id ||
    item._id ||
    null
  );
};


const normalizeClient = (client) => {
  if (!client) return null;

  const name = client.name || 'Client';

  const fallbackAvatar =
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=FFE08A&color=333333&size=200`;

  const avatar =
    client.avatar &&
    typeof client.avatar === 'string' &&
    client.avatar.trim() !== '' &&
    client.avatar !== '#' &&
    client.avatar !== 'null' &&
    client.avatar !== 'undefined'
      ? client.avatar
      : fallbackAvatar;

  return {
    ...client,

    id:
      client.id ||
      client._id ||
      null,

    avatar,

    tags:
      Array.isArray(client.tags)
        ? client.tags
        : [],

    totalSessions:
      client.totalSessions ?? 0,

    lastSession:
      client.lastSession || null,

    nextSession:
      client.nextSession || null,

    package:
      client.package || null
  };
};


// ==================================================
// GENERIC MERGE
// ==================================================

const mergeRecords = (
  defaultRecords = [],
  storedRecords = [],
  extraRecords = []
) => {
  const result = [];

  const addRecord = (record) => {
    if (!record) return;

    const recordId = normalizeId(record);

    const existingIndex = result.findIndex(
      (item) => {
        const itemId = normalizeId(item);

        if (
          itemId &&
          recordId &&
          String(itemId) === String(recordId)
        ) {
          return true;
        }

        return false;
      }
    );

    if (existingIndex === -1) {
      result.push({
        ...record
      });

      return;
    }

    result[existingIndex] = {
      ...result[existingIndex],
      ...record
    };
  };

  defaultRecords.forEach(addRecord);
  storedRecords.forEach(addRecord);
  extraRecords.forEach(addRecord);

  return result;
};


// ==================================================
// CLIENT MERGE
// ==================================================

const mergeClients = (
  defaultClients = [],
  storedClients = [],
  backendClients = []
) => {
  const result = [];

  const addClient = (client) => {
    if (!client) return;

    const normalized = normalizeClient(client);

    const clientId = normalizeId(normalized);

    const clientEmail =
      normalized.email
        ?.toLowerCase()
        ?.trim();

    const existingIndex = result.findIndex(
      (item) => {
        const itemId = normalizeId(item);

        const itemEmail =
          item.email
            ?.toLowerCase()
            ?.trim();

        const sameId =
          itemId &&
          clientId &&
          String(itemId) === String(clientId);

        const sameEmail =
          itemEmail &&
          clientEmail &&
          itemEmail === clientEmail;

        return sameId || sameEmail;
      }
    );

    if (existingIndex === -1) {
      result.push(normalized);
      return;
    }

    const existing = result[existingIndex];

    result[existingIndex] = {
      ...existing,
      ...Object.fromEntries(
        Object.entries(normalized).filter(
          ([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== ''
        )
      )
    };

    result[existingIndex].id =
      existing.id ||
      normalized.id ||
      normalized._id;

    if (
      !result[existingIndex].avatar ||
      result[existingIndex].avatar === '#'
    ) {
      result[existingIndex].avatar =
        normalized.avatar;
    }
  };

  // Original demo clients
  defaultClients.forEach(addClient);

  // Existing local clients
  storedClients.forEach(addClient);

  // MongoDB clients
  backendClients.forEach(addClient);

  return result;
};


// ==================================================
// SAFE ARRAY LOADER
// ==================================================

const loadArray = (
  key,
  fallback
) => {
  const stored =
    getStoredData(
      key,
      null
    );

  if (!Array.isArray(stored)) {
    setStoredData(
      key,
      [...fallback]
    );

    return [...fallback];
  }

  if (stored.length === 0) {
    setStoredData(
      key,
      [...fallback]
    );

    return [...fallback];
  }

  return stored;
};


// ==================================================
// INITIAL DATA REPAIR
// ==================================================

const initializeDataStore = () => {
  initStorage();

  const storedClients =
    getStoredData(
      STORAGE_KEYS.CLIENTS,
      []
    );

  const storedAppointments =
    getStoredData(
      STORAGE_KEYS.APPOINTMENTS,
      []
    );

  const storedNotes =
    getStoredData(
      STORAGE_KEYS.NOTES,
      []
    );

  const storedPackages =
    getStoredData(
      STORAGE_KEYS.PACKAGES,
      []
    );

  const storedTransactions =
    getStoredData(
      STORAGE_KEYS.TRANSACTIONS,
      []
    );

  const storedMessages =
    getStoredData(
      STORAGE_KEYS.MESSAGES,
      []
    );

  const currentVersion =
    localStorage.getItem(
      DATA_VERSION_KEY
    );

  const needsRepair =
    currentVersion !== DATA_VERSION;


  // -----------------------------------------------
  // CLIENTS
  // -----------------------------------------------

  let finalClients = Array.isArray(storedClients)
    ? storedClients
    : [];

  if (needsRepair) {
    finalClients = mergeClients(
      initialClients,
      finalClients,
      []
    );

    setStoredData(
      STORAGE_KEYS.CLIENTS,
      finalClients
    );
  }


  // -----------------------------------------------
  // APPOINTMENTS
  // -----------------------------------------------

  let finalAppointments =
    Array.isArray(storedAppointments)
      ? storedAppointments
      : [];

  if (
    needsRepair ||
    finalAppointments.length === 0
  ) {
    finalAppointments =
      mergeRecords(
        initialAppointments,
        finalAppointments,
        []
      );

    setStoredData(
      STORAGE_KEYS.APPOINTMENTS,
      finalAppointments
    );
  }


  // -----------------------------------------------
  // NOTES
  // -----------------------------------------------

  let finalNotes =
    Array.isArray(storedNotes)
      ? storedNotes
      : [];

  if (
    needsRepair ||
    finalNotes.length === 0
  ) {
    finalNotes =
      mergeRecords(
        initialClinicalNotes,
        finalNotes,
        []
      );

    setStoredData(
      STORAGE_KEYS.NOTES,
      finalNotes
    );
  }


  // -----------------------------------------------
  // PACKAGES
  // -----------------------------------------------

  let finalPackages =
    Array.isArray(storedPackages)
      ? storedPackages
      : [];

  if (
    needsRepair ||
    finalPackages.length === 0
  ) {
    finalPackages =
      mergeRecords(
        initialPackages,
        finalPackages,
        []
      );

    setStoredData(
      STORAGE_KEYS.PACKAGES,
      finalPackages
    );
  }


  // -----------------------------------------------
  // TRANSACTIONS
  // -----------------------------------------------

  let finalTransactions =
    Array.isArray(storedTransactions)
      ? storedTransactions
      : [];

  if (
    needsRepair ||
    finalTransactions.length === 0
  ) {
    finalTransactions =
      mergeRecords(
        initialTransactions,
        finalTransactions,
        []
      );

    setStoredData(
      STORAGE_KEYS.TRANSACTIONS,
      finalTransactions
    );
  }


  // -----------------------------------------------
  // MESSAGES
  // -----------------------------------------------

  let finalMessages =
    Array.isArray(storedMessages)
      ? storedMessages
      : [];

  if (
    needsRepair ||
    finalMessages.length === 0
  ) {
    finalMessages =
      mergeRecords(
        initialMessages,
        finalMessages,
        []
      );

    setStoredData(
      STORAGE_KEYS.MESSAGES,
      finalMessages
    );
  }


  // -----------------------------------------------
  // MARK VERSION
  // -----------------------------------------------

  if (needsRepair) {
    localStorage.setItem(
      DATA_VERSION_KEY,
      DATA_VERSION
    );
  }


  return {
    clients: finalClients,
    appointments: finalAppointments,
    notes: finalNotes,
    packages: finalPackages,
    transactions: finalTransactions,
    messages: finalMessages
  };
};


// ==================================================
// PROVIDER
// ==================================================

export const DataProvider = ({
  children
}) => {

  const {
    currentTherapist,
    currentClient,
    role
  } = useAuth();


  // ==================================================
  // STATE
  // ==================================================

  const [therapist, setTherapist] =
    useState(() =>
      getStoredData(
        STORAGE_KEYS.THERAPIST,
        initialTherapist
      )
    );


  const [clients, setClients] =
    useState(() => {
      const data =
        initializeDataStore();

      return data.clients;
    });


  const [appointments, setAppointments] =
    useState(() => {
      const stored =
        getStoredData(
          STORAGE_KEYS.APPOINTMENTS,
          []
        );

      return loadArray(
        STORAGE_KEYS.APPOINTMENTS,
        initialAppointments
      );
    });


  const [notes, setNotes] =
    useState(() =>
      loadArray(
        STORAGE_KEYS.NOTES,
        initialClinicalNotes
      )
    );


  const [packages, setPackages] =
    useState(() =>
      loadArray(
        STORAGE_KEYS.PACKAGES,
        initialPackages
      )
    );


  const [transactions, setTransactions] =
    useState(() =>
      loadArray(
        STORAGE_KEYS.TRANSACTIONS,
        initialTransactions
      )
    );


  const [messages, setMessages] =
    useState(() =>
      loadArray(
        STORAGE_KEYS.MESSAGES,
        initialMessages
      )
    );


  const [toast, setToast] =
    useState(null);


  // ==================================================
  // INITIAL STORAGE
  // ==================================================

  useEffect(() => {
    const data =
      initializeDataStore();

    setClients(data.clients);

    setAppointments(
      data.appointments
    );

    setNotes(
      data.notes
    );

    setPackages(
      data.packages
    );

    setTransactions(
      data.transactions
    );

    setMessages(
      data.messages
    );

  }, []);


  // ==================================================
  // SYNC LOGGED-IN THERAPIST
  // ==================================================

  useEffect(() => {

    if (
      !currentTherapist ||
      role !== 'therapist'
    ) {
      return;
    }


    setTherapist(
      (previousTherapist) => {

        const updatedTherapist = {
          ...previousTherapist,
          ...currentTherapist,

          id:
            currentTherapist.id ||
            currentTherapist._id ||
            previousTherapist.id
        };


        setStoredData(
          STORAGE_KEYS.THERAPIST,
          updatedTherapist
        );


        return updatedTherapist;
      }
    );

  }, [
    currentTherapist,
    role
  ]);


  // ==================================================
  // LOAD BACKEND CLIENTS
  // ==================================================

  useEffect(() => {

    const loadBackendClients =
      async () => {

        // Client login should NEVER
        // load therapist client list.
        if (
          role !== 'therapist' ||
          !currentTherapist
        ) {
          return;
        }


        try {

          const response =
            await axiosInstance.get(
              '/clients'
            );


          const backendClients =
            response?.data?.clients ||
            response?.data ||
            [];


          if (
            !Array.isArray(
              backendClients
            )
          ) {
            return;
          }


          setClients(
            (previousClients) => {

              // IMPORTANT:
              // Do NOT add initialClients here.
              // They were already initialized once.
              // This prevents deleted clients
              // from coming back.
              const mergedClients =
                mergeClients(
                  [],
                  previousClients,
                  backendClients
                );


              setStoredData(
                STORAGE_KEYS.CLIENTS,
                mergedClients
              );


              return mergedClients;
            }
          );

        } catch (error) {

          console.error(
            'Failed to load clients from backend:',
            error
          );

        }
      };


    loadBackendClients();

  }, [
    role,
    currentTherapist
  ]);


  // ==================================================
  // TOAST
  // ==================================================

  const showToast = (
    message,
    type = 'success'
  ) => {

    const id =
      Date.now();


    setToast({
      id,
      message,
      type
    });


    setTimeout(() => {
      setToast(null);
    }, 3800);
  };


  // ==================================================
  // THERAPIST
  // ==================================================

  const updateTherapist =
    async (updated) => {

      const nextTherapist = {
        ...therapist,
        ...updated
      };


      setTherapist(
        nextTherapist
      );


      setStoredData(
        STORAGE_KEYS.THERAPIST,
        nextTherapist
      );


      try {

        const token =
          localStorage.getItem(
            'unfazed_auth_token'
          );


        const storedRole =
          localStorage.getItem(
            'unfazed_role'
          );


        if (
          token &&
          storedRole === 'therapist'
        ) {

          const response =
            await axiosInstance.put(
              '/therapist/profile',
              updated
            );


          const backendTherapist =
            response?.data?.therapist ||
            response?.therapist;


          if (
            backendTherapist
          ) {

            setTherapist(
              (previous) => ({
                ...previous,
                ...backendTherapist
              })
            );


            setStoredData(
              STORAGE_KEYS.THERAPIST,
              backendTherapist
            );
          }
        }

      } catch (error) {

        console.error(
          'Failed to update therapist profile:',
          error
        );
      }


      showToast(
        'Practice profile updated successfully'
      );
    };


  // ==================================================
  // ADD CLIENT
  // ==================================================

  const addClient =
    async (newClientData) => {

      const localClient = {

        id:
          `cl-${Date.now()}`,

        joinedDate:
          new Date()
            .toISOString()
            .split('T')[0],

        totalSessions:
          0,

        lastSession:
          newClientData.lastSession ||
          null,

        nextSession:
          newClientData.nextSession ||
          null,

        paymentStatus:
          newClientData.paymentStatus ||
          'Paid',

        consentSigned:
          newClientData.consentSigned ??
          true,

        consentDate:
          newClientData.consentDate ||
          new Date().toISOString(),

        avatar:
          newClientData.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            newClientData.name || 'Client'
          )}&background=FFE08A&color=333333&size=200`,

        tags:
          newClientData.tags?.length
            ? newClientData.tags
            : [
                'Individual',
                'New Client'
              ],

        status:
          newClientData.status ||
          'Active',

        package:
          newClientData.package ||
          null,

        ...newClientData
      };


      try {

        const token =
          localStorage.getItem(
            'unfazed_auth_token'
          );


        const storedRole =
          localStorage.getItem(
            'unfazed_role'
          );


        if (
          token &&
          storedRole === 'therapist'
        ) {

          const response =
            await axiosInstance.post(
              '/clients',
              {
                name:
                  newClientData.name,

                email:
                  newClientData.email,

                password:
                  newClientData.password ||
                  undefined,

                phone:
                  newClientData.phone ||
                  '',

                age:
                  newClientData.age ||
                  null,

                dateOfBirth:
                  newClientData.dateOfBirth ||
                  null,

                gender:
                  newClientData.gender ||
                  '',

                occupation:
                  newClientData.occupation ||
                  '',

                location:
                  newClientData.location ||
                  '',

                tags:
                  newClientData.tags ||
                  [],

                preferredMode:
                  newClientData.preferredMode ||
                  '',

                intakeSummary: {

                  primaryConcern:
                    newClientData.primaryConcern ||
                    '',

                  medicalHistory:
                    newClientData.medicalHistory ||
                    '',

                  emergencyContact:
                    newClientData.emergencyContact ||
                    ''
                },

                status:
                  newClientData.status ||
                  'Active',

                notes:
                  newClientData.notes ||
                  '',

                consentSigned:
                  newClientData.consentSigned ??
                  true,

                consentDate:
                  newClientData.consentDate ||
                  new Date().toISOString()
              }
            );


          const backendClient =
            response?.data?.client ||
            response?.client ||
            response?.data;


          if (backendClient) {

            const normalizedClient =
              normalizeClient({
                ...localClient,
                ...backendClient,

                id:
                  backendClient.id ||
                  backendClient._id ||
                  localClient.id
              });


            setClients(
              (previousClients) => {

                const mergedClients =
                  mergeClients(
                    [],
                    previousClients,
                    [normalizedClient]
                  );


                setStoredData(
                  STORAGE_KEYS.CLIENTS,
                  mergedClients
                );


                return mergedClients;
              }
            );


            showToast(
              `Client ${normalizedClient.name} added successfully`
            );


            return normalizedClient;
          }
        }

      } catch (error) {

        console.error(
          'Backend client creation failed:',
          error
        );

        showToast(
          'Backend unavailable. Client saved locally.',
          'error'
        );
      }


      // -----------------------------------------------
      // LOCAL FALLBACK
      // -----------------------------------------------

      setClients(
        (previousClients) => {

          const nextClients = [
            localClient,
            ...previousClients
          ];


          setStoredData(
            STORAGE_KEYS.CLIENTS,
            nextClients
          );


          return nextClients;
        }
      );


      showToast(
        `Client ${localClient.name} added successfully`
      );


      return localClient;
    };


  // ==================================================
  // DELETE CLIENT
  // ==================================================

  const deleteClient =
    async (clientId) => {

      const clientToDelete =
        clients.find(
          (client) =>
            String(client.id) ===
              String(clientId) ||
            String(client._id) ===
              String(clientId)
        );


      try {

        const token =
          localStorage.getItem(
            'unfazed_auth_token'
          );


        const storedRole =
          localStorage.getItem(
            'unfazed_role'
          );


        const backendId =
          clientToDelete?._id ||
          clientId;


        if (
          token &&
          storedRole === 'therapist' &&
          backendId &&
          !String(backendId).startsWith('cl-')
        ) {

          await axiosInstance.delete(
            `/clients/${backendId}`
          );
        }

      } catch (error) {

        console.error(
          'Backend client deletion failed:',
          error
        );
      }


      const idsToRemove = [
        clientId,
        clientToDelete?.id,
        clientToDelete?._id
      ]
        .filter(Boolean)
        .map(String);


      const nextClients =
        clients.filter(
          (client) =>
            !idsToRemove.includes(
              String(client.id)
            ) &&
            !idsToRemove.includes(
              String(client._id)
            )
        );


      const nextAppointments =
        appointments.filter(
          (appointment) =>
            !idsToRemove.includes(
              String(appointment.clientId)
            )
        );


      const nextNotes =
        notes.filter(
          (note) =>
            !idsToRemove.includes(
              String(note.clientId)
            )
        );


      const nextMessages =
        messages.filter(
          (message) =>
            !idsToRemove.includes(
              String(message.clientId)
            )
        );


      const nextTransactions =
        transactions.filter(
          (transaction) =>
            !idsToRemove.includes(
              String(transaction.clientId)
            )
        );


      setClients(
        nextClients
      );

      setAppointments(
        nextAppointments
      );

      setNotes(
        nextNotes
      );

      setMessages(
        nextMessages
      );

      setTransactions(
        nextTransactions
      );


      setStoredData(
        STORAGE_KEYS.CLIENTS,
        nextClients
      );

      setStoredData(
        STORAGE_KEYS.APPOINTMENTS,
        nextAppointments
      );

      setStoredData(
        STORAGE_KEYS.NOTES,
        nextNotes
      );

      setStoredData(
        STORAGE_KEYS.MESSAGES,
        nextMessages
      );

      setStoredData(
        STORAGE_KEYS.TRANSACTIONS,
        nextTransactions
      );


      showToast(
        clientToDelete
          ? `${clientToDelete.name} and related records deleted`
          : 'Client and related records deleted'
      );
    };


  // ==================================================
  // UPDATE CLIENT
  // ==================================================

  const updateClient =
    async (
      clientId,
      updates
    ) => {

      const existingClient =
        clients.find(
          (client) =>
            String(client.id) ===
              String(clientId) ||
            String(client._id) ===
              String(clientId)
        );


      try {

        const token =
          localStorage.getItem(
            'unfazed_auth_token'
          );


        const storedRole =
          localStorage.getItem(
            'unfazed_role'
          );


        const backendId =
          existingClient?._id ||
          clientId;


        if (
          token &&
          storedRole === 'therapist' &&
          backendId &&
          !String(backendId).startsWith('cl-')
        ) {

          /*
           IMPORTANT FIX:

           Previously only `updates` was sent.

           Example:
           updateClient(id, {
             nextSession: '...'
           })

           Backend then received no name/email/etc.
           and could overwrite existing fields.

           Now we send the existing client data
           together with the updates.
          */

          const backendPayload = {
            name:
              updates.name ??
              existingClient?.name,

            email:
              updates.email ??
              existingClient?.email,

            phone:
              updates.phone ??
              existingClient?.phone ??
              '',

            age:
              updates.age ??
              existingClient?.age ??
              null,

            dateOfBirth:
              updates.dateOfBirth ??
              existingClient?.dateOfBirth ??
              null,

            gender:
              updates.gender ??
              existingClient?.gender ??
              '',

            occupation:
              updates.occupation ??
              existingClient?.occupation ??
              '',

            location:
              updates.location ??
              existingClient?.location ??
              '',

            tags:
              updates.tags ??
              existingClient?.tags ??
              [],

            preferredMode:
              updates.preferredMode ??
              existingClient?.preferredMode ??
              '',

            intakeSummary:
              updates.intakeSummary ??
              existingClient?.intakeSummary ??
              {
                primaryConcern:
                  existingClient?.primaryConcern ||
                  '',

                medicalHistory:
                  existingClient?.medicalHistory ||
                  '',

                emergencyContact:
                  existingClient?.emergencyContact ||
                  ''
              },

            notes:
              updates.notes ??
              existingClient?.notes ??
              '',

            consentSigned:
              updates.consentSigned ??
              existingClient?.consentSigned ??
              false,

            consentDate:
              updates.consentDate ??
              existingClient?.consentDate ??
              null,

            status:
              updates.status ??
              existingClient?.status ??
              'Active',

            ...updates
          };


          const response =
            await axiosInstance.put(
              `/clients/${backendId}`,
              backendPayload
            );


          const backendClient =
            response?.data?.client ||
            response?.client ||
            response?.data;


          if (backendClient) {

            const nextClients =
              clients.map(
                (client) =>
                  String(client.id) ===
                    String(clientId) ||
                  String(client._id) ===
                    String(clientId)
                    ? normalizeClient({
                        ...client,
                        ...updates,
                        ...backendClient,

                        id:
                          backendClient.id ||
                          backendClient._id ||
                          client.id
                      })
                    : client
              );


            setClients(
              nextClients
            );


            setStoredData(
              STORAGE_KEYS.CLIENTS,
              nextClients
            );


            showToast(
              'Client details updated'
            );


            return;
          }
        }

      } catch (error) {

        console.error(
          'Backend client update failed:',
          error
        );
      }


      // -----------------------------------------------
      // LOCAL UPDATE
      // -----------------------------------------------

      const nextClients =
        clients.map(
          (client) =>
            String(client.id) ===
              String(clientId) ||
            String(client._id) ===
              String(clientId)
              ? normalizeClient({
                  ...client,
                  ...updates
                })
              : client
        );


      setClients(
        nextClients
      );


      setStoredData(
        STORAGE_KEYS.CLIENTS,
        nextClients
      );


      showToast(
        'Client details updated'
      );
    };


  // ==================================================
  // APPOINTMENTS
  // ==================================================

  const addAppointment =
    (appointmentData) => {

      const newAppointment = {

        id:
          `apt-${Date.now()}`,

        status:
          'Confirmed',

        paymentStatus:
          'Paid',

        notesRecorded:
          false,

        ...appointmentData
      };


      const nextAppointments = [
        newAppointment,
        ...appointments
      ];


      setAppointments(
        nextAppointments
      );


      setStoredData(
        STORAGE_KEYS.APPOINTMENTS,
        nextAppointments
      );


      if (
        newAppointment.clientId
      ) {

        updateClient(
          newAppointment.clientId,
          {
            nextSession:
              `${newAppointment.date}T${newAppointment.startTime}:00`
          }
        );
      }


      showToast(
        `Session booked for ${newAppointment.clientName} on ${newAppointment.date}`
      );


      return newAppointment;
    };


  const updateAppointment =
    (
      appointmentId,
      updates
    ) => {

      const nextAppointments =
        appointments.map(
          (appointment) =>
            String(appointment.id) ===
              String(appointmentId) ||
            String(appointment._id) ===
              String(appointmentId)
              ? {
                  ...appointment,
                  ...updates
                }
              : appointment
        );


      setAppointments(
        nextAppointments
      );


      setStoredData(
        STORAGE_KEYS.APPOINTMENTS,
        nextAppointments
      );


      showToast(
        'Appointment updated'
      );
    };


  const deleteAppointment =
    (appointmentId) => {

      const nextAppointments =
        appointments.filter(
          (appointment) =>
            String(appointment.id) !==
              String(appointmentId) &&
            String(appointment._id) !==
              String(appointmentId)
        );


      setAppointments(
        nextAppointments
      );


      setStoredData(
        STORAGE_KEYS.APPOINTMENTS,
        nextAppointments
      );


      showToast(
        'Appointment deleted'
      );
    };


  const cancelAppointment =
    (appointmentId) => {

      const nextAppointments =
        appointments.map(
          (appointment) =>
            String(appointment.id) ===
              String(appointmentId) ||
            String(appointment._id) ===
              String(appointmentId)
              ? {
                  ...appointment,
                  status: 'Cancelled'
                }
              : appointment
        );


      setAppointments(
        nextAppointments
      );


      setStoredData(
        STORAGE_KEYS.APPOINTMENTS,
        nextAppointments
      );


      showToast(
        'Appointment cancelled'
      );
    };


  // ==================================================
  // NOTES
  // ==================================================

  const addNote =
    (noteData) => {

      const newNote = {

        id:
          `note-${Date.now()}`,

        createdAt:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),

        ...noteData
      };


      const nextNotes = [
        newNote,
        ...notes
      ];


      setNotes(
        nextNotes
      );


      setStoredData(
        STORAGE_KEYS.NOTES,
        nextNotes
      );


      showToast(
        newNote.isShared
          ? 'Shared note published to client portal'
          : 'Private clinical note saved'
      );


      return newNote;
    };


  const updateNote =
    (
      noteId,
      updates
    ) => {

      const nextNotes =
        notes.map(
          (note) =>
            String(note.id) ===
              String(noteId) ||
            String(note._id) ===
              String(noteId)
              ? {
                  ...note,
                  ...updates,

                  updatedAt:
                    new Date().toISOString()
                }
              : note
        );


      setNotes(
        nextNotes
      );


      setStoredData(
        STORAGE_KEYS.NOTES,
        nextNotes
      );


      showToast(
        'Note updated successfully'
      );
    };


  const deleteNote =
    (noteId) => {

      const nextNotes =
        notes.filter(
          (note) =>
            String(note.id) !==
              String(noteId) &&
            String(note._id) !==
              String(noteId)
        );


      setNotes(
        nextNotes
      );


      setStoredData(
        STORAGE_KEYS.NOTES,
        nextNotes
      );


      showToast(
        'Note removed'
      );
    };


  const toggleNoteShared =
    (noteId) => {

      const note =
        notes.find(
          (item) =>
            String(item.id) ===
              String(noteId) ||
            String(item._id) ===
              String(noteId)
        );


      if (!note) {
        return;
      }


      const newSharedState =
        !note.isShared;


      updateNote(
        noteId,
        {
          isShared:
            newSharedState
        }
      );


      showToast(
        newSharedState
          ? 'Note is now visible to client'
          : 'Note made strictly private'
      );
    };


  // ==================================================
  // TRANSACTIONS / PAYMENTS
  // ==================================================

  const addTransaction =
    (transactionData) => {

      const newTransaction = {

        id:
          `tx-${Date.now()}`,

        invoiceNumber:
          `INV-2026-${Math.floor(
            1000 +
            Math.random() * 9000
          )}`,

        date:
          new Date()
            .toISOString()
            .split('T')[0],

        status:
          'Completed',

        receiptUrl:
          '#',

        ...transactionData
      };


      const nextTransactions = [
        newTransaction,
        ...transactions
      ];


      setTransactions(
        nextTransactions
      );


      setStoredData(
        STORAGE_KEYS.TRANSACTIONS,
        nextTransactions
      );


      showToast(
        `Payment of ₹${
          newTransaction.totalAmount ||
          newTransaction.amount ||
          0
        } recorded`
      );


      return newTransaction;
    };


  const deleteTransaction =
    (transactionId) => {

      const nextTransactions =
        transactions.filter(
          (transaction) =>
            String(transaction.id) !==
              String(transactionId) &&
            String(transaction._id) !==
              String(transactionId)
        );


      setTransactions(
        nextTransactions
      );


      setStoredData(
        STORAGE_KEYS.TRANSACTIONS,
        nextTransactions
      );


      showToast(
        'Payment record deleted'
      );
    };


  // ==================================================
  // PACKAGES
  // ==================================================

  const addPackage =
    (packageData) => {

      const newPackage = {

        id:
          `pkg-${Date.now()}`,

        status:
          'Active',

        activeClientsCount:
          0,

        ...packageData
      };


      const nextPackages = [
        ...packages,
        newPackage
      ];


      setPackages(
        nextPackages
      );


      setStoredData(
        STORAGE_KEYS.PACKAGES,
        nextPackages
      );


      showToast(
        `Package "${newPackage.name}" created`
      );


      return newPackage;
    };


  const deletePackage =
    (packageId) => {

      const nextPackages =
        packages.filter(
          (pkg) =>
            String(pkg.id) !==
              String(packageId) &&
            String(pkg._id) !==
              String(packageId)
        );


      setPackages(
        nextPackages
      );


      setStoredData(
        STORAGE_KEYS.PACKAGES,
        nextPackages
      );


      showToast(
        'Package deleted'
      );
    };


  // ==================================================
  // CHAT
  // ==================================================

  const sendMessage =
    (
      clientId,
      sender,
      text
    ) => {

      const newMessage = {

        id:
          `msg-${Date.now()}`,

        clientId,

        sender,

        text,

        timestamp:
          new Date().toISOString(),

        read:
          true
      };


      const nextMessages = [
        ...messages,
        newMessage
      ];


      setMessages(
        nextMessages
      );


      setStoredData(
        STORAGE_KEYS.MESSAGES,
        nextMessages
      );


      if (
        sender === 'client'
      ) {

        setTimeout(() => {

          const replyMessage = {

            id:
              `msg-${Date.now() + 1}`,

            clientId,

            sender:
              'therapist',

            text:
              'Thank you for reaching out! I have received your message and will review it closely. If this is urgent, remember you can always book a check-in slot.',

            timestamp:
              new Date().toISOString(),

            read:
              true
          };


          setMessages(
            (previousMessages) => {

              const updatedMessages = [
                ...previousMessages,
                replyMessage
              ];


              setStoredData(
                STORAGE_KEYS.MESSAGES,
                updatedMessages
              );


              return updatedMessages;
            }
          );

        }, 2000);
      }


      return newMessage;
    };


  // ==================================================
  // CLIENT-SPECIFIC HELPERS
  // ==================================================

  const getClientById =
    (clientId) => {

      if (!clientId) {
        return null;
      }

      return clients.find(
        (client) =>
          String(client.id) ===
            String(clientId) ||
          String(client._id) ===
            String(clientId)
      ) || null;
    };


  const getClientAppointments =
    (clientId) => {

      if (!clientId) {
        return [];
      }

      return appointments.filter(
        (appointment) =>
          String(appointment.clientId) ===
            String(clientId)
      );
    };


  const getClientNotes =
    (clientId) => {

      if (!clientId) {
        return [];
      }

      return notes.filter(
        (note) =>
          String(note.clientId) ===
            String(clientId)
      );
    };


  const getClientTransactions =
    (clientId) => {

      if (!clientId) {
        return [];
      }

      return transactions.filter(
        (transaction) =>
          String(transaction.clientId) ===
            String(clientId)
      );
    };


  const getClientMessages =
    (clientId) => {

      if (!clientId) {
        return [];
      }

      return messages.filter(
        (message) =>
          String(message.clientId) ===
            String(clientId)
      );
    };


  // ==================================================
  // LOGGED-IN CLIENT DATA
  // ==================================================

  const loggedInClient =
    role === 'client'
      ? (
          currentClient ||
          getClientById(
            currentClient?.id ||
            currentClient?._id
          )
        )
      : null;


  // ==================================================
  // PROVIDER
  // ==================================================

  return (
    <DataContext.Provider
      value={{

        // --------------------------------------------
        // THERAPIST
        // --------------------------------------------

        therapist,

        updateTherapist,


        // --------------------------------------------
        // CLIENTS
        // --------------------------------------------

        clients,

        addClient,

        updateClient,

        deleteClient,

        getClientById,


        // --------------------------------------------
        // LOGGED-IN CLIENT
        // --------------------------------------------

        currentClient:
          loggedInClient,

        loggedInClient,

        getClientAppointments,

        getClientNotes,

        getClientTransactions,

        getClientMessages,


        // --------------------------------------------
        // APPOINTMENTS
        // --------------------------------------------

        appointments,

        addAppointment,

        updateAppointment,

        cancelAppointment,

        deleteAppointment,


        // --------------------------------------------
        // NOTES
        // --------------------------------------------

        notes,

        addNote,

        updateNote,

        deleteNote,

        toggleNoteShared,


        // --------------------------------------------
        // PACKAGES
        // --------------------------------------------

        packages,

        addPackage,

        deletePackage,


        // --------------------------------------------
        // PAYMENTS
        // --------------------------------------------

        transactions,

        addTransaction,

        deleteTransaction,


        // --------------------------------------------
        // MESSAGES
        // --------------------------------------------

        messages,

        sendMessage,


        // --------------------------------------------
        // TOAST
        // --------------------------------------------

        toast,

        showToast

      }}
    >
      {children}
    </DataContext.Provider>
  );
};


// ==================================================
// HOOK
// ==================================================

export const useData = () => {

  const context =
    useContext(DataContext);


  if (!context) {

    throw new Error(
      'useData must be used within a DataProvider'
    );
  }


  return context;
};


export default DataContext;