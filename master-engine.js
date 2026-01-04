// ১. গ্লোবাল ভেরিয়েবল
let authMode = "login";

// ২. ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
    databaseURL: "https://bd-marketing-55a81-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// ৩. অটো-ব্যালেন্স সিঙ্ক এবং লগইন চেক
auth.onAuthStateChanged(user => {
    if (user && window.location.pathname.includes('home.html')) {
        db.ref('Users/' + user.uid).on('value', snapshot => {
            const data = snapshot.val();
            if (data) {
                // বিক্রেতা (Employer) এবং ক্রেতা (Worker) ওয়ালেট আপডেট
                if(document.getElementById('sellerBalance')) 
                    document.getElementById('sellerBalance').innerText = (data.sellerBalance || 0).toFixed(2);
                if(document.getElementById('buyerBalance')) 
                    document.getElementById('buyerBalance').innerText = (data.buyerBalance || 0).toFixed(2);
            }
        });
    }
});

// ৪. একাউন্ট হ্যান্ডলার (লগইন ও রেজিস্ট্রেশন)
async function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;

    if (!email || pass.length < 6) {
        return Swal.fire('Error', 'সঠিক ইমেইল ও অন্তত ৬ সংখ্যার পাসওয়ার্ড দিন।', 'error');
    }

    try {
        if (authMode === "login") {
            await auth.signInWithEmailAndPassword(email, pass);
            window.location.href = "home.html";
        } else {
            const res = await auth.createUserWithEmailAndPassword(email, pass);
            await db.ref('Users/' + res.user.uid).set({
                email: email,
                sellerBalance: 0, 
                buyerBalance: 0,  
                status: 'Pending',
                joined: Date.now()
            });
            Swal.fire('সফল!', 'রেজিস্ট্রেশন হয়েছে। লগইন করুন।', 'success');
        }
    } catch (err) {
        Swal.fire('ব্যর্থ!', 'তথ্য ভুল অথবা একাউন্ট নেই।', 'error');
    }
}

// ৫. ডিপোজিট রিকোয়েস্ট (৫০ - ৫০০০৳ লিমিট)
function handleDeposit() {
    const amount = parseFloat(document.getElementById('depositAmt').value);
    const trx = document.getElementById('depositTrx').value;
    const mode = document.getElementById('depositMode').value;
    const user = auth.currentUser;

    if (!user) return Swal.fire('Error', 'আবার লগইন করুন।', 'error');

    if (amount >= 50 && amount <= 5000 && trx.length > 5) {
        db.ref('TransactionRequests').push({
            uid: user.uid,
            email: user.email,
            amount: amount,
            trxId: trx,
            type: 'Deposit',
            accountType: mode,
            status: 'Pending',
            time: Date.now()
        }).then(() => {
            Swal.fire('সফল!', 'ডিপোজিট অনুরোধ পাঠানো হয়েছে।', 'success');
            document.getElementById('depositAmt').value = "";
            document.getElementById('depositTrx').value = "";
        });
    } else {
        Swal.fire('ভুল', 'পরিমাণ ৫০-৫০০০৳ এবং সঠিক TrxID দিন।', 'error');
    }
}

// ৬. উইথড্র রিকোয়েস্ট (৫০ - ৫০০০৳ লিমিট)
function handleWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmt').value);
    const target = document.getElementById('targetNum').value;
    const user = auth.currentUser;
    // ক্রেতা ওয়ালেটের ব্যালেন্স চেক
    const currentBalance = parseFloat(document.getElementById('buyerBalance').innerText);

    if (!user) return Swal.fire('Error', 'আবার লগইন করুন।', 'error');

    if (amount < 50 || amount > 5000) {
        return Swal.fire('সীমাবদ্ধতা', 'সর্বনিম্ন ৫০ এবং সর্বোচ্চ ৫০০০৳ তুলতে পারবেন।', 'error');
    }

    if (amount > currentBalance) {
        return Swal.fire('ব্যালেন্স কম', 'আপনার ক্রেতা ওয়ালেটে পর্যাপ্ত টাকা নেই।', 'error');
    }

    if (target.length < 11) {
        return Swal.fire('ভুল নম্বর', 'সঠিক বিকাশ বা নগদ নম্বর দিন।', 'error');
    }

    db.ref('WithdrawRequests').push({
        uid: user.uid,
        email: user.email,
        amount: amount,
        targetNumber: target,
        type: 'Withdraw',
        status: 'Pending',
        time: Date.now()
    }).then(() => {
        Swal.fire('সফল!', 'উইথড্র অনুরোধ এডমিনের কাছে পাঠানো হয়েছে।', 'success');
        document.getElementById('withdrawAmt').value = "";
        document.getElementById('targetNum').value = "";
    });
}

// ৭. ইউজার ইন্টারফেস ফাংশন
function toggleAuth() {
    authMode = (authMode === "login") ? "signup" : "login";
    document.getElementById('mainBtn').innerText = (authMode === "login") ? "প্রবেশ করুন" : "রেজিস্ট্রেশন করুন";
}

/* --- ADMIN CUSTOM UPDATES START HERE --- */
        
