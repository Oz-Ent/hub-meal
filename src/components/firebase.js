import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
    apiKey: "AIzaSyC5VSSVNKZg9rYs6hQ4MdeURpX067QQ0-k",
    authDomain: "hub-meal.firebaseapp.com",
    databaseURL: "https://DATABASE_NAME.firebaseio.com",
    projectId: "hub-meal",
    storageBucket: "hub-meal.firebasestorage.app",
    messagingSenderId: "536258794391",
    appId: "1:536258794391:web:202dcc50b6c0129c562ad2",
    measurementId: "G-MEASUREMENT_ID",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  // const db = getFirestore(auth);

  export { app, auth};