import React, { useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./EditProfile.css";

const EditProfile = () => {
  const user = auth.currentUser;
  const [offer, setOffer] = useState("");
  const [learn, setLearn] = useState("");

  const handleSave = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), { offer, learn });
      toast.success("Profile saved!");
    } catch (error) {
      console.error("Error saving profile", error);
      toast.error("Save failed!");
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <input
        type="text"
        placeholder="Skills you offer"
        value={offer}
        onChange={(e) => setOffer(e.target.value)}
      />
      <input
        type="text"
        placeholder="Skills you want to learn"
        value={learn}
        onChange={(e) => setLearn(e.target.value)}
      />
      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
};

export default EditProfile;
