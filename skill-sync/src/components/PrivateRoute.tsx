// src/components/PrivateRoute.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  return auth.currentUser ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
