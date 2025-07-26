import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  return user ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
