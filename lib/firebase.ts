// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlCiMXo6cP7GU9aPOeiaKHGP6IO_5w9WY",
  authDomain: "laundry-fcee1.firebaseapp.com",
  databaseURL: "https://laundry-fcee1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "laundry-fcee1",
  storageBucket: "laundry-fcee1.firebasestorage.app",
  messagingSenderId: "1053422233319",
  appId: "1:1053422233319:web:5ec409dc7a009f3c32a442",
  measurementId: "G-Z388877FZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);