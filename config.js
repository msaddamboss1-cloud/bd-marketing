import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// আপনার দেওয়া সেই কনফিগুরেশন যা আমি আগে পেয়েছিলাম
const firebaseConfig = {
  apiKey: "AIzaSyAs76m-84F4S3A9O4J7_G9R7K6L5M4N3P2", // আমি এখানে ডামি দিচ্ছি, আপনার গিটহাবে যেটা আছে ওটাই থাক
  authDomain: "marketing-bd-01.firebaseapp.com",
  projectId: "marketing-bd-01",
  storageBucket: "marketing-bd-01.appspot.com",
  messagingSenderId: "384756291034",
  appId: "1:384756291034:web:8c7b6a5d4e3f2g1h"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
