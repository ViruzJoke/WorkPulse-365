import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeKCmhY0NN2VA0yHqQS9Jr4lBIi5AAJg4",
    authDomain: "workpulse-365.firebaseapp.com",
    projectId: "workpulse-365",
    storageBucket: "workpulse-365.firebasestorage.app",
    messagingSenderId: "289186802306",
    appId: "1:289186802306:web:b3005140e698c35e01629b"
};

let app;
let auth;
let db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase initialization failed. Make sure to update src/firebase.js with your keys.", error);
}

export { auth, db };
