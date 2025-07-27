// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, provider } from "../firebase/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        await addDoc(usersRef, {
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }

      console.log("User logged in:", user.email);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // ✅ Email Login (Fixed to use Firebase Auth)
  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user.email);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials. Please try again.");
      console.error("Email login error:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Skill-Sync Login</h2>
      <div className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={handleEmailLogin}>Login with Email</button>
        <button onClick={handleGoogleLogin} className="google-signin-btn">
          Login with Google
        </button>
        <p>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#7b2ff7", fontWeight: "bold" }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
