import { Navigate, Outlet } from "react-router-dom";
import { auth } from "./components/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Lottie from "lottie-react";
import animationData1 from "../src/assets/AnimationL.json";
const ProtectedRoute = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading)
    return (
      <p>
        {/* Loading... */}
        <Lottie className="w-4/5 m-auto" animationData={animationData1} />
      </p>
    );

  if (error) return <p>Error: {error.message}</p>; // Show error message

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
