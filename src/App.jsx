import "./App.css";
import Login from "./pages/Login";
import Sorter from "./pages/Sorter";
import ProtectedRoute from "./protectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Recover from "./pages/Recover";
import Users from "./pages/Users";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Sorter />} />
          <Route path="/users" element={<Users />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/edituser/:docId" element={<EditUser />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/recover" element={<Recover />} />
        <Route path="*" element={<NotFound />} /> {/* 404 fallback */}
      </Routes>
    </Router>
  );
}

export default App;
