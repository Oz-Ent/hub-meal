import { Link } from "react-router-dom";
import { useState } from "react";
import { doPasswordReset } from "../components/auth";

const Recover = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    await doPasswordReset(email);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-black"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-2xl shadow-2xl p-8 border border-indigo-500/20">
          {/* Glow effect */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -z-10"></div>
          
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                Reset Password
              </h2>
              <p className="text-indigo-200 text-sm">
                Enter your email address to receive a password reset link
              </p>
            </div>

            {/* Success Message */}
            {submitted && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm">
                <p className="text-green-200 text-sm font-medium text-center">
                  ✓ Check your email for the recovery link
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
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

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50"
              >
                Send Reset Link
              </button>
            </form>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-indigo-500/20">
              <p className="text-indigo-200 text-sm">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-cyan-400 font-semibold hover:text-cyan-300 transition"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recover;
