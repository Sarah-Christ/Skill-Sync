// src/pages/Signup.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "./Login.css"; // optional for styles

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skillsToOffer, setSkillsToOffer] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name,
        email,
        skillsToOffer,
        skillsToLearn,
      });
      console.log("User signed up with ID:", docRef.id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
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
        <p onClick={() => navigate("/")}>Already have an account? Login</p>
      </form>
    </div>
  );
};

export default Signup;
