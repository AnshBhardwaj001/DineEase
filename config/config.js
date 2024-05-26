import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth , onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_rwAp5zVjPxHyb30HepioWGtQ4weVUB4",
  authDomain: "dine-ease-4ed09.firebaseapp.com",
  projectId: "dine-ease-4ed09",
  storageBucket: "dine-ease-4ed09.appspot.com",
  messagingSenderId: "208936139174",
  appId: "1:208936139174:web:b4f2c31f41e87da5637767"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);
// connectAuthEmulator(auth , "http://localhost:9099");
 

export{db , auth}