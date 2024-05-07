// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2W1TNny4DAIRrQ4E1Kz8f0F0BdLYpAQo",
  authDomain: "plawarn-6704c.firebaseapp.com",
  databaseURL:
    "https://plawarn-6704c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "plawarn-6704c",
  storageBucket: "plawarn-6704c.appspot.com",
  messagingSenderId: "483434719398",
  appId: "1:483434719398:web:d6ea0172e539226bd6ac67",
  measurementId: "G-EWFJH8009V",
};

// Initialize Firebase
let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebaseConfig;
export { firebase_app };
