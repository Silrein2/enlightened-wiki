// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuPcVD-xSCEKJ0osXUHp0kKdI831zaAIU",
  authDomain: "enlightened-wiki-78d5d.firebaseapp.com",
  projectId: "enlightened-wiki-78d5d",
  storageBucket: "enlightened-wiki-78d5d.firebasestorage.app",
  messagingSenderId: "255615358990",
  appId: "1:255615358990:web:279f31d2cd33bf4c67445f",
  measurementId: "G-FPZVZ54N8X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app, analytics};