// NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData1 from "../assets/404.json";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-5xl md:text-9xl font-bold mb-4 text-red-500">404</h1>
      <Lottie className="w-4/6" animationData={animationData1} />
      <p className="text-lg mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Go Back to Home Page
      </button>
    </div>
  );
};

export default NotFound;
