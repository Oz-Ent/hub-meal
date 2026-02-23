import { db } from "../components/firebase";
import { useState } from "react";
import Header from "../components/header";
import Lottie from "lottie-react";
import animationData1 from "../assets/AnimationL.json";
import animationData2 from "../assets/AnimationS.json";
import animationData3 from "../assets/AnimationF.json";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export default function AddUser() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const [UsersData, setUsersData] = useState({
    firstName: "",
    surname: "",
    Email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsersData({ ...UsersData, [name]: value });
  };

  //check if contacts exist
  const checkIfExists = async (dbvalue, userInput) => {
    const q = query(collection(db, "users"), where(dbvalue, "==", userInput));
    const querySnapshot = await getDocs(q);
    const existingData = querySnapshot.docs.map((doc) => doc.data());
    return existingData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setLoading(true);
    try {
      // Check if email already exists
      const emailExist = await checkIfExists("Email", UsersData.Email);
      if (emailExist.length > 0) {
        alert("Email already exists! Please use a different email.");
        setLoading(false);
        return;
      }
      const firstnameExist = await checkIfExists(
        "firstName",
        UsersData.firstName
      );
      const surnameExist = await checkIfExists("surname", UsersData.surname);

      if (firstnameExist.length > 0 && surnameExist.length > 0) {
        alert("User already exists!.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "users"), UsersData);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTimeout(() => {
          window.location.reload(); // Reload the page after 1 second
        }, 1000);
      }, 1000);
    } catch (error) {
      console.error("Error saving data: ", error);
      setLoading(false);
      setFailure(true);
      setTimeout(() => {
        setFailure(false);
        setTimeout(() => {
          window.location.reload(); // Reload the page after 1 second
        }, 1000);
      }, 3000);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white py-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="text-center mb-8">
              <Lottie
                className="w-48 mx-auto"
                animationData={animationData1}
              />
              <p className="text-indigo-200 mt-4">Adding user...</p>
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className="text-center mb-8">
              <Lottie
                className="w-48 mx-auto"
                animationData={animationData2}
              />
              <p className="text-green-300 mt-4 font-semibold">User added successfully!</p>
            </div>
          )}

          {/* Failure State */}
          {failure && (
            <div className="text-center mb-8">
              <Lottie
                className="w-48 mx-auto"
                animationData={animationData3}
              />
              <p className="text-red-300 mt-4 font-semibold">Failed to add user</p>
            </div>
          )}

          {!loading && !success && !failure && (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent mb-2">
                  Add New User
                </h1>
                <p className="text-indigo-200">Fill in all fields to create a new user account</p>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/50 rounded-lg p-6 mb-8 backdrop-blur-sm">
                <p className="text-indigo-200 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">ⓘ</span>
                  <span>Please ensure the user doesn't already exist before adding. All fields are required.</span>
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="bg-slate-900/50 border border-indigo-500/20 rounded-2xl p-8 backdrop-blur-sm space-y-8"
              >
                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-indigo-200">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={UsersData.firstName}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="Enter first name"
                    className="w-full px-4 py-3 rounded-lg border border-indigo-500/30 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 backdrop-blur-sm"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-indigo-200">
                    Last Name
                  </label>
                  <input
                    name="surname"
                    value={UsersData.surname}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="Enter last name"
                    className="w-full px-4 py-3 rounded-lg border border-indigo-500/30 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 backdrop-blur-sm"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-indigo-200">
                    Email Address
                  </label>
                  <input
                    name="Email"
                    value={UsersData.Email}
                    onChange={handleChange}
                    required
                    type="email"
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 rounded-lg border border-indigo-500/30 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 backdrop-blur-sm"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50 mt-8"
                >
                  Add User
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
