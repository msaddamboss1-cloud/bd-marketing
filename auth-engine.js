// Authentication Engine for BD-Marketing
auth.onAuthStateChanged(user => {
    if (user) {
        // ইউজার লগইন থাকলে তার ডাটা চেক করা
        db.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                if (!user.emailVerified) {
                    alert("দয়া করে আপনার ইমেইল ভেরিফাই করুন!");
                    auth.signOut();
                    window.location.href = 'index.html';
                }
            }
        });
    }
});

// রেজিস্ট্রেশন ফাংশন
function registerUser(email, password, role, name) {
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            
            // ইমেইল ভেরিফিকেশন পাঠানো (এটিই তোমার লিংক পাঠাবে)
            user.sendEmailVerification().then(() => {
                alert("ভেরিফিকেশন ইমেইল পাঠানো হয়েছে! চেক করে ভেরিফাই করুন।");
                
                // ডাটাবেসে ইউজার ডাটা সেভ করা
                db.collection('users').doc(user.uid).set({
                    uid: user.uid,
                    name: name,
                    email: email,
                    role: role,
                    balance: 0,
                    joinedAt: new Date()
                }).then(() => {
                    auth.signOut();
                    window.location.href = 'index.html';
                });
            });
        })
        .catch(error => {
            alert("ভুল হয়েছে: " + error.message);
        });
}

// লগইন ফাংশন
function loginUser(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            if (user.emailVerified) {
                db.collection('users').doc(user.uid).get().then(doc => {
                    const role = doc.data().role;
                    if (role === 'admin') window.location.href = 'admin-panel.html';
                    else if (role === 'seller') window.location.href = 'seller-dashboard.html';
                    else window.location.href = 'buyer-dashboard.html';
                });
            } else {
                alert("আগে ইমেইল ভেরিফাই করুন!");
                auth.signOut();
            }
        })
        .catch(error => {
            alert("লগইন ব্যর্থ: " + error.message);
        });
}
