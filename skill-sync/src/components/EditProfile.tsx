// src/pages/EditProfile.tsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile: React.FC = () => {
  const [name, setName] = useState("");
  const [learnSkills, setLearnSkills] = useState("");
  const [offerSkills, setOfferSkills] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setLearnSkills(data.learnSkills || "");
          setOfferSkills(data.offerSkills || "");
        }
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const profileRef = doc(db, "users", user.uid);
      await setDoc(profileRef, {
        name,
        learnSkills,
        offerSkills,
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="edit-container">
      <h2>Edit Your Profile</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Skills you want to learn"
        value={learnSkills}
        onChange={(e) => setLearnSkills(e.target.value)}
      ></textarea>
      <textarea
        placeholder="Skills you can offer"
        value={offerSkills}
        onChange={(e) => setOfferSkills(e.target.value)}
      ></textarea>
      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
};

export default EditProfile;
