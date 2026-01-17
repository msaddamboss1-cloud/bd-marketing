// Firebase Web SDK v8 Initialization (Fixed for your Project)
var firebaseConfig = {
  apiKey: "AIzaSyDRwrekZBZ31ACszDk2EJM_IqxRRwaGfCg",
  authDomain: "bd-marketing-55a81.firebaseapp.com",
  databaseURL: "https://bd-marketing-55a81-default-rtdb.firebaseio.com",
  projectId: "bd-marketing-55a81",
  storageBucket: "bd-marketing-55a81.firebasestorage.app",
  messagingSenderId: "678696512628",
  appId: "1:678696512628:web:edfc22a62f55dad41df521",
  measurementId: "G-3CP5DC4H44"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

