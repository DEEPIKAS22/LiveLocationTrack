import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyATUf-Yzcq0Y5sCU6fA4ZHhzaRDIopHqng",
  authDomain: "livelocationtrack-31693.firebaseapp.com",
  projectId: "livelocationtrack-31693",
  storageBucket: "livelocationtrack-31693.firebasestorage.app",
  messagingSenderId: "450540719012",
  appId: "1:450540719012:web:342fa95f56863eae0bcf31",
  measurementId: "G-2VWPDZPCMM",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const database = getDatabase(app);
