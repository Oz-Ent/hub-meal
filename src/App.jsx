import "./App.css";
import Login from "./components/Login";
import Sorter from "./sorter";
import ProtectedRoute from "./protectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Recover from "./components/Recover";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/sort" element={<Sorter />} />
        </Route>
        <Route path="/" element={<Login />} />
        <Route path="/recover" element={<Recover />} />
      </Routes>
    </Router>
  );
}

export default App;
