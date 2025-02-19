import { Link, useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "./auth";
import { useAuth } from "./authContext";
import React, { useState } from "react";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import { auth, app} from "./firebase"

const Login = () => {
  // const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate=useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password).then(
        navigate("/sort")
      )
    }
  };

  return (
    <div>
      {/* {userLoggedIn && <Navigate to={"/sort"} replace={true} />} */}
      <div>
        <Link to="/sort">Sorter</Link>
      </div>
      <div>
        <Link to="/recover">Recover</Link>
      </div>

      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center">
            <div className="mt-2">
              <h3 className="text-white-400 text-xl font-semibold sm:text-2xl">
                Welcome Back
              </h3>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600 font-bold">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 font-bold">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}

            <button
              type="submit"
              disabled={isSigningIn}
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isSigningIn
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
              }`}
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm">
            Forgot password?{" "}
            <Link to={"/recover"} className="hover:underline font-bold">
              Reset
            </Link>
          </p>
        </div>
      </main>
    </div>

    // <>
    //   <div className="bg-green-600 px-8 pt-24 pb-14 rounded-md shadow-lg shadow-gray-300">
    //     <div className="flex flex-col md:flex-row gap-2 md:gap-3 mb-3">
    //       <p>Username or Email:</p>
    //       <input type="text" className="border-2 rounded text-center" />
    //     </div>
    //     <div className="flex flex-col md:flex-row gap-2 md:gap-3 mb-10">
    //       <p>Password:</p>
    //       <input type="password" className="border-2 rounded text-center" />
    //     </div>
    //     <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-center">
    //       <button className="w-fit px-4 ">Login</button>
    //       <button className="w-fit px-4 ">Forgot password</button>
    //     </div>
    //   </div>
    // </>
  );
};

export default Login;
