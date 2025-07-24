"use client";

import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = async ({ email, password }) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore (users/{uid})
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        skillsOffered: [],
        skillsToLearn: [],
      });

      alert("Account created successfully!");
      router.push("/login");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("Email already in use");
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Signup</h2>
        <p style={styles.subtitle}>Create your account</p>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <label>Email</label>
          <input
            type="email"
            autoComplete="off"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            style={styles.input}
          />
          {errors.email && (
            <p style={styles.error}>{errors.email.message}</p>
          )}

          <label>Password</label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            style={styles.input}
          />
          {errors.password && (
            <p style={styles.error}>{errors.password.message}</p>
          )}

          <button type="submit" style={styles.button}>
            Create Account
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account?{" "}
          <a href="/login" style={{ textDecoration: "underline" }}>
            Login
          </a>
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
    fontFamily: "'Poppins', sans-serif",
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
    marginBottom: "12px",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#444",
  },
  input: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "15px",
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
    marginTop: "-10px",
    marginBottom: "10px",
    fontSize: "14px",
  },
};
