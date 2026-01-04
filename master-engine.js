// এডমিন সাদ্দাম, আপনার ফায়ারবেস কনফিগ
const firebaseConfig = {
  apiKey: "AIzaSyDRwrekZBZ31ACszDk2EJM_IqxRRwaGfCg",
  authDomain: "bd-marketing-55a81.firebaseapp.com",
  databaseURL: "https://bd-marketing-55a81-default-rtdb.firebaseio.com",
  projectId: "bd-marketing-55a81",
  storageBucket: "bd-marketing-55a81.appspot.com",
  messagingSenderId: "678696512628",
  appId: "1:678696512628:web:edfc22a62f55dad41df521"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// ১. ড্যাশবোর্ড আপডেট (ক্রেতা, বিক্রেতা ও পেন্ডিং ব্যালেন্স)
auth.onAuthStateChanged(user => {
    if (user) {
        db.ref('users/' + user.uid).on('value', snap => {
            const data = snap.val() || { sellerBal: 0, buyerBal: 0, pendingBal: 0 };
            
            // ছোট অক্ষরে ক্রেতা ও বিক্রেতা ব্যালেন্স এবং মূল পেন্ডিং ব্যালেন্স
            if(document.getElementById('sellerBalance')) document.getElementById('sellerBalance').innerText = data.sellerBal.toFixed(2);
            if(document.getElementById('buyerBalance')) document.getElementById('buyerBalance').innerText = data.buyerBal.toFixed(2);
            if(document.getElementById('pendingBalance')) document.getElementById('pendingBalance').innerText = data.pendingBal.toFixed(2);
        });
    } else {
        if(!window.location.pathname.includes('index.html')) window.location.href = 'index.html';
    }
});

// ২. ওয়ালেট ফাংশন (ডিপোজিট সিস্টেম)
function handleDeposit() {
    const amt = parseInt(document.getElementById('depositAmt').value);
    const trx = document.getElementById('depositTrx').value;
    const mode = document.getElementById('depositMode').value; // বিকাশ বা নগদ

    // আপনার শর্ত অনুযায়ী ৫০ - ৫০০০ টাকা লিমিট
    if (amt < 50 || amt > 5000) {
        alert("সীমাবদ্ধতা: সর্বনিম্ন ৫০ এবং সর্বোচ্চ ৫০০০ টাকা");
        return;
    }

    if (trx.length < 6) {
        alert("সঠিক ট্রানজ্যাকশন আইডি দিন");
        return;
    }

    const requestData = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        amount: amt,
        trxId: trx,
        mode: mode,
        status: 'pending',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    db.ref('allRequests').push(requestData).then(() => {
        alert("আপনার রিকোয়েস্টটি সফল হয়েছে। এডমিন ভেরিফাই করলে ব্যালেন্স যোগ হবে।");
        document.getElementById('depositAmt').value = '';
        document.getElementById('depositTrx').value = '';
    });
}

// ৩. হেল্প সেন্টার এবং অন্যান্য লিঙ্ক
function openHelpCenter() {
    // আপনার জিমেইল এবং হোয়াটসঅ্যাপ লিঙ্ক
    const whatsappLink = "https://wa.me/8801725780575"; // আপনার নম্বর দেওয়া হয়েছে
    window.open(whatsappLink, '_blank');
}

function sendEmail() {
    window.location.href = "mailto:msaddam@gmail.com"; // আপনার জিমেইল
}

// ৪. লগইন ফাংশন (অটো সাইন-আপ সহ)
function handleAuth() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
    .then(() => { window.location.href = 'home.html'; })
    .catch((error) => {
        if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/user-not-found') {
            auth.createUserWithEmailAndPassword(email, password)
            .then(() => { window.location.href = 'home.html'; })
            .catch(err => alert("এরর: " + err.message));
        } else {
            alert("সমস্যা: " + error.message);
        }
    });
}
