// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiGlewJINIST9zNuavsLhxcAOzLknQtRg",
  authDomain: "flugoteste.firebaseapp.com",
  projectId: "flugoteste",
  storageBucket: "flugoteste.firebasestorage.app",
  messagingSenderId: "625867682994",
  appId: "1:625867682994:web:0902bc21fa87dfe47f45ab",
  measurementId: "G-F3TRKW4F6D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db, collection, addDoc, getDocs };
