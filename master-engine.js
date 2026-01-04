// ১. ফায়ারবেস কনফিগারেশন ও ইনিশিয়ালাইজেশন
const firebaseConfig = {
    databaseURL: "https://bd-marketing-55a81-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

let authMode = "login";

// ২. অটো-ব্যালেন্স এবং ইউজার প্রোফাইল সিঙ্ক
auth.onAuthStateChanged(user => {
    if (user && window.location.pathname.includes('home.html')) {
        // ইউজারের ইমেইল প্রোফাইল মেনুতে দেখানো
        if(document.getElementById('userEmail')) {
            document.getElementById('userEmail').innerText = user.email;
        }

        // ব্যালেন্স আপডেট
        db.ref('Users/' + user.uid).on('value', snapshot => {
            const data = snapshot.val();
            if (data) {
                if(document.getElementById('sellerBalance')) 
                    document.getElementById('sellerBalance').innerText = (data.sellerBalance || 0).toFixed(2);
                if(document.getElementById('buyerBalance')) 
                    document.getElementById('buyerBalance').innerText = (data.buyerBalance || 0).toFixed(2);
            }
        });
    }
});

// ৩. মেনু বাটন ফাংশন (এটিই আপনার মেনু সচল করবে)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-300px";
        overlay.classList.add('hidden');
    } else {
        sidebar.style.left = "0px";
        overlay.classList.remove('hidden');
    }
}

// ৪. ডিপোজিট রিকোয়েস্ট লজিক
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

// ৫. উইথড্র রিকোয়েস্ট লজিক
function handleWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmt').value);
    const target = document.getElementById('targetNum').value;
    const user = auth.currentUser;
    const currentBalance = parseFloat(document.getElementById('buyerBalance').innerText);

    if (amount < 50 || amount > 5000) {
        return Swal.fire('সীমাবদ্ধতা', 'সর্বনিম্ন ৫০ এবং সর্বোচ্চ ৫০০০৳ তুলতে পারবেন।', 'error');
    }

    if (amount > currentBalance) {
        return Swal.fire('ব্যালেন্স কম', 'আপনার ক্রেতা ওয়ালেটে পর্যাপ্ত টাকা নেই।', 'error');
    }

    db.ref('WithdrawRequests').push({
        uid: user.uid,
        email: user.email,
        amount: amount,
        targetNumber: target,
        status: 'Pending',
        time: Date.now()
    }).then(() => {
        Swal.fire('সফল!', 'উইথড্র অনুরোধ পাঠানো হয়েছে।', 'success');
        document.getElementById('withdrawAmt').value = "";
    });
}

// ৬. অথেন্টিকেশন (লগইন/রেজিস্ট্রেশন)
async function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;

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
                joined: Date.now()
            });
            Swal.fire('সফল!', 'রেজিস্ট্রেশন হয়েছে। লগইন করুন।', 'success');
        }
    } catch (err) {
        Swal.fire('ভুল', 'তথ্য সঠিক নয়।', 'error');
    }
}

function toggleAuth() {
    authMode = (authMode === "login") ? "signup" : "login";
    document.getElementById('mainBtn').innerText = (authMode === "login") ? "প্রবেশ করুন" : "রেজিস্ট্রেশন করুন";
        }
