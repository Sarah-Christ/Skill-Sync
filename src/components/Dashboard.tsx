import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import "./Dashboard.css";

interface ProfileData {
  name: string;
  skillsToLearn: string;
  skillsToOffer: string;
  photoURL?: string;  // Add this optional field for profile image URL
}

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile({ ...(docSnap.data() as ProfileData), photoURL: user.photoURL || undefined });
        }
      } else {
        navigate("/");
      }
      setLoading(false);
    });

    function handleClickOutside(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  }

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      <div
        ref={avatarRef}
        className="profile-avatar"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title="Profile menu"
      >
        {profile?.photoURL ? (
          <img src={profile.photoURL} alt="Profile" className="profile-image" />
        ) : (
          <span className="profile-initials">{initials}</span>
        )}
        {dropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
            <button
              onClick={() => auth.signOut().then(() => navigate("/"))}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="dashboard-container">
        <h1>Welcome to Skill-Sync{profile?.name ? `, ${profile.name}` : ""}!</h1>

        {profile ? (
          <>
            <p>
              <strong>Skills to Learn:</strong>{" "}
              {profile.skillsToLearn?.slice(-1)[0] || "None"}
            </p>
            <p>
              <strong>Skills to Offer:</strong>{" "}
              {profile.skillsToOffer?.slice(-1)[0] || "None"}
            </p>
          </>
        ) : (
          <p>No profile data found.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
