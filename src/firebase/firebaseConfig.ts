// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCasFOKx1VXAlPtLkfy45gcx_1QoZvicCk",
  authDomain: "dashboard-2bf8a.firebaseapp.com",
  projectId: "dashboard-2bf8a",
  storageBucket: "dashboard-2bf8a.firebasestorage.app",
  messagingSenderId: "125276165924",
  appId: "1:125276165924:web:ca37de6eac70864949c5b1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider(); // ✅ ADD THIS

export { auth, db, provider };
