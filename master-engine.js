// এডমিন সাদ্দাম, আপনার ডাটাবেস ইউআরএল এখানে নিখুঁতভাবে বসানো হয়েছে
const firebaseConfig = {
  apiKey: "AIzaSyDRwrekZBZ31ACszDk2EJM_X9D7_H-0",
  authDomain: "bd-marketing-55a81.firebaseapp.com",
  databaseURL: "https://bd-marketing-55a81-default-rtdb.firebaseio.com",
  projectId: "bd-marketing-55a81",
  storageBucket: "bd-marketing-55a81.appspot.com",
  messagingSenderId: "678696512628",
  appId: "1:678696512628:web:edfc22a62f55dad41df521"
};
// Firebase App এবং Auth 初始化 করার আধুনিক পদ্ধতি
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
// রিয়েল-টাইম অ্যাডমিন নোটিশ এবং সেটিংস লোডার]
function loadAdminSettings() {
    db.ref('siteSettings').on('value', (snap) => {
        const settings = snap.val();
        if(settings && settings.notice) {
            const noticeEl = document.getElementById('adminNotice');
            noticeEl.innerText = settings.notice;
            noticeEl.classList.remove('hidden');
        }
    });
}

// আল্ট্রা ব্যালেন্স সিঙ্ক্রোনাইজেশন]
auth.onAuthStateChanged(user => {
    if (user) {
        if(document.getElementById('userEmail')) document.getElementById('userEmail').innerText = user.email;
        loadAdminSettings();
        
        // ব্যালেন্স ডাটা লোড
        db.ref('users/' + user.uid).on('value', snap => {
            const data = snap.val() || { sellerBal: 0, buyerBal: 0 };
            updateUI('sellerBalance', data.sellerBal);
            updateUI('buyerBalance', data.buyerBal);
        });
    } else {
        if(!window.location.pathname.includes('index.html')) window.location.href = 'index.html';
    }
});

function updateUI(id, val) {
    const el = document.getElementById(id);
    if(el) el.innerText = parseFloat(val).toFixed(2);
}

// মাস্টার ডিপোজিট ও উইথড্র সিস্টেম]
function handleDeposit() {
    const amt = parseInt(document.getElementById('depositAmt').value);
    const trx = document.getElementById('depositTrx').value;
    const mode = document.getElementById('depositMode').value;

    if (amt < 50 || amt > 5000) {
        return Swal.fire('সীমাবদ্ধতা', 'মিনিমাম ৫০ এবং ম্যাক্সিমাম ৫০০০ টাকা', 'error');
    }
    if (trx.length < 6) return Swal.fire('ভুল TrxID', 'দয়া করে সঠিক ট্রানজেকশন আইডি দিন', 'warning');

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
        Swal.fire({
            title: 'রিকোয়েস্ট সফল!',
            text: 'এডমিন ভেরিফিকেশন করার পর ব্যালেন্স যোগ হবে।',
            icon: 'success',
            confirmButtonColor: '#2563eb'
        });
        document.getElementById('depositAmt').value = '';
        document.getElementById('depositTrx').value = '';
    });
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('hidden');
}

function logoutUser() {
    auth.signOut().then(() => window.location.href = 'index.html');
    // আল্ট্রা মাস্টার লগইন ও রেজিস্ট্রেশন ফাংশন
function handleAuth() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        return Swal.fire('সতর্কতা', 'ইমেইল এবং পাসওয়ার্ড দুটোই দিন', 'warning');
    }

    // বাটন লোডিং এফেক্ট
    const authBtn = document.getElementById('authBtn');
    if(authBtn) authBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> যাচাই চলছে...';

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'home.html';
        })
        .catch((error) => {
            // যদি একাউন্ট না থাকে তবে নতুন তৈরি হবে (পাবলিকের জন্য সুবিধা)
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                auth.createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        window.location.href = 'home.html';
                    })
                    .catch(err => {
                        Swal.fire('ত্রুটি', 'একাউন্ট তৈরি করা যাচ্ছে না: ' + err.message, 'error');
                        if(authBtn) authBtn.innerText = 'প্রবেশ করুন / একাউন্ট খুলুন';
                    });
            } else {
                Swal.fire('ব্যর্থ', 'পাসওয়ার্ড ভুল বা সার্ভার সমস্যা', 'error');
                if(authBtn) authBtn.innerText = 'প্রবেশ করুন / একাউন্ট খুলুন';
            }
        });
}
    
}
