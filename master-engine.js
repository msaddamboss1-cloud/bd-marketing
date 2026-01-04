// এডমিন সাদ্দাম, আপনার সঠিক কনফিগ এবং অটো-লগইন সেটআপ
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

// ১. অটো-লগইন এবং ডেসবোর্ড ডেটা কানেকশন
auth.onAuthStateChanged(user => {
    if (user) {
        // ইমেইল দেখানোর জন্য (আপনার HTML এ id="userEmail" থাকতে হবে)
        if(document.getElementById('userEmail')) {
            document.getElementById('userEmail').innerText = user.email;
        }

        // ব্যালেন্স আপডেট লজিক
        db.ref('users/' + user.uid).on('value', snap => {
            const data = snap.val() || { sellerBal: 0, buyerBal: 0, pendingBal: 0 };
            if(document.getElementById('pendingBalance')) document.getElementById('pendingBalance').innerText = data.pendingBal;
            if(document.getElementById('sellerBal')) document.getElementById('sellerBal').innerText = data.sellerBal;
            if(document.getElementById('buyerBal')) document.getElementById('buyerBal').innerText = data.buyerBal;
        });
    } else {
        // যদি লগইন না থাকে তবে ইনডেক্স পেজে পাঠাবে
        if(!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }
});

// ২. ওয়ালেট ফাংশন (ডিপোজিট সিস্টেম - ৫০ থেকে ৫০০০ লিমিট)
function handleDeposit() {
    const amount = parseInt(document.getElementById('depositAmount').value);
    const trxId = document.getElementById('trxId').value;
    const method = document.getElementById('paymentMethod').value;

    if (amount < 50 || amount > 5000) {
        alert("সাদ্দাম এডমিন সেটআপ: সর্বনিম্ন ৫০ এবং সর্বোচ্চ ৫০০০ টাকা প্রযোজ্য।");]
        return;
    }

    if (!trxId) {
        alert("দয়া করে ট্রানজ্যাকশন আইডি দিন।");
        return;
    }

    const dRef = db.ref('depositRequests').push();
    dRef.set({
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        amount: amount,
        trxId: trxId,
        method: method,
        status: 'pending',
        time: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert("আবেদন সফল! এডমিন চেক করে ব্যালেন্স যোগ করে দিবে।");
    });
}

// ৩. হেল্প সেন্টার (WhatsApp & Gmail)
function contactSupport() {
    const waLink = "https://wa.me/8801725780575"; // আপনার নম্বর]
    window.open(waLink, '_blank');
}
