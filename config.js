const firebaseConfig = {
    apiKey: "AIzaSyDRwrekZBZ31ACszDk2EJM_IqxRRwaGfCg",
    authDomain: "bd-marketing-7389c.firebaseapp.com",
    projectId: "bd-marketing-7389c",
    storageBucket: "bd-marketing-7389c.appspot.com",
    messagingSenderId: "788224536214",
    appId: "1:788224536214:web:6e7464010834164f276633"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
