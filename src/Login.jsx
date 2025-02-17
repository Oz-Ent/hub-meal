import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

//import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
const Login = () => {
  var firebaseConfig = {
    apiKey: "AIzaSyC5VSSVNKZg9rYs6hQ4MdeURpX067QQ0-k",
    authDomain: "hub-meal.firebaseapp.com",
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://DATABASE_NAME.firebaseio.com",
    projectId: "hub-meal",
    // The value of `storageBucket` depends on when you provisioned your default bucket (learn more)
    storageBucket: "hub-meal.firebasestorage.app",
    messagingSenderId: "536258794391",
    appId: "1:536258794391:web:202dcc50b6c0129c562ad2",
    // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
    measurementId: "G-MEASUREMENT_ID",
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

  return (
    <>
      <div className="bg-green-200 px-8 pt-24 pb-14 rounded-md shadow-lg shadow-gray-300">
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 mb-3">
          <p>Username or Email:</p>
          <input type="text" className="border-2 rounded text-center" />
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 mb-10">
          <p>Password:</p>
          <input type="password" className="border-2 rounded text-center" />
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-center">
          <button className="w-fit px-4 ">Login</button>
          <button className="w-fit px-4 ">Forgot password</button>
        </div>
      </div>
    </>
  );
};

export default Login;
