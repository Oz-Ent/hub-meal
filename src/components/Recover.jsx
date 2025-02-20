import { Link } from "react-router-dom";
import { useAuth } from "./authContext";
import { useState } from "react";
import { doPasswordReset } from "./auth";
const Recover = () => {

  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password) {
      await doPasswordReset(email, password).then(
        console.log("Password Reset sucessful")

      )
    }
  
  };

  return (
    <div>

      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <form onSubmit={onSubmit} className="space-y-5">
          <div>
              <label className="text-sm text-gray-600 font-bold">
                Email
              </label>
              <input
                type="email"
                autoComplete="current-email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>
            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Reset Password
            </button>
          </form>
          {/* <p className="text-center text-sm">
            <Link to={"/sort"} className="hover:underline font-bold">
              Reset
            </Link>
          </p> */}
          <p className="text-center text-sm">
            <Link to="/login" className="hover:underline font-bold">
              Back to Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Recover;
