// ১. ফায়ারবেস কনফিগারেশন এবং কানেকশন
const firebaseConfig = {
    databaseURL: "https://bd-marketing-55a81-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

let authMode = "login";

// ২. অটো-ব্যালেন্স, প্রোফাইল এবং ইমেইল সিঙ্ক (সব পেজের জন্য)
auth.onAuthStateChanged(user => {
    if (user) {
        // মেনুতে ইউজারের ইমেইল দেখানো (ইমেইল লোড হচ্ছে ফিক্স)
        const emailDiv = document.getElementById('userEmail');
        if (emailDiv) emailDiv.innerText = user.email;

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
    } else {
        // লগইন না থাকলে হোম বা মার্কেট পেজ থেকে ইনডেক্সে পাঠিয়ে দিবে
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }
});

// ৩. মেনু এবং সাইডবার কন্ট্রোল
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

// ৪. লগআউট সিস্টেম (সাদ্দাম জনাবের বিশেষ নির্দেশনা অনুযায়ী)
function logoutUser() {
    Swal.fire({
        title: 'আপনি কি নিশ্চিত?',
        text: "আপনি একাউন্ট থেকে লগআউট করতে চাচ্ছেন!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, লগআউট করুন',
        cancelButtonText: 'না'
    }).then((result) => {
        if (result.isConfirmed) {
            auth.signOut().then(() => {
                window.location.href = 'index.html';
            });
        }
    });
}

// ৫. ডিপোজিট রিকোয়েস্ট (লিমিট: ৫০ - ৫০০০৳)
function handleDeposit() {
    const amount = parseFloat(document.getElementById('depositAmt').value);
    const trx = document.getElementById('depositTrx').value;
    const mode = document.getElementById('depositMode').value;
    const user = auth.currentUser;

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

// ৬. পকেট মার্কেট: নতুন কাজ পোস্ট করা
function postNewJob() {
    const title = document.getElementById('jobTitle').value;
    const desc = document.getElementById('jobDesc').value;
    const pay = parseFloat(document.getElementById('jobPay').value);
    const limit = parseInt(document.getElementById('jobLimit').value);
    const proof = document.getElementById('jobProof').value;
    const user = auth.currentUser;

    if (!title || !desc || pay <= 0 || !limit) return Swal.fire('Ops!', 'সবগুলো ঘর পূরণ করুন।', 'warning');

    db.ref('MarketJobs').push({
        posterUid: user.uid,
        posterEmail: user.email,
        title: title,
        description: desc,
        payment: pay,
        workerLimit: limit,
        proofRequired: proof,
        status: 'Active',
        time: Date.now()
    }).then(() => {
        Swal.fire('সফল!', 'কাজটি মার্কেটে পাবলিশ হয়েছে।', 'success');
        if(typeof switchTab === "function") switchTab('buy');
    });
}

// ৭. পকেট মার্কেট: কাজগুলো ক্রেতাদের দেখানো
function loadMarketJobs() {
    const jobListDiv = document.getElementById('jobList');
    if (!jobListDiv) return;

    db.ref('MarketJobs').on('value', snapshot => {
        jobListDiv.innerHTML = "";
        const data = snapshot.val();
        if (!data) {
            jobListDiv.innerHTML = '<p class="text-center text-gray-600 py-10 italic">অনুগ্রহ করে পরে আসুন, এই মুহূর্তে কোন কাজ নেই...</p>';
            return;
        }
        Object.keys(data).forEach(key => {
            const job = data[key];
            jobListDiv.insertAdjacentHTML('beforeend', `
                <div class="glass-card p-5 border-l-4 border-blue-600 mb-4">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-sm text-blue-400">${job.title}</h3>
                        <span class="bg-green-600/20 text-green-500 text-[10px] px-2 py-1 rounded-lg font-bold">৳ ${job.payment.toFixed(2)}</span>
                    </div>
                    <p class="text-[11px] text-gray-400 mb-4 line-clamp-2">${job.description}</p>
                    <button onclick="Swal.fire('তথ্য', 'কাজ করার সিস্টেম শীঘ্রই আসছে!', 'info')" class="w-full py-2 bg-blue-600 rounded-xl text-[9px] font-bold uppercase">কাজটি দেখুন</button>
                </div>
            `);
        });
    });
}

// ৮. লগইন এবং রেজিস্ট্রেশন লজিক
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
                email: email, sellerBalance: 0, buyerBalance: 0, joined: Date.now()
            });
            Swal.fire('সফল!', 'রেজিস্ট্রেশন হয়েছে। লগইন করুন।', 'success');
            toggleAuth();
        }
    } catch (err) { Swal.fire('ব্যর্থ!', 'তথ্য ভুল।', 'error'); }
}

function toggleAuth() {
    authMode = (authMode === "login") ? "signup" : "login";
    if(document.getElementById('mainBtn')) 
        document.getElementById('mainBtn').innerText = (authMode === "login") ? "প্রবেশ করুন" : "রেজিস্ট্রেশন করুন";
}

// পেজ লোড হলে মার্কেটের কাজগুলো দেখাবে
if (window.location.pathname.includes('market.html')) { loadMarketJobs(); }
