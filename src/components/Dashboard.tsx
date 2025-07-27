import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [name, setName] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>([]);
  const [skillsToOffer, setSkillsToOffer] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setSkillsToLearn(data.skillsToLearn || []);
          setSkillsToOffer(data.skillsToOffer || []);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Post Button on Top Left */}
      <button className="post-button" onClick={() => navigate("/posts")}>
        Post
      </button>

      <h1>Welcome to Skill-Sync, {name}!</h1>
      <p>
        <strong>Skills to Learn:</strong> {skillsToLearn.join(", ") || "None"}
      </p>
      <p>
        <strong>Skills to Offer:</strong> {skillsToOffer.join(", ") || "None"}
      </p>

      {/* Profile Menu on Top Right */}
      <div className="profile-menu">
        <button
          className="profile-icon"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {name.charAt(0).toUpperCase()}
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
