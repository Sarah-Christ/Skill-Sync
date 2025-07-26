// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "dashboard-2bf8a.firebaseapp.com",
  projectId: "dashboard-2bf8a",
  storageBucket: "dashboard-2bf8a.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider(); // ✅ ADD THIS

export { auth, db, provider };
