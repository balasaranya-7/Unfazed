import {
  initialTherapist,
  initialClients,
  initialAppointments,
  initialClinicalNotes,
  initialPackages,
  initialTransactions,
  initialMessages,
  analyticsData
} from './mockData';

const STORAGE_KEYS = {
  THERAPIST: 'unfazed_therapist',
  CLIENTS: 'unfazed_clients',
  APPOINTMENTS: 'unfazed_appointments',
  NOTES: 'unfazed_notes',
  PACKAGES: 'unfazed_packages',
  TRANSACTIONS: 'unfazed_transactions',
  MESSAGES: 'unfazed_messages',
};

export const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
};

export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
};

export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.THERAPIST)) {
    setStoredData(STORAGE_KEYS.THERAPIST, initialTherapist);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
    setStoredData(STORAGE_KEYS.CLIENTS, initialClients);
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    setStoredData(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
    setStoredData(STORAGE_KEYS.NOTES, initialClinicalNotes);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    setStoredData(STORAGE_KEYS.PACKAGES, initialPackages);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    setStoredData(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    setStoredData(STORAGE_KEYS.MESSAGES, initialMessages);
  }
};

export { STORAGE_KEYS };
