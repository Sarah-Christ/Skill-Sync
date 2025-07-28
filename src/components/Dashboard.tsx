import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface Skill {
  name: string;
  type: "Learn" | "Offer";
  postedBy: string;
}

const Dashboard: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setName(data.name || "");

        // Defensive: use empty arrays if undefined
        const skillsToLearn: string[] = Array.isArray(data.skillsToLearn)
          ? data.skillsToLearn
          : [];
        const skillsToOffer: string[] = Array.isArray(data.skillsToOffer)
          ? data.skillsToOffer
          : [];

        const learnSkills: Skill[] = skillsToLearn.map((skill) => ({
          name: skill,
          type: "Learn",
          postedBy: data.postedByLearn || data.name || "Unknown",
        }));

        const offerSkills: Skill[] = skillsToOffer.map((skill) => ({
          name: skill,
          type: "Offer",
          postedBy: data.postedByOffer || data.name || "Unknown",
        }));

        setSkills([...learnSkills, ...offerSkills].reverse());
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-nav">
        {/* Removed Post Button */}

        <div className="profile-container">
          <button
            className="profile-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Profile menu"
          >
            {name ? name[0].toUpperCase() : "U"}
          </button>
          {dropdownOpen && (
            <div className="dropdown">
              <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="welcome-section">
        <h1>Welcome to Skill-Sync, {name}!</h1>

        <div className="videos-row">
          <iframe
            src="https://www.youtube.com/embed/ix9cRaBkVe0"
            title="Video 1"
            allowFullScreen
          />
          <iframe
            src="https://www.youtube.com/embed/xTtL8E4LzTQ"
            title="Video 2"
            allowFullScreen
          />
          <iframe
            src="https://www.youtube.com/embed/D56hs0Twfco"
            title="Video 3"
            allowFullScreen
          />
        </div>

        <p>Here are your latest skills:</p>
      </div>

      <div className="skills-grid">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <div className="skill-card" key={index}>
              <h3>{skill.name}</h3>
              <p>
                <strong>Type:</strong> {skill.type}
              </p>
              <p>
                <strong>Posted By:</strong> {skill.postedBy}
              </p>
            </div>
          ))
        ) : (
          <p className="no-skills">No skills added yet. Go to Edit Profile!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
