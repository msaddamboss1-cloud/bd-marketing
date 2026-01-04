// এডমিন সাদ্দাম, আপনার ফায়ারবেস কনফিগ (ভুল সংশোধন করা হয়েছে)
const firebaseConfig = {
  apiKey: "AIzaSyDRwrekZBZ31ACszDk2EJM_X9D7_H-0",
  authDomain: "bd-marketing-55a81.firebaseapp.com",
  databaseURL: "https://bd-marketing-55a81-default-rtdb.firebaseio.com",
  projectId: "bd-marketing-55a81",
  storageBucket: "bd-marketing-55a81.appspot.com",
  messagingSenderId: "678696512628",
  appId: "1:678696512628:web:edfc22a62f55dad41df521"
};

// ফায়ারবেস শুরু করার সঠিক নিয়ম (Compat Mode)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// লগইন এবং সাইন-আপ ফাংশন (handleAuth)
function handleAuth() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const authBtn = document.getElementById('authBtn');

    if (!email || !password) {
        alert("ইমেইল এবং পাসওয়ার্ড দিন");
        return;
    }

    // বাটন লোডিং টেক্সট
    if(authBtn) authBtn.innerText = "লোডিং...";

    // সরাসরি ফায়ারবেস অথেন্টিকেশন
    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // সফল হলে হোম পেজে নিয়ে যাবে
        window.location.href = 'home.html';
    })
    .catch((error) => {
        // যদি ইউজার না থাকে তবে নতুন অ্যাকাউন্ট তৈরি করবে
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                window.location.href = 'home.html';
            })
            .catch((err) => {
                alert("এরর: " + err.message);
                if(authBtn) authBtn.innerText = "প্রবেশ করুন / অ্যাকাউন্ট খুলুন";
            });
        } else {
            alert("ভুল পাসওয়ার্ড অথবা সমস্যা: " + error.message);
            if(authBtn) authBtn.innerText = "প্রবেশ করুন / অ্যাকাউন্ট খুলুন";
        }
    });
}
