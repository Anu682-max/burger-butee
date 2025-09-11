
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your own Firebase project credentials
// You should use environment variables to store your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAqYSQ4AJiqxGlHIQi4eeQrRf446ff-z1A",
  authDomain: "burger-butee-6a064.firebaseapp.com",
  projectId: "burger-butee-6a064",
  storageBucket: "burger-butee-6a064.firebasestorage.app",
  messagingSenderId: "896887483592",
  appId: "1:896887483592:web:7d1789ac33d688994ac9fd"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
