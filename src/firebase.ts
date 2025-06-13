// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcowcIQEhs03Dp2y2u9k8JiP6wZ3P-RT0",
  authDomain: "finance-note-ba422.firebaseapp.com",
  projectId: "finance-note-ba422",
  storageBucket: "finance-note-ba422.firebasestorage.app",
  messagingSenderId: "874600060455",
  appId: "1:874600060455:web:28eb14a3d81f80f3746002",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
