// ১. সবার আগে ভেরিয়েবল ডিক্লেয়ার করা (যাতে এরর না আসে)
let authMode = "login"; 

// ২. ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
    databaseURL: "https://bd-marketing-55a81-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// ৩. অটো-লগইন চেক (যদি ইউজার আগে থেকে লগইন থাকে)
auth.onAuthStateChanged(user => {
    if(user && window.location.pathname.includes('index.html')) {
        window.location.href = "home.html";
    }
    if(user && window.location.pathname.includes('home.html')) {
        db.ref('Users/' + user.uid).on('value', snapshot => {
            const data = snapshot.val();
            if(data) {
                document.getElementById('buyerBalance').innerText = (data.buyerBalance || 0).toFixed(2);
                document.getElementById('sellerBalance').innerText = (data.sellerBalance || 0).toFixed(2);
            }
        });
    }
});

// ৪. লগইন ও রেজিস্ট্রেশন মোড পরিবর্তন
function toggleAuth() {
    authMode = (authMode === "login") ? "signup" : "login";
    document.getElementById('mainBtn').innerText = (authMode === "login") ? "প্রবেশ করুন" : "রেজিস্ট্রেশন করুন";
}

// ৫. প্রবেশ বা রেজিস্ট্রেশন হ্যান্ডলার
async function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;

    if(!email || pass.length < 6) {
        return Swal.fire('Error', 'সঠিক ইমেইল এবং অন্তত ৬ সংখ্যার পাসওয়ার্ড দিন।', 'error');
    }

    try {
        if(authMode === "login") {
            await auth.signInWithEmailAndPassword(email, pass);
            window.location.href = "home.html";
        } else {
            const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
            await db.ref('Users/' + userCredential.user.uid).set({
                email: email,
                buyerBalance: 0,
                sellerBalance: 0,
                status: 'Pending',
                joined: Date.now()
            });
            Swal.fire('সফল!', 'রেজিস্ট্রেশন হয়েছে। এডমিন অনুমতি দিলে লগইন করতে পারবেন।', 'success');
        }
    } catch (e) {
        Swal.fire('Error', 'তথ্য ভুল অথবা একাউন্ট নেই।', 'error');
    }
}

// ৬. লেনদেন অনুরোধ পাঠানো
function submitRequest() {
    const amount = document.getElementById('amt').value;
    const trxId = document.getElementById('trx').value;
    const mode = document.getElementById('accMode').value;
    const user = auth.currentUser;

    if(!user) return Swal.fire('Error', 'আবার লগইন করুন।', 'error');

    if(amount >= 50 && trxId.length > 5) {
        db.ref('TransactionRequests').push({
            uid: user.uid,
            email: user.email,
            amount: amount,
            trxId: trxId,
            mode: mode,
            status: 'Pending',
            time: Date.now()
        }).then(() => {
            Swal.fire('সফল!', 'অনুরোধটি এডমিনের কাছে পাঠানো হয়েছে।', 'success');
            document.getElementById('amt').value = "";
            document.getElementById('trx').value = "";
        });
    } else {
        Swal.fire('ভুল', 'সঠিক তথ্য দিন (মিনিমাম ৫০ টাকা)।', 'error');
    }
}

// ৭. স্মার্ট সেন্সর (অনলাইন/অফলাইন)
window.addEventListener('online', () => {
    const ind = document.getElementById('onlineInd');
    if(ind) ind.style.background = 'green';
});
window.addEventListener('offline', () => {
    const ind = document.getElementById('onlineInd');
    if(ind) ind.style.background = 'red';
});

/* --- ADMIN CUSTOM UPDATES START HERE --- */
