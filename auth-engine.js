// লগইন
async function login() {
    const email = document.getElementById('logEmail').value;
    const pass = document.getElementById('logPass').value;
    const btn = document.querySelector('button');
    
    if(!email || !pass) { alert("সব তথ্য দিন"); return; }
    
    btn.disabled = true;
    btn.innerText = "চেক করা হচ্ছে...";

    try {
        const res = await auth.signInWithEmailAndPassword(email, pass);
        if (!res.user.emailVerified) {
            alert("আপনার ইমেইল ভেরিফাই করা হয়নি! ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।");
            auth.signOut();
            btn.disabled = false;
            btn.innerText = "লগইন";
            return;
        }
        checkRole(res.user.uid);
    } catch(e) { 
        alert("ভুল হয়েছে: " + e.message);
        btn.disabled = false;
        btn.innerText = "লগইন";
    }
}

// রেজিস্ট্রেশন
async function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    const role = document.getElementById('regRole').value;
    const btn = document.querySelector('button');

    if(pass.length < 6) { alert("পাসওয়ার্ড কমপক্ষে ৬ সংখ্যার হতে হবে"); return; }

    btn.disabled = true;
    btn.innerText = "একাউন্ট খোলা হচ্ছে...";
    
    try {
        const res = await auth.createUserWithEmailAndPassword(email, pass);
        await res.user.sendEmailVerification();
        
        await db.collection("users").doc(res.user.uid).set({
            name: name,
            email: email,
            role: role,
            balance: 0,
            status: 'active',
            uid: res.user.uid,
            createdAt: new Date()
        });
        
        alert("সফল! আপনার ইমেইলে ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে। ভেরিফাই করে লগইন করুন।");
        window.location.href = "index.html";
    } catch(e) { 
        alert(e.message); 
        btn.disabled = false;
        btn.innerText = "রেজিস্ট্রেশন করুন";
    }
}

// রিডাইরেক্ট
function checkRole(uid) {
    db.collection("users").doc(uid).get().then(doc => {
        if(doc.exists) {
            const r = doc.data().role;
            if(r === 'admin') window.location.href = 'admin-panel.html';
            else if(r === 'seller') window.location.href = 'seller-dashboard.html';
            else window.location.href = 'buyer-dashboard.html';
        }
    });
}
