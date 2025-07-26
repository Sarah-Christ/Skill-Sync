import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      console.log("User not logged in, redirecting...");
      navigate("/login");
      return;
    }

    const q = query(
      collection(db, "users"),
      where("email", "==", currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setUserData(data);
      } else {
        console.log("No user profile found in Firestore.");
        setUserData({ email: currentUser.email }); // fallback
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!userData) {
    return <p style={{ textAlign: "center" }}>Loading Profile...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {userData.name || "Friend"}!</h2>
      <p>Email: {userData.email}</p>
      <p>Skills to Offer: {userData.skillsToOffer || "Not set"}</p>
      <p>Skills to Learn: {userData.skillsToLearn || "Not set"}</p>
    </div>
  );
};

export default Dashboard;
