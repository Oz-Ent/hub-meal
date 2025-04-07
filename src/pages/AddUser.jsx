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
      <div className="bg-[#F7F8F8] py-10 w-full mx-auto ">
        <div className="mx-[10%]  md:mx-[10%] xl:mx-[30%] 2xl:mx-[20%] xl:mt-20 top-[80px]  pb-7 sm:top-[50px] ">
          {loading && (
            <Lottie
              className="w-48 my-2 mx-auto"
              animationData={animationData1}
            />
          )}
          {success && (
            <Lottie
              className="w-48 my-2 mx-auto"
              animationData={animationData2}
            />
          )}
          {failure && (
            <Lottie
              className="w-48 my-2 mx-auto"
              animationData={animationData3}
            />
          )}
          <div className="bg-white rounded-[10px] pt-2 pb-3 mb-2 shadow-md">
            <div className="bg-[#CBCBCB] py-2 px-3 mx-5 mt-5 xl:px-4 xl:mx-7  rounded xl:text-[15px] lg:text-[12.5px] text-[14px]  font-semibold">
              <p className="">Fill all fields and submit to add a new user.</p>
              <p className="font-bold">
                Please make sure the user doesnt exist
              </p>
              <p className="">Thank you!!!</p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-8 pt-8 pb-3 px-5 bg-white  xl:mt-2 xl:pt-10 xl:px-8 rounded-[10px] shadow-md"
          >
            <div className="">
              <div className="flex flex-col gap-1 xl:gap-2 justify-center items-center">
                <label className="xl:text-[16px] text-[14px] font-bold">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={UsersData.firstName}
                  onChange={handleChange}
                  required
                  type="text"
                  className="xl:w-[400px] lg:w-[380px]  w-[200px] sm:w-[240px] bg-[#FBFBFB] border rounded focus:outline-[#CBCBCB] pl-2"
                />
              </div>
              <div className="flex flex-col gap-1 xl:gap-2 justify-center items-center mt-2 md:mt-4">
                <label className="xl:text-[16px] text-[14px] font-bold">
                  Last Name
                </label>
                <input
                  name="surname"
                  value={UsersData.surname}
                  onChange={handleChange}
                  required
                  type="text"
                  className="lg:w-[380px] xl:w-[400px] w-[200px] sm:w-[240px] bg-[#FBFBFB] border rounded focus:outline-[#CBCBCB] pl-2"
                />
              </div>
              <div className="flex flex-col gap-1 xl:gap-2 justify-center items-center mt-2 md:mt-4">
                <label className="xl:text-[16px] text-[14px] font-bold">
                  Email
                </label>
                <input
                  name="Email"
                  value={UsersData.Email}
                  onChange={handleChange}
                  required
                  type="email"
                  className="lg:w-[380px] xl:w-[400px] w-[200px] sm:w-[240px] bg-[#FBFBFB] border rounded focus:outline-[#CBCBCB] pl-2"
                />
              </div>
            </div>
            <div className="mt-24 mb-4 align-items-center justify-center flex">
              <button className="bg-[#03e452] rounded px-6 py-1" type="submit">
                Save User
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
