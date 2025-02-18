import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
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

  export { app, auth}