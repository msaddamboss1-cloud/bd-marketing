// ১. ফায়ারবেস কনফিগারেশন (আপনার দেওয়া কি ব্যবহার করা হয়েছে)
const firebaseConfig = {
    apiKey: "AIzaSyDRwrekZBZ31ACszDk2EJM_IqxRRwaGfCg",
    authDomain: "bd-marketing-7389c.firebaseapp.com",
    projectId: "bd-marketing-7389c",
    storageBucket: "bd-marketing-7389c.appspot.com",
    messagingSenderId: "788224536214",
    appId: "1:788224536214:web:6e7464010834164f276633"
};

// ফায়ারবেস চালু করা
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ২. সিকিউরিটি গার্ড (কেউ লগইন ছাড়া ড্যাশবোর্ডে ঢুকতে পারবে না)
function checkAuth() {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "index.html"; // ইউজার না থাকলে লগইন পেজে পাঠাবে
        }
    });
}

// ৩. লগ আউট ফাংশন
function logoutUser() {
    auth.signOut().then(() => {
        alert("সফলভাবে লগ আউট হয়েছে!");
        window.location.href = "index.html";
    }).catch((error) => {
        alert("সমস্যা হয়েছে: " + error.message);
    });
}
