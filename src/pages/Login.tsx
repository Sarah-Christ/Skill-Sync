// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, provider } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
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

  // ✅ Email Login
  const handleEmailLogin = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", "==", email),
        where("password", "==", password)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        console.log("User logged in:", email);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Email login error:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Skill-Sync Login</h2>

      <div className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleEmailLogin}>Login with Email</button>
        <button onClick={handleGoogleLogin} className="google-button">
          Login with Google
        </button>

        <p
          style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/signup")}
        >
          Don't have an account? Sign up
        </p>
      </div>
    </div>
  );
};

export default Login;
