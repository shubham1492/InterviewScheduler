import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

// Standard Firebase Configuration Template
// Replace these values with your actual project keys from https://console.firebase.google.com/
export const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForInterviewSchedulerPro2026",
  authDomain: "interview-support-pro.firebaseapp.com",
  projectId: "interview-support-pro",
  storageBucket: "interview-support-pro.appspot.com",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:demo1234567890abcdef"
};

// Initialize Firebase App & Firestore Database
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase initialization waiting for credentials:", e);
}

export { db };

const SLOTS_COLLECTION = 'booked_slots';

/**
 * Listen to real-time updates for booked interview slots
 */
export const listenToBookedSlots = (onUpdate) => {
  if (!db) return () => {};
  try {
    const slotsRef = collection(db, SLOTS_COLLECTION);
    return onSnapshot(slotsRef, (snapshot) => {
      const bookingsMap = {};
      snapshot.forEach((docSnap) => {
        bookingsMap[docSnap.id] = docSnap.data();
      });
      onUpdate(bookingsMap);
    }, (error) => {
      console.warn("Firestore live sync (using fallback):", error.message);
    });
  } catch (e) {
    console.warn("Firebase listener fallback active");
    return () => {};
  }
};

/**
 * Save booking to Firebase Firestore
 */
export const saveBookingToFirebase = async (bookingKey, bookingData) => {
  if (!db) return;
  try {
    const docRef = doc(db, SLOTS_COLLECTION, bookingKey);
    await setDoc(docRef, bookingData);
  } catch (e) {
    console.warn("Firebase save fallback active:", e.message);
  }
};

/**
 * Delete booking from Firebase Firestore
 */
export const deleteBookingFromFirebase = async (bookingKey) => {
  if (!db) return;
  try {
    const docRef = doc(db, SLOTS_COLLECTION, bookingKey);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn("Firebase delete fallback active:", e.message);
  }
};
