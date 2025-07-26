import React from "react";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "100px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you requested doesn't exist.</p>
    </div>
  );
};

export default NotFound;

// ✅ Fix: Ensure this file is a module
export {};
