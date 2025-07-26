import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";

const PrivateRoute: React.FC = () => {
  const isLoggedIn = !!auth.currentUser;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
