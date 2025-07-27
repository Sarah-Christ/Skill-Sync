// src/pages/Signup.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./Login.css";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skillsToOffer, setSkillsToOffer] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Save profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        skillsToOffer,
        skillsToLearn,
      });

      console.log("User signed up:", user.uid);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form className="auth-form" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
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
        <input
          type="text"
          placeholder="Skills to Offer"
          value={skillsToOffer}
          onChange={(e) => setSkillsToOffer(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Skills to Learn"
          value={skillsToLearn}
          onChange={(e) => setSkillsToLearn(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <p>
          Already have an account?{" "}
          <Link
            to="/"
            style={{ color: "#7b2ff7", textDecoration: "none", fontWeight: "bold" }}
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
