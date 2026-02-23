import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  where,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { db } from "../components/firebase";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const Users = () => {
  const [UsersDataList, setUsersDataList] = useState([]);
  const [filterSwitch, setFIlterSwitch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterName, setFIlterName] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  });

  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      if (!filterSwitch) {
        const querySnapshot = await getDocs(collection(db, "users"));
        const UsersDataArray = querySnapshot.docs.map((doc) => ({
          docId: doc.id, // add document ID
          ...doc.data(),
        }));

        const sortedUsers = UsersDataArray.sort((a, b) => {
          const firstNameComparison = a.firstName.localeCompare(b.firstName);
          if (firstNameComparison !== 0) {
            return firstNameComparison;
          }
          // If first names are the same, sort by surname
          return a.surname.localeCompare(b.surname);
        });

        setUsersDataList(sortedUsers);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleInput = (e) => {
    setSearchText(e.target.value); //update
  };
  const handleFIlterChange = (e) => {
    setFIlterName(e.target.value); //Update the filter
  };

  // Function to fetch data from Firestore
  const findData = async () => {
    setFIlterSwitch(true);
    try {
      const usersRef = collection(db, "users");
      let q;

      if (filterName && searchText) {
        q = query(
          usersRef,
          where(filterName, ">=", searchText),
          where(filterName, "<=", searchText + "\uf8ff")
        );
      } else {
        q = usersRef;
      }
      // const q = query(
      //   collection(db, "users"),
      //   where(filterName, "==", searchText)
      // );
      const querysnapshot = await getDocs(q);
      const retreivedData = querysnapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      // Sort the retrieved data alphabetically
      const sortedData = retreivedData.sort((a, b) => {
        const firstNameComparison = a.firstName.localeCompare(b.firstName);
        if (firstNameComparison !== 0) {
          return firstNameComparison;
        }
        return a.surname.localeCompare(b.surname);
      });

      setUsersDataList(sortedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  //Reset Filter
  const resetFilter = () => {
    window.location.reload();
  };

  const deleteUser = async (docId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    setDeletingId(docId); // set the loading state

    try {
      await deleteDoc(doc(db, "users", docId));
      fetchData(); // refresh user list
    } catch (error) {
      console.error("Error deleting user: ", error);
    } finally {
      setDeletingId(null); // reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <Header />
      
      <div className="pt-20 px-4 pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent mb-2">
              User Management
            </h1>
            <p className="text-indigo-200">View, search, and manage all users</p>
          </div>

          {/* Controls */}
          <div className="bg-slate-900/50 border border-indigo-500/20 rounded-2xl p-6 mb-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Filter Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-indigo-200 mb-2">
                  Filter by:
                </label>
                <select
                  name="filterName"
                  id="filterName"
                  value={filterName}
                  onChange={handleFIlterChange}
                  className="w-full px-4 py-2 rounded-lg border border-indigo-500/30 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
                >
                  <option value="">Select none</option>
                  <option value="firstName">First Name</option>
                  <option value="surname">Last Name</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-sm font-semibold text-indigo-200 mb-2">
                  Search:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded-lg border border-indigo-500/30 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
                    onChange={handleInput}
                    name="search"
                    placeholder="Enter search term"
                  />
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg font-semibold transition duration-200 flex items-center gap-2 whitespace-nowrap"
                    onClick={findData}
                  >
                    <SearchIcon fontSize="small" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <label className="block text-sm font-semibold text-indigo-200 mb-2 w-full">
                  Actions:
                </label>
                <div className="flex gap-2 w-full">
                  <button
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 rounded-lg font-semibold transition duration-200 text-sm"
                    onClick={resetFilter}
                  >
                    Reset
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg font-semibold transition duration-200 text-sm"
                    onClick={() => navigate("/adduser")}
                  >
                    + Add User
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          {UsersDataList.length > 0 ? (
            <div className="bg-slate-900/50 border border-indigo-500/20 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/50 border-b border-indigo-500/20">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">
                        First Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">
                        Last Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">
                        Email
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-cyan-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-500/10">
                    {UsersDataList.map((UsersData, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-800/30 transition duration-200"
                      >
                        <td className="px-6 py-4 text-indigo-100">
                          {UsersData.firstName}
                        </td>
                        <td className="px-6 py-4 text-indigo-100">
                          {UsersData.surname}
                        </td>
                        <td className="px-6 py-4 text-indigo-100">
                          {UsersData.Email}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() =>
                                navigate(`/edituser/${UsersData.docId}`)
                              }
                              className="text-green-400 hover:text-green-300 transition duration-200 p-2 hover:bg-green-500/10 rounded-lg"
                              title="Edit user"
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </button>
                            <span className="text-indigo-500/30">|</span>
                            <button
                              onClick={() => deleteUser(UsersData.docId)}
                              disabled={deletingId === UsersData.docId}
                              className={`transition duration-200 p-2 rounded-lg ${
                                deletingId === UsersData.docId
                                  ? "opacity-50 cursor-not-allowed text-slate-500"
                                  : "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              }`}
                              title="Delete user"
                            >
                              <DeleteForeverOutlinedIcon fontSize="small" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer */}
              <div className="px-6 py-4 bg-slate-800/30 border-t border-indigo-500/20">
                <p className="text-sm text-indigo-300">
                  Showing <span className="font-semibold text-cyan-400">{UsersDataList.length}</span> user{UsersDataList.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-indigo-500/20 rounded-2xl p-12 text-center backdrop-blur-sm">
              <p className="text-xl font-semibold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                No users found
              </p>
              <p className="text-indigo-200 mt-2">
                Try adjusting your search filters or add a new user
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
