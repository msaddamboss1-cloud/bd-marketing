// Firebase Configuration
const firebaseConfig = {
    databaseURL: "https://bd-marketing-55a81-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

let authMode = "login";

function toggleAuth() {
    authMode = (authMode === "login") ? "signup" : "login";
    document.getElementById('mainBtn').innerText = (authMode === "login") ? "প্রবেশ করুন" : "রেজিস্ট্রেশন করুন";
}

// Authentication Logic
async function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;

    if(!email || pass.length < 6) return Swal.fire('Error', 'সঠিক ইমেইল এবং অন্তত ৬ সংখ্যার পাসওয়ার্ড দিন।', 'error');

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
        Swal.fire('Error', e.message, 'error');
    }
}

// Balance Sync Logic
auth.onAuthStateChanged(user => {
    if(user && window.location.pathname.includes('home.html')) {
        db.ref('Users/' + user.uid).on('value', snapshot => {
            const data = snapshot.val();
            document.getElementById('buyerBalance').innerText = data.buyerBalance.toFixed(2);
            document.getElementById('sellerBalance').innerText = data.sellerBalance.toFixed(2);
        });
    }
});

// Transaction Submission
function submitRequest() {
    const amount = document.getElementById('amt').value;
    const trxId = document.getElementById('trx').value;
    const mode = document.getElementById('accMode').value;
    const user = auth.currentUser;

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
            Swal.fire('সফল!', 'আপনার অনুরোধটি প্রাইভেসি মোডে জমা হয়েছে।', 'success');
            document.getElementById('amt').value = "";
            document.getElementById('trx').value = "";
        });
    } else {
        Swal.fire('ভুল', 'সঠিক তথ্য দিন।', 'error');
    }
}

// Smart Sensors
window.addEventListener('online', () => document.getElementById('onlineInd').style.background = 'green');
window.addEventListener('offline', () => document.getElementById('onlineInd').style.background = 'red');

/* --- ADMIN CUSTOM UPDATES START HERE --- */
                        
