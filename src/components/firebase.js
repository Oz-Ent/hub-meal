import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  // apiKey: "AIzaSyC5VSSVNKZg9rYs6hQ4MdeURpX067QQ0-k",
  // authDomain: "hub-meal.firebaseapp.com",
  // databaseURL: "https://DATABASE_NAME.firebaseio.com",
  // projectId: "hub-meal",
  // storageBucket: "hub-meal.firebasestorage.app",
  // messagingSenderId: "536258794391",
  // appId: "1:536258794391:web:202dcc50b6c0129c562ad2",
  // measurementId: "G-MEASUREMENT_ID",
  apiKey: "AIzaSyDJili82LJhJaTdrk0fZ797sSPj-S11FXM",
  authDomain: "hub-meal-22ba5.firebaseapp.com",
  projectId: "hub-meal-22ba5",
  storageBucket: "hub-meal-22ba5.firebasestorage.app",
  messagingSenderId: "870574543254",
  appId: "1:870574543254:web:875888f89d4d10537fcdb7",
  measurementId: "G-HKP6M06Y2G",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const db = getFirestore(auth);

export { app, auth };
