import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCI7tP5AjqSNbFP8D7NQuh-in4hXlpmcsE",
  authDomain: "usdt-78547.firebaseapp.com",
  projectId: "usdt-78547",
  storageBucket: "usdt-78547.firebasestorage.app",
  messagingSenderId: "733035565867",
  appId: "1:733035565867:web:d902fa902b3b181a5b6b6e",
  measurementId: "G-3P7K9WX8Y8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
