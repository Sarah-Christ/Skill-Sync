"use client";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData({ ...userSnap.data(), id: user.uid });
        } else {
          alert("User data not found!");
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...userData[field]];
    updatedArray[index] = value;
    setUserData({ ...userData, [field]: updatedArray });
  };

  const addArrayItem = (field) => {
    const updatedArray = [...(userData[field] || [])];
    updatedArray.push("");
    setUserData({ ...userData, [field]: updatedArray });
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = [...userData[field]];
    updatedArray.splice(index, 1);
    setUserData({ ...userData, [field]: updatedArray });
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", userData.id);
      if (profileImage) {
        const imageRef = ref(storage, `profileImages/${userData.id}`);
        await uploadBytes(imageRef, profileImage);
        const imageURL = await getDownloadURL(imageRef);
        await updateDoc(userRef, { ...userData, profileImage: imageURL });
        setUserData((prev) => ({ ...prev, profileImage: imageURL }));
      } else {
        await updateDoc(userRef, userData);
      }
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      {userData.profileImage && (
        <img
          src={userData.profileImage}
          alt="Profile"
          style={styles.profileImage}
        />
      )}
      <h2>Edit Profile</h2>

      <div style={styles.form}>
        <label>Email</label>
        <input type="email" value={userData.email} disabled style={styles.input} />

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={userData.name || ""}
          onChange={handleChange}
          placeholder="Enter full name"
          style={styles.input}
        />

        <label>Upload New Profile Image</label>
        <input type="file" onChange={handleImageChange} />

        <button onClick={handleSave} style={styles.button}>Save</button>
      </div>

      {/* Watch Later Section */}
      <div style={styles.sectionBox}>
        <h3>Watch Later</h3>
        {(userData.watchLater || []).map((item, index) => (
          <div key={index} style={styles.arrayItem}>
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange("watchLater", index, e.target.value)}
              style={styles.input}
              placeholder="Video title or link"
            />
            <button onClick={() => removeArrayItem("watchLater", index)} style={styles.removeButton}>✕</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("watchLater")} style={styles.addButton}>+ Add Video</button>
      </div>

      {/* Selected Skills Section */}
      <div style={styles.sectionBox}>
        <h3>Selected Skills</h3>
        {(userData.skillsOffered || []).map((skill, index) => (
          <div key={index} style={styles.arrayItem}>
            <input
              type="text"
              value={skill}
              onChange={(e) => handleArrayChange("skillsOffered", index, e.target.value)}
              style={styles.input}
              placeholder="Skill"
            />
            <button onClick={() => removeArrayItem("skillsOffered", index)} style={styles.removeButton}>✕</button>
          </div>
        ))}
        <button onClick={() => addArrayItem("skillsOffered")} style={styles.addButton}>+ Add Skill</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    fontFamily: "'Poppins', sans-serif",
    maxWidth: 500,
    margin: "auto"
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    marginBottom: 30,
  },
  input: {
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 15,
    width: "100%",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: 10,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
  },
  sectionBox: {
    background: "#f1f1f1",
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: 8,
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
    marginTop: 10,
  },
  removeButton: {
    marginLeft: 8,
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: 4,
    padding: "4px 8px",
    cursor: "pointer",
  },
  arrayItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },
};
