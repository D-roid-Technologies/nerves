// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAksjz9CXmGwYgobXG-2p1tBVtunhYND7s",
  authDomain: "nerves-f3753.firebaseapp.com",
  projectId: "nerves-f3753",
  storageBucket: "nerves-f3753.firebasestorage.app",
  messagingSenderId: "161348806684",
  appId: "1:161348806684:web:25d00c78e598c5bc5997d9",
  measurementId: "G-88HL3JK79M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);