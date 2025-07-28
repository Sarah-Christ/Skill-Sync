import React, { useEffect, useState } from "react";
import "./Posts.css";

interface SkillPost {
  type: string;
  skill: string;
  postedBy: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<SkillPost[]>([]);

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("skillPosts") || "[]");
    setPosts(storedPosts.reverse());
  }, []);

  return (
    <div className="posts-container">
      <h2>All Posted Skills</h2>
      {posts.length === 0 ? (
        <p>No skills posted yet.</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post, index) => (
            <div key={index} className="post-card">
              <h3>{post.skill}</h3>
              <p><strong>Type:</strong> {post.type}</p>
              <p><strong>Posted By:</strong> {post.postedBy}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
