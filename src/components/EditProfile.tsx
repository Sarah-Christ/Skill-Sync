import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile: React.FC = () => {
  const [name, setName] = useState("");
  const [postedByLearn, setPostedByLearn] = useState("");
  const [postedByOffer, setPostedByOffer] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>([]);
  const [skillsToOffer, setSkillsToOffer] = useState<string[]>([]);
  const [newLearnSkill, setNewLearnSkill] = useState("");
  const [newOfferSkill, setNewOfferSkill] = useState("");
  const [showLearnInput, setShowLearnInput] = useState(false);
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [draggedSkill, setDraggedSkill] = useState<{ type: string; skill: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const learnSectionRef = useRef<HTMLDivElement>(null);
  const offerSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setPostedByLearn(data.postedByLearn || "");
          setPostedByOffer(data.postedByOffer || "");
          setSkillsToLearn(Array.isArray(data.skillsToLearn) ? data.skillsToLearn : []);
          setSkillsToOffer(Array.isArray(data.skillsToOffer) ? data.skillsToOffer : []);
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
        postedByLearn,
        postedByOffer,
        skillsToLearn,
        skillsToOffer,
      });

      // ✅ Save skills to localStorage for Posts page
      const skillPosts = JSON.parse(localStorage.getItem("skillPosts") || "[]");

      const newPosts = [
        ...skillsToLearn.map((skill) => ({
          type: "Learn",
          skill,
          postedBy: postedByLearn || name || "Anonymous",
        })),
        ...skillsToOffer.map((skill) => ({
          type: "Offer",
          skill,
          postedBy: postedByOffer || name || "Anonymous",
        })),
      ];

      localStorage.setItem("skillPosts", JSON.stringify([...skillPosts, ...newPosts]));

      navigate("/dashboard");
    }
  };

  const handleCancelEdit = () => {
    navigate("/dashboard");
  };

  const addLearnSkill = () => {
    const trimmed = newLearnSkill.trim();
    if (trimmed && !skillsToLearn.includes(trimmed)) {
      setSkillsToLearn([...skillsToLearn, trimmed]);
    }
    setNewLearnSkill("");
    setShowLearnInput(false);
  };

  const addOfferSkill = () => {
    const trimmed = newOfferSkill.trim();
    if (trimmed && !skillsToOffer.includes(trimmed)) {
      setSkillsToOffer([...skillsToOffer, trimmed]);
    }
    setNewOfferSkill("");
    setShowOfferInput(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      showLearnInput &&
      learnSectionRef.current &&
      !learnSectionRef.current.contains(e.target as Node) &&
      newLearnSkill === ""
    ) {
      setShowLearnInput(false);
    }
    if (
      showOfferInput &&
      offerSectionRef.current &&
      !offerSectionRef.current.contains(e.target as Node) &&
      newOfferSkill === ""
    ) {
      setShowOfferInput(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleDragStart = (type: string, skill: string) => {
    setDraggedSkill({ type, skill });
  };

  const handleDrop = () => {
    if (draggedSkill) {
      setShowModal(true);
    }
  };

  const confirmDelete = () => {
    if (draggedSkill) {
      if (draggedSkill.type === "learn") {
        setSkillsToLearn((prev) => prev.filter((s) => s !== draggedSkill.skill));
      } else {
        setSkillsToOffer((prev) => prev.filter((s) => s !== draggedSkill.skill));
      }
      setDraggedSkill(null);
    }
    setShowModal(false);
  };

  const cancelDelete = () => {
    setDraggedSkill(null);
    setShowModal(false);
  };

  return (
    <div className="edit-container">
      <button className="close-button" onClick={handleCancelEdit}>✖</button>
      <h2>Edit Your Profile</h2>

      <input
        type="text"
        className="name-input"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Skills to Learn */}
      <div className="skills-section" ref={learnSectionRef}>
        <h3>🧠 Skills to Learn</h3>
        <div className="skills-box">
          {skillsToLearn.map((skill, idx) => (
            <span
              key={idx}
              className="skill-chip"
              draggable
              onDragStart={() => handleDragStart("learn", skill)}
            >
              {skill}
            </span>
          ))}
        </div>
        {showLearnInput ? (
          <>
            <div className="input-row">
              <input
                type="text"
                placeholder="Add a skill to learn"
                value={newLearnSkill}
                onChange={(e) => setNewLearnSkill(e.target.value)}
              />
              <button className="icon-button" onClick={addLearnSkill}>✔</button>
            </div>
            <input
              type="text"
              className="posted-input"
              placeholder="Posted By"
              value={postedByLearn}
              onChange={(e) => setPostedByLearn(e.target.value)}
            />
          </>
        ) : (
          <div className="input-row">
            <button className="add-toggle" onClick={() => setShowLearnInput(true)}>+</button>
            <div className="trash-dropzone" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>🗑️</div>
          </div>
        )}
      </div>

      {/* Skills to Offer */}
      <div className="skills-section" ref={offerSectionRef}>
        <h3>🎁 Skills to Offer</h3>
        <div className="skills-box">
          {skillsToOffer.map((skill, idx) => (
            <span
              key={idx}
              className="skill-chip"
              draggable
              onDragStart={() => handleDragStart("offer", skill)}
            >
              {skill}
            </span>
          ))}
        </div>
        {showOfferInput ? (
          <>
            <div className="input-row">
              <input
                type="text"
                placeholder="Add a skill to offer"
                value={newOfferSkill}
                onChange={(e) => setNewOfferSkill(e.target.value)}
              />
              <button className="icon-button" onClick={addOfferSkill}>✔</button>
            </div>
            <input
              type="text"
              className="posted-input"
              placeholder="Posted By"
              value={postedByOffer}
              onChange={(e) => setPostedByOffer(e.target.value)}
            />
          </>
        ) : (
          <div className="input-row">
            <button className="add-toggle" onClick={() => setShowOfferInput(true)}>+</button>
            <div className="trash-dropzone" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>🗑️</div>
          </div>
        )}
      </div>

      <button className="save-button" onClick={handleSave}>Save Profile</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this skill?</p>
            <div className="modal-buttons">
              <button className="modal-confirm" onClick={confirmDelete}>Yes</button>
              <button className="modal-cancel" onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
