// NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData1 from "../assets/404.json";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-black"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Content */}
      <div className="text-center space-y-8 relative z-10 max-w-2xl">
        {/* 404 Text */}
        <div className="space-y-4">
          <h1 className="text-9xl md:text-[150px] font-black bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
            Page Not Found
          </h2>
          <p className="text-indigo-200 text-lg max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Animation */}
        <div className="flex justify-center">
          <Lottie 
            className="w-80 md:w-96" 
            animationData={animationData1}
            loop={true}
          />
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-white transition duration-200 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50"
        >
          ← Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
