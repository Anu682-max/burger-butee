// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your own Firebase project credentials
// You should use environment variables to store your Firebase config
const firebaseConfig = {
  projectId: "studio-8825636989-becf3",
  appId: "1:906350461244:web:540d5e3497cd210ad51e39",
  storageBucket: "studio-8825636989-becf3.firebasestorage.app",
  apiKey: "AIzaSyCcL5XzgomW1w7VyiE7VarxolJAtqvCDcA",
  authDomain: "studio-8825636989-becf3.firebaseapp.com",
  messagingSenderId: "906350461244"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
