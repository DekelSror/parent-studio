// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVHjW2hFKbv4kMrvOhfzfsAsQrKwa-HVA",
  authDomain: "parent-studio.firebaseapp.com",
  projectId: "parent-studio",
  storageBucket: "parent-studio.appspot.com",
  messagingSenderId: "504891427491",
  appId: "1:504891427491:web:681a7773a2c7296a820d16",
  measurementId: "G-V84D2N4FS6"
};

// Initialize Firebase
export const firebaseAuthApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseAuthApp);
export const firebaseAuth = getAuth()