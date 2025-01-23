import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged ,updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc,getDoc,onSnapshot,collection, query, where } from 'firebase/firestore';  // Add Firestore imports
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "community-513ba.firebaseapp.com",
  projectId: "community-513ba",
  storageBucket: "community-513ba.firebasestorage.app",
  messagingSenderId: "746236722149",
  appId: "1:746236722149:web:e1a75af1801efc99398d0c",
  measurementId: "G-L7L1BERJ9D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
   doc, getDoc,setDoc,
   onAuthStateChanged, onSnapshot, 
   updateProfile ,
   collection, query, where }; 
