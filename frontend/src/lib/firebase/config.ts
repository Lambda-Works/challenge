import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAeX97Og_tnUE6pnfKG3Wdag4MvVGhuF_Q",
  authDomain: "lambda-a-269f7.firebaseapp.com",
  projectId: "lambda-a-269f7",
  storageBucket: "lambda-a-269f7.firebasestorage.app",
  messagingSenderId: "56187608420",
  appId: "1:56187608420:web:ce8af068c5c3fa0d24ee71"
};

// Initialize Firebase (Singleton pattern to avoid multiple initializations in Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
