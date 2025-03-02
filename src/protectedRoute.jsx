import { Navigate, Outlet } from "react-router-dom";
import { auth } from "./components/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
const ProtectedRoute = () => {
  const [user] = useAuthState(auth);
  return user ? <Outlet /> : <Navigate to="/" replace />;
};
export default ProtectedRoute;
