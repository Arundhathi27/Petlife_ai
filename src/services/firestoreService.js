import { db } from '../lib/firebase.js';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  deleteField
} from 'firebase/firestore';
import { INITIAL_PET_DATA, INITIAL_HEALTH_EVENTS } from '../data/initialData.js';

/**
 * Recursively removes any object keys with undefined values,
 * preventing Firebase setDoc/updateDoc from throwing "Unsupported field value: undefined".
 * Preserves 0, false, null, "", FieldValue sentinels (e.g. deleteField()), and empty arrays.
 */
export const sanitizeFirestorePayload = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj._methodName || (obj.constructor && obj.constructor.name === 'FieldValue') || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeFirestorePayload);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (
        value !== null && 
        typeof value === 'object' && 
        !(value instanceof Date) && 
        !value._methodName && 
        !(value.constructor && value.constructor.name === 'FieldValue')
      ) {
        sanitized[key] = sanitizeFirestorePayload(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
};

// --- PET CRUD OPERATIONS ---

export const createPet = async (userId, petData) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const petId = petData.id || `pet_${Date.now()}`;
  const petRef = doc(db, 'users', userId, 'pets', petId);
  const payload = sanitizeFirestorePayload({
    ...petData,
    id: petId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await setDoc(petRef, payload);
  return payload;
};

export const getPets = async (userId) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const petsRef = collection(db, 'users', userId, 'pets');
  const snapshot = await getDocs(petsRef);
  const pets = [];
  snapshot.forEach(docSnap => {
    pets.push({ id: docSnap.id, ...docSnap.data() });
  });
  return pets;
};

export const getPet = async (userId, petId) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const petRef = doc(db, 'users', userId, 'pets', petId);
  const snapshot = await getDoc(petRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const updatePet = async (userId, petId, petData) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const petRef = doc(db, 'users', userId, 'pets', petId);
  const payload = sanitizeFirestorePayload({
    ...petData,
    updatedAt: new Date().toISOString(),
  });
  await updateDoc(petRef, payload);
  return payload;
};

export const deletePet = async (userId, petId) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const petRef = doc(db, 'users', userId, 'pets', petId);
  await deleteDoc(petRef);
  return true;
};

// --- HEALTH EVENT CRUD OPERATIONS ---

export const createHealthEvent = async (userId, petId, eventData) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const eventId = eventData.id || `evt_${Date.now()}`;
  const eventRef = doc(db, 'users', userId, 'pets', petId, 'healthEvents', eventId);
  const payload = sanitizeFirestorePayload({
    ...eventData,
    id: eventId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await setDoc(eventRef, payload);
  return payload;
};

export const getHealthEvents = async (userId, petId) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const eventsRef = collection(db, 'users', userId, 'pets', petId, 'healthEvents');
  const snapshot = await getDocs(eventsRef);
  const events = [];
  snapshot.forEach(docSnap => {
    events.push({ id: docSnap.id, ...docSnap.data() });
  });
  events.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  return events;
};

export const getHealthEvent = async (userId, petId, eventId) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const eventRef = doc(db, 'users', userId, 'pets', petId, 'healthEvents', eventId);
  const snapshot = await getDoc(eventRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const updateHealthEvent = async (userId, petId, eventId, eventData) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const eventRef = doc(db, 'users', userId, 'pets', petId, 'healthEvents', eventId);
  const payload = sanitizeFirestorePayload({
    ...eventData,
    updatedAt: new Date().toISOString(),
  });
  await updateDoc(eventRef, payload);
  return payload;
};

export const deleteHealthEvent = async (userId, petId, eventId) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const eventRef = doc(db, 'users', userId, 'pets', petId, 'healthEvents', eventId);
  await deleteDoc(eventRef);
  return true;
};

// --- REMINDER CRUD OPERATIONS ---

export const createReminder = async (userId, petId, reminderData) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const reminderId = reminderData.id || `rem_${Date.now()}`;
  const reminderRef = doc(db, 'users', userId, 'pets', petId, 'reminders', reminderId);
  const payload = sanitizeFirestorePayload({
    completed: false,
    ...reminderData,
    id: reminderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await setDoc(reminderRef, payload);
  return payload;
};

export const getReminders = async (userId, petId) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const remindersRef = collection(db, 'users', userId, 'pets', petId, 'reminders');
  const snapshot = await getDocs(remindersRef);
  const reminders = [];
  snapshot.forEach(docSnap => {
    reminders.push({ id: docSnap.id, ...docSnap.data() });
  });
  reminders.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
  return reminders;
};

export const getReminder = async (userId, petId, reminderId) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const reminderRef = doc(db, 'users', userId, 'pets', petId, 'reminders', reminderId);
  const snapshot = await getDoc(reminderRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const updateReminder = async (userId, petId, reminderId, reminderData) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const reminderRef = doc(db, 'users', userId, 'pets', petId, 'reminders', reminderId);
  const payload = sanitizeFirestorePayload({
    ...reminderData,
    updatedAt: new Date().toISOString(),
  });
  await updateDoc(reminderRef, payload);
  return payload;
};

export const deleteReminder = async (userId, petId, reminderId) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const reminderRef = doc(db, 'users', userId, 'pets', petId, 'reminders', reminderId);
  await deleteDoc(reminderRef);
  return true;
};

// --- INITIAL USER LUNA SEED & RESET SERVICES ---

export const initializeUserLunaData = async (userId) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const setupRef = doc(db, 'users', userId, 'setup', 'initialSetup');
  const setupSnap = await getDoc(setupRef);

  // Idempotency check: if user setup doc exists, do NOT seed Luna automatically
  if (setupSnap.exists()) {
    return false;
  }

  // Seed Luna Pet Document in Firestore
  const petId = INITIAL_PET_DATA.id;
  await setDoc(doc(db, 'users', userId, 'pets', petId), sanitizeFirestorePayload({
    ...INITIAL_PET_DATA,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  // Seed 5 Luna Baseline Health Events in Firestore
  for (const evt of INITIAL_HEALTH_EVENTS) {
    await setDoc(doc(db, 'users', userId, 'pets', petId, 'healthEvents', evt.id), sanitizeFirestorePayload({
      ...evt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  // Mark Initial Setup Complete in Firestore
  await setDoc(setupRef, sanitizeFirestorePayload({
    seeded: true,
    seededAt: new Date().toISOString(),
  }));

  return true;
};

export const resetUserLunaData = async (userId) => {
  if (!db) throw new Error("Firestore instance is not initialized.");
  const petId = INITIAL_PET_DATA.id;

  // Re-seed Luna Pet Document in Firestore
  await setDoc(doc(db, 'users', userId, 'pets', petId), sanitizeFirestorePayload({
    ...INITIAL_PET_DATA,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  // Re-seed 5 Baseline Health Events in Firestore
  for (const evt of INITIAL_HEALTH_EVENTS) {
    await setDoc(doc(db, 'users', userId, 'pets', petId, 'healthEvents', evt.id), sanitizeFirestorePayload({
      ...evt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  return true;
};
