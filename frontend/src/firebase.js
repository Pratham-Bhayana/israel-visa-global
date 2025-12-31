// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIQZVvQB8E6XfqUa4vtOqV2j4yVlAzF2I",
  authDomain: "israelvisa-1a0b3.firebaseapp.com",
  projectId: "israelvisa-1a0b3",
  storageBucket: "israelvisa-1a0b3.firebasestorage.app",
  messagingSenderId: "133321686440",
  appId: "1:133321686440:web:befdd2e93a5c7d2676319d",
  measurementId: "G-226K14F55M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
