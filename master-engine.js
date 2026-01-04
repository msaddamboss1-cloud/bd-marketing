// ১. ফায়ারবেস কনফিগারেশন (আপনার ডাটাবেস ইউআরএল ব্যবহার করা হয়েছে)
const firebaseConfig = {
    databaseURL: "https://bd-marketing-55a81-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

let authMode = "login";

// ২. অটো-ব্যালেন্স এবং ইউজার প্রোফাইল সিঙ্ক (ইমেইল এবং ওয়ালেট ব্যালেন্স)
auth.onAuthStateChanged(user => {
    if (user) {
        // মেনুতে ইউজারের ইমেইল দেখানো
        const userEmailElem = document.getElementById('userEmail');
        if (userEmailElem) {
            userEmailElem.innerText = user.email;
        }

        // রিয়েল-টাইম ব্যালেন্স আপডেট (বিক্রেতা ও ক্রেতা ওয়ালেট)
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

// ৩. সাইডবার মেনু কন্ট্রোল ফাংশন
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

// ৪. লগআউট করার প্রফেশনাল ফাংশন
function logoutUser() {
    Swal.fire({
        title: 'আপনি কি নিশ্চিত?',
        text: "আপনি একাউন্ট থেকে লগআউট করতে চাচ্ছেন!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'হ্যাঁ, লগআউট করুন',
        cancelButtonText: 'না'
    }).then((result) => {
        if (result.isConfirmed) {
            auth.signOut().then(() => {
                window.location.href = 'index.html';
            }).catch((error) => {
                Swal.fire('Error', 'লগআউট হতে সমস্যা হচ্ছে!', 'error');
            });
        }
    });
}

// ৫. ডিপোজিট রিকোয়েস্ট লজিক (সীমা: ৫০ - ৫০০০ টাকা)
function handleDeposit() {
    const amount = parseFloat(document.getElementById('depositAmt').value);
    const trx = document.getElementById('depositTrx').value;
    const mode = document.getElementById('depositMode').value;
    const user = auth.currentUser;

    if (!user) return Swal.fire('Error', 'দয়া করে আবার লগইন করুন।', 'error');

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
            Swal.fire('সফল!', 'আপনার ডিপোজিট রিকোয়েস্ট এডমিনের কাছে পাঠানো হয়েছে।', 'success');
            document.getElementById('depositAmt').value = "";
            document.getElementById('depositTrx').value = "";
        });
    } else {
        Swal.fire('ভুল তথ্য', 'সর্বনিম্ন ৫০ এবং সর্বোচ্চ ৫০০০ টাকা এবং সঠিক TrxID দিন।', 'error');
    }
}

// ৬. লগইন এবং রেজিস্ট্রেশন হ্যান্ডলার
async function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;

    if (!email || pass.length < 6) {
        return Swal.fire('Error', 'সঠিক ইমেইল এবং অন্তত ৬ সংখ্যার পাসওয়ার্ড দিন।', 'error');
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
                joined: Date.now()
            });
            Swal.fire('সফল!', 'রেজিস্ট্রেশন হয়েছে। এখন লগইন করুন।', 'success');
            toggleAuth();
        }
    } catch (err) {
        Swal.fire('ব্যর্থ!', 'ইমেইল বা পাসওয়ার্ড ভুল অথবা একাউন্ট তৈরি নেই।', 'error');
    }
}

// ৭. লগইন-রেজিস্ট্রেশন মোড পরিবর্তন
function toggleAuth() {
    authMode = (authMode === "login") ? "signup" : "login";
    const btn = document.getElementById('mainBtn');
    if(btn) btn.innerText = (authMode === "login") ? "প্রবেশ করুন" : "রেজিস্ট্রেশন করুন";
}
