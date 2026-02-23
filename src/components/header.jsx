import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { useState } from "react";
import Logo from "../../public/hm.svg";

const Header = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="fixed w-full top-0 z-40 backdrop-blur-md bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-black/80 border-b border-indigo-500/20">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-indigo-500/5 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4 flex flex-row justify-between items-center">
        {/* Logo/Title */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition duration-300">
            <img src={Logo} alt="Logo" className=" relative" />
          </div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-indigo-200 transition duration-300">
              Hub Meal
            </h2>
            <p className="text-xs text-indigo-300 group-hover:text-indigo-200 transition duration-300">
              Meal Management System
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          {/* Users Button */}
          <button
            onClick={() => navigate("/users")}
            className="px-4 py-2 rounded-lg font-semibold text-white transition duration-200 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 shadow-lg hover:shadow-indigo-500/50 flex items-center gap-2"
          >
            <span>👥</span>
            <span className="hidden sm:inline">Users</span>
          </button>

          {/* Logout Button with Confirmation */}
          <div className="relative">
            <button
              onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
              className="px-4 py-2 rounded-lg font-semibold text-white transition duration-200 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 shadow-lg hover:shadow-red-500/50 flex items-center gap-2"
            >
              <span>🚪</span>
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Logout Confirmation Popup */}
            {showLogoutConfirm && (
              <div className="absolute right-0 top-12 bg-slate-900 border border-indigo-500/30 rounded-lg shadow-2xl p-4 w-64 backdrop-blur-sm z-50">
                <p className="text-indigo-200 font-semibold mb-4 text-center">
                  Are you sure you want to logout?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition duration-200 active:scale-95"
                  >
                    Yes, Logout
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 transition duration-200 active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
