"use client";

import React, { useEffect, useState, useRef } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { auth } from "../../config/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileBox, setShowProfileBox] = useState(false);
  const router = useRouter();
  const emailRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setSkills(docSnap.data());
          }
        });

        return () => unsubscribeFirestore();
      } else {
        router.push("/");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const scrollToEmail = () => {
    if (emailRef.current) {
      emailRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(8px);
          }
          60% {
            transform: translateY(4px);
          }
        }
      `}</style>

      <div style={styles.pageWrapper}>
        {/* Navbar */}
        <div style={styles.navbar}>
          <div style={styles.leftSection}>
            <div style={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <IoMdClose size={22} color="#fff" /> : <FaBars size={22} color="#fff" />}
            </div>
            {menuOpen && (
              <ul style={styles.mobileNavLinks}>
                <li style={styles.navItem}>All</li>
                <li style={styles.navItem}>Products</li>
                <li style={styles.navItem}>Pricing</li>
                <li style={styles.navItem}>Tools</li>
                <li style={styles.navItem}>Contact</li>
              </ul>
            )}
          </div>

          <div style={styles.rightSection}>
            {user && (
              <>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  Logout
                </button>

                {/* Profile Avatar */}
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  style={styles.profileImage}
                  onClick={() => setShowProfileBox(!showProfileBox)}
                />

                {showProfileBox && (
                  <div style={styles.profileBox}>
                    <p style={styles.userName}>{user.displayName || user.email}</p>
                    <button
                      onClick={() => {
                        router.push("/editProfile");
                        setShowProfileBox(false);
                      }}
                      style={styles.editProfileButton}
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Background Animation */}
        <div style={styles.splineWrapper}>
          <Spline scene="https://prod.spline.design/QtHlQRQS4fdCbgAt/scene.splinecode" />
        </div>

        {/* Hero Section */}
        <div style={styles.heroContent}>
          <h1 style={styles.heroHeading}>Welcome to the Dashboard! 🎉</h1>
          {skills && (
            <div style={{ color: "white", marginTop: "1rem" }}>
              <h3>Your Profile</h3>
              <p>
                <strong>Skills Offered:</strong>{" "}
                {skills.skillsOffered?.join(", ") || "None"}
              </p>
              <p>
                <strong>Skills to Learn:</strong>{" "}
                {skills.skillsToLearn?.join(", ") || "None"}
              </p>
              <button
                onClick={() => router.push("/editProfile")}
                style={styles.editButton}
              >
                Edit Profile
              </button>
            </div>
          )}
          <button onClick={scrollToEmail} style={styles.getStartedButton}>
            Get Started
          </button>
        </div>

        {/* Scroll Indicator */}
        <div style={styles.scrollIndicator} onClick={scrollToEmail}>
          <div style={styles.semiCircle} />
          <span style={styles.scrollText}>Scroll</span>
        </div>

        <div ref={emailRef} style={styles.scrollTarget}></div>
      </div>
    </>
  );
}

const styles = {
  pageWrapper: {
    position: "relative",
    height: "100vh",
    width: "100%",
    fontFamily: "Segoe UI, sans-serif",
    overflowX: "hidden",
    overflowY: "auto",
    backgroundColor: "#1c109d",
  },
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    padding: "0.6rem 1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1c109d",
    zIndex: 10,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  menuIcon: {
    cursor: "pointer",
    padding: "0.4rem",
    marginRight: "1rem",
  },
  mobileNavLinks: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "3.5rem",
    left: "1rem",
    background: "#2a1aa5",
    padding: "1rem",
    borderRadius: "10px",
    zIndex: 15,
    gap: "0.5rem",
  },
  navItem: {
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  logoutButton: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#a78bfa",
    color: "#1c109d",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
  },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    objectFit: "cover",
    border: "2px solid white",
  },
  profileBox: {
    position: "absolute",
    top: "60px",
    right: "1.5rem",
    background: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    zIndex: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  userName: {
    margin: 0,
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  editProfileButton: {
    backgroundColor: "#fcd34d",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  splineWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    top: "38vh",
    textAlign: "center",
    color: "#fff",
  },
  heroHeading: {
    fontSize: "2.8rem",
    marginBottom: "1rem",
  },
  getStartedButton: {
    backgroundColor: "#a78bfa",
    color: "#1c109d",
    padding: "0.75rem 2rem",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    marginTop: "1rem",
  },
  editButton: {
    marginTop: "1rem",
    padding: "0.6rem 1.2rem",
    backgroundColor: "#fcd34d",
    color: "#1c109d",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  scrollIndicator: {
    position: "absolute",
    top: "78vh",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 3,
    cursor: "pointer",
  },
  semiCircle: {
    width: "40px",
    height: "20px",
    borderBottom: "3px solid #a78bfa",
    borderRadius: "0 0 30px 30px",
    animation: "bounce 2s infinite",
  },
  scrollText: {
    marginTop: "8px",
    color: "#a78bfa",
    fontSize: "0.85rem",
  },
  scrollTarget: {
    height: "300px",
  },
};