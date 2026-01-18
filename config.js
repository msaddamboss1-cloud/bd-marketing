import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRwrekZBZ31ACszDk2EJM_IqxRRwaGfCg",
  authDomain: "bd-marketing-55a81.firebaseapp.com",
  databaseURL: "https://bd-marketing-55a81-default-rtdb.firebaseio.com",
  projectId: "bd-marketing-55a81",
  storageBucket: "bd-marketing-55a81.firebasestorage.app",
  messagingSenderId: "678696512628",
  appId: "1:678696512628:web:edfc22a62f55dad41df521",
  measurementId: "G-3CP5DC4H44"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// আপনার দেওয়া রিয়েল নম্বর ও কন্টাক্ট ডাটা
export const APP_DATA = {
    bkash: "01725780575",
    nagad: "01763584939",
    whatsapp: "01725780575",
    email: "msaddamboss1@gmail.com",
    facebook: "https://www.facebook.com/md.shddam.138680",
    tiktok: "https://www.tiktok.com/@md.saddam1060?_r=1&_t=ZS-93B154MJVlX"
};
