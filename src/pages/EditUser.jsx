import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../components/firebase";
import Header from "../components/header";

const EditUser = () => {
  const { docId } = useParams(); // Get the docId from the URL params
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    firstName: "",
    surname: "",
    Email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch the user data when the page loads
  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = doc(db, "users", docId);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };

    fetchUserData();
  }, [docId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Update the user data
  const handleSave = async () => {
    setSaving(true);
    const userDoc = doc(db, "users", docId);
    await updateDoc(userDoc, userData);
    setSaving(false);
    navigate("/users"); // Redirect to users page after saving
  };

  // Cancel the edit and go back to users page
  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white py-20 px-4">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block">
                <div className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-indigo-200 mt-4">Loading user data...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent mb-2">
                Edit User
              </h1>
              <p className="text-indigo-200">Update user information</p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-slate-900/50 border border-indigo-500/20 rounded-2xl p-8 backdrop-blur-sm space-y-8"
            >
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-indigo-200">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-indigo-500/30 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 backdrop-blur-sm"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-indigo-200">
                  Last Name
                </label>
                <input
                  type="text"
                  name="surname"
                  value={userData.surname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-indigo-500/30 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 backdrop-blur-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-indigo-200">
                  Email Address
                </label>
                <input
                  type="email"
                  name="Email"
                  value={userData.Email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-indigo-500/30 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 backdrop-blur-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition duration-200 ${
                    saving
                      ? "bg-slate-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:scale-95 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 text-white"
                  }`}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-400 hover:to-slate-500 active:scale-95 shadow-lg hover:shadow-2xl transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default EditUser;
