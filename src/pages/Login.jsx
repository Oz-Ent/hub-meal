import { Link, useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../components/auth";
import { useState } from "react";
import reactLogo from "../../public/hm.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const user = await doSignInWithEmailAndPassword(email, password);
        if (user) {
          console.log("User:", user);
          navigate("/");
        }
      } catch (error) {
        setErrorMessage("Incorrect email or password. Please try again.");
        console.log("Error message:", error.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 relative">
      {/* Animated Background with Futuristic Design */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-black"></div>

        {/* Animated Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Meal Grid Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Decorative Meal Icons */}
        <div className="absolute top-10 left-10 text-white opacity-10 text-6xl">
          🍽️
        </div>
        <div className="absolute bottom-20 right-10 text-white opacity-10 text-6xl">
          🥘
        </div>
        <div className="absolute top-1/3 right-20 text-white opacity-10 text-5xl">
          🍴
        </div>
        <div className="absolute bottom-1/3 left-20 text-white opacity-10 text-5xl">
          🥗
        </div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left Side - Branding with Futuristic Meal Design */}
            <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-black p-12 relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-30">
                <div
                  className="absolute top-10 right-10 w-32 h-32 rounded-full border-2 border-cyan-500/30 animate-spin"
                  style={{ animationDuration: "20s" }}
                ></div>
                <div
                  className="absolute bottom-20 left-10 w-24 h-24 rounded-full border-2 border-purple-500/30 animate-spin"
                  style={{
                    animationDuration: "15s",
                    animationDirection: "reverse",
                  }}
                ></div>
              </div>

              {/* Glow effect behind logo */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>

              <div className="text-center space-y-6 relative z-10">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full blur-lg opacity-75"></div>
                    <img
                      src={reactLogo}
                      alt="Logo"
                      className="w-24 h-24 filter drop-shadow-lg relative"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                    Hub Meal
                  </h2>
                  <p className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-lg mt-2">
                    The Future of Meal Management
                  </p>
                </div>
                <p className="text-indigo-200 text-lg">
                  Manage your meals effortlessly
                </p>
                <p className="text-indigo-300 text-sm leading-relaxed">
                  Sign in to access your personalized meal management dashboard
                </p>

                {/* Floating meal icons animation */}
                <div className="pt-4 flex justify-center gap-6">
                  <div className="text-3xl animate-bounce">🍽️</div>
                  <div
                    className="text-3xl animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  >
                    🥘
                  </div>
                  <div
                    className="text-3xl animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  >
                    🍴
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mr-48 -mt-48"></div>

              <div className="space-y-8 relative z-10">
                {/* Mobile Logo */}
                <div className="md:hidden text-center">
                  <div className="flex justify-center mb-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full blur-lg opacity-50 w-20 h-20 mx-auto"></div>
                    <img
                      src={reactLogo}
                      alt="Logo"
                      className="w-16 h-16 relative"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                      Hub Meal
                    </h2>
                    <p className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-sm mt-1">
                      The Future of Meals
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                    Welcome Back
                  </h3>
                  <p className="text-indigo-200">Sign in to your account</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-indigo-200">
                      Email Address
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-lg border border-indigo-500/30 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 backdrop-blur-sm"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-indigo-200">
                      Password
                    </label>
                    <input
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 rounded-lg border border-indigo-500/30 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 backdrop-blur-sm"
                    />
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
                      <p className="text-red-200 text-sm font-medium">
                        {errorMessage}
                      </p>
                    </div>
                  )}

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isSigningIn}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 relative overflow-hidden group ${
                      isSigningIn
                        ? "bg-slate-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50"
                    }`}
                  >
                    <span className="relative z-10">
                      {isSigningIn ? "Signing In..." : "Sign In"}
                    </span>
                  </button>
                </form>

                {/* Footer Link */}
                <div className="text-center">
                  <p className="text-indigo-200 text-sm">
                    Forgot your password?{" "}
                    <Link
                      to="/recover"
                      className="text-cyan-400 font-semibold hover:text-cyan-300 transition relative"
                    >
                      Reset it here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
