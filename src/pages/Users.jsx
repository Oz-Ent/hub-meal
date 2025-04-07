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
    <div>
      <Header />
      <div>
        <div className=" mx-1 pt-1 md:pt-20">
          <div className=" lg:mx-[15%] xl:mx-[22%]  flex md:items-center mb-4 flex-wrap justify-center gap-2">
            <div className="flex flex-row flex-wrap items-center justify-center">
              <h2 className="mr-3 ">Filter by: </h2>
              <select
                name="filterName"
                id="filterName"
                value={filterName}
                onChange={handleFIlterChange}
              >
                <option value="">Select none</option>
                <option value="firstName">First Name</option>
                <option value="surname">Last Name</option>
                <option value="Email">Email</option>
              </select>
              <div className="rounded-2xl flex-row flex border-2 ml-3 ">
                <input
                  type="text"
                  className="mx-[0.1rem] pl-[0.35rem] focus:outline-[#E5E7EB] mt-[0.25rem] rounded-l-xl "
                  onChange={handleInput}
                  name="search"
                />
                <button
                  className="w-[2.5rem] bg-gray-100 mb-[0.2rem] hover:bg-gray-300 mr-[0.1rem] rounded-r-xl"
                  onClick={findData}
                >
                  <SearchIcon />
                </button>
              </div>
            </div>
            <button
              className="bg-blue-400  hover:bg-blue-600 text-white font-bold rounded py-1 px-2"
              onClick={resetFilter}
            >
              Reset
            </button>
            <button
              className="bg-blue-400  hover:bg-blue-600 text-white font-bold rounded py-1 px-2"
              onClick={() => navigate("/adduser")}
            >
              Add New User
            </button>
          </div>
          <table className="border-collapse border w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">First Name</th>
                <th className="border p-2">Last Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Modify / Delete</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {UsersDataList.map((UsersData, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="border p-2">{UsersData.firstName}</td>
                  <td className="border p-2">{UsersData.surname}</td>
                  <td className="border p-2">{UsersData.Email}</td>
                  <td className="border p-2 flex-row gap-1">
                    <button
                      onClick={() => navigate(`/edituser/${UsersData.docId}`)} // Redirect to edit page
                      className="text-green-500 hover:text-green-600 hover:underline"
                    >
                      <EditOutlinedIcon />
                    </button>
                    /
                    <button
                      onClick={() => deleteUser(UsersData.docId)}
                      disabled={deletingId === UsersData.docId}
                      className={`${
                        deletingId === UsersData.docId
                          ? "opacity-50 cursor-not-allowed text-red-500"
                          : "text-red-500 hover:text-red-600 hover:underline"
                      }`}
                    >
                      <DeleteForeverOutlinedIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {UsersDataList.length === 0 && (
            <p className=" text-red-400 text-[22px] font-bold text-center mt-4">
              No corresponding User found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
