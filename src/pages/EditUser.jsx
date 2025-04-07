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
    const userDoc = doc(db, "users", docId);
    await updateDoc(userDoc, userData);
    navigate("/users"); // Redirect to users page after saving
  };

  // Cancel the edit and go back to users page
  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="mx-5 my-20 text-center">
          <h2>Edit User</h2>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4">
            <div className="flex flex-col gap-2 items-center justify-center text-center">
              <div className="flex flex-col gap-1 xl:gap-2 justify-center items-center mt-2 md:mt-4">
                <label className="xl:text-[16px] text-[14px] font-bold">
                  First Name:
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  required
                  className="lg:w-[380px] xl:w-[400px] w-[200px] sm:w-[240px] bg-[#FBFBFB] border rounded focus:outline-[#CBCBCB] pl-2"
                />
              </div>
              <div className="flex flex-col gap-1 xl:gap-2 justify-center items-center mt-2 md:mt-4">
                <label className="xl:text-[16px] text-[14px] font-bold">
                  Last Name:
                </label>
                <input
                  type="text"
                  name="surname"
                  value={userData.surname}
                  onChange={handleChange}
                  required
                  className="lg:w-[380px] xl:w-[400px] w-[200px] sm:w-[240px] bg-[#FBFBFB] border rounded focus:outline-[#CBCBCB] pl-2"
                />
              </div>
              <div className="flex flex-col gap-1 xl:gap-2 justify-center items-center mt-2 md:mt-4">
                <label className="xl:text-[16px] text-[14px] font-bold">
                  Email:
                </label>
                <input
                  type="email"
                  name="Email"
                  value={userData.Email}
                  onChange={handleChange}
                  required
                  className="lg:w-[380px] xl:w-[400px] w-[200px] sm:w-[240px] bg-[#FBFBFB] border rounded focus:outline-[#CBCBCB] pl-2"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditUser;
