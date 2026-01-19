
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

// ------------------------------------------------------------------
// ✅ DATABASE CONNECTED: Autoparc RolCris
// ------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyCtcyCQWsbf10uwEXwBxkyQueQhgy6r-yU",
  authDomain: "autoparc-rolcris-fba68.firebaseapp.com",
  projectId: "autoparc-rolcris-fba68",
  storageBucket: "autoparc-rolcris-fba68.firebasestorage.app",
  messagingSenderId: "765134886891",
  appId: "1:765134886891:web:7f6385a78de0fac8756bae",
  measurementId: "G-H0EDL33GJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let storage: FirebaseStorage | null = null;
try {
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase Storage not initialized (might need to be enabled in console):", error);
}

let analytics = null;
// Initialize Analytics conditionally to avoid errors in environments where it's not supported
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app);
  }
}).catch(err => {
  console.warn("Analytics not supported:", err);
});

let messaging: Messaging | null = null;
try {
  // Messaging only works in secure contexts (HTTPS) or localhost
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  }
} catch (err) {
  console.warn("Firebase Messaging failed to initialize", err);
}

export { db, auth, app, analytics, storage, messaging, getToken, onMessage };
