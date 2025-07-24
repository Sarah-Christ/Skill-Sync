"use client";
import React, { useState } from "react";
import axios from "axios";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Buffer } from "buffer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const encodedEmail = Buffer.from(email).toString("base64");
      const encodedPassword = Buffer.from(password).toString("base64");

      await axios.post("/api/login", {
        email: encodedEmail,
        password: encodedPassword,
        token: token,
      });

      alert("Logged in successfully!");
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={{ textAlign: "center" }}>
          <h2 style={styles.title}>Login</h2>
          <div style={styles.line}></div>
          <p style={styles.subtitle}>Login to your account</p>
        </div>
        <form onSubmit={handleLogin} autoComplete="off">
          <label>Email</label>
          <input
            type="email"
            autoComplete="off"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <label>Password</label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Continue</button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
        <p style={styles.footer}>
          Don't have an account? <a href="/signup" style={{ textDecoration: "underline" }}>Create an account</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to right, black, #4832c3)",
    fontFamily: "'Poppins', sans-serif"
  },
  card: {
    backgroundColor: "#e4daf5",
    padding: "40px",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#0056b3",
    marginBottom: "11px",
    display: "inline-block",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#444",
  },
  line: {
    width: "100%",
    height: "1px",
    backgroundColor: "#ccc",
    margin: "0 auto 10px auto",
    maxWidth: "200px",
  },
  input: {
    fontFamily: "'Poppins', sans-serif",
    fontSize:"15px",
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  footer: {
    textAlign: "center",
    marginTop: "10px",
    fontSize: "14px",
    color: "#333",
  },
  error: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
  },
};
