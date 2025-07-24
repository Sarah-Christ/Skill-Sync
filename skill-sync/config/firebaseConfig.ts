import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 🔐 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDpNuY-cgIDqEc6aQxl8-vBY5uKZih4LNg",
  authDomain: "intern-project-b9372.firebaseapp.com",
  projectId: "intern-project-b9372",
  storageBucket: "intern-project-b9372.appspot.com", // ✅ fixed
  messagingSenderId: "404249829764",
  appId: "1:404249829764:web:e8d6a54a8f7c5206b63dd1",
};


// 🔥 Init App & Services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ Force Firestore to go online (fixes "client offline" error)
enableNetwork(db).catch((err) => {
  console.warn("⚠️ Failed to enable Firestore network:", err.message);
});
