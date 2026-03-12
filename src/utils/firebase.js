import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1rcDW9Ul_r-4kGtGrn7K6FE046H6GQ98",
  authDomain: "admissionform-b8303.firebaseapp.com",
  projectId: "admissionform-b8303",
  storageBucket: "admissionform-b8303.firebasestorage.app",
  messagingSenderId: "752756062160",
  appId: "1:752756062160:web:49bca305b2d552d9012bd5",
  measurementId: "G-NR92VZ6PG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
