import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./Posts.css";

interface UserPost {
  id: string;
  name: string;
  skillsToLearn: string[];
  skillsToOffer: string[];
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<UserPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const postsData: UserPost[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        skillsToLearn: doc.data().skillsToLearn || [],
        skillsToOffer: doc.data().skillsToOffer || [],
      }));
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  return (
    <div className="posts-container">
      <h2>All Posts</h2>
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.name}</h3>
            <p><strong>Skills to Learn:</strong> {post.skillsToLearn.join(", ")}</p>
            <p><strong>Skills to Offer:</strong> {post.skillsToOffer.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
