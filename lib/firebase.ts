import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNrtE2z_4ZBU7W0xrOZ0QHDJk9eS6rikY",
  authDomain: "usac-inventario.firebaseapp.com",
  projectId: "usac-inventario",
  storageBucket: "usac-inventario.appspot.com",
  messagingSenderId: "905930604824",
  appId: "1:905930604824:web:eb70230e33046de19e1e6d",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);