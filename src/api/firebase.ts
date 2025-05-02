// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKvX_rst1I-RoM38KTLv1RfMEbOwFYRTg",
  authDomain: "gdd-workflow-system.firebaseapp.com",
  projectId: "gdd-workflow-system",
  storageBucket: "gdd-workflow-system.firebasestorage.app",
  messagingSenderId: "939307685455",
  appId: "1:939307685455:web:b28f0c3652264e168e7c3a",
  measurementId: "G-67HZPFVYVC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);