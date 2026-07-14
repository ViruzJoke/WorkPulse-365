import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCArBr_lDqFw1NrmemkuFty-8HCDq9CDbQ",
    authDomain: "mywishlist-9ba95.firebaseapp.com",
    projectId: "mywishlist-9ba95",
    storageBucket: "mywishlist-9ba95.firebasestorage.app",
    messagingSenderId: "59691161836",
    appId: "1:59691161836:web:4cb2a65878d4720bf62dc9"
};

let app;
let auth;
let db;
let storage;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
} catch (error) {
    console.error("Firebase initialization failed. Make sure to update src/firebase.js with your keys.", error);
}

export { auth, db, storage };
