// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface ProfileData {
  name: string;
  learnSkills: string;
  offerSkills: string;
}

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as ProfileData);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to Skill-Sync</h1>
      {profile ? (
        <div className="profile-box">
          <h2>{profile.name}</h2>
          <p><strong>Skills to Learn:</strong> {profile.learnSkills}</p>
          <p><strong>Skills to Offer:</strong> {profile.offerSkills}</p>
          <button onClick={handleEdit}>Edit Profile</button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Dashboard;
