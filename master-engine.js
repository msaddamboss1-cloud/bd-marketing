/* বিডি মার্কেটিং - মাস্টার ইঞ্জিন ২০২৬ 
   অ্যাডমিন: সাদ্দাম হোসেন  
*/

const masterEngine = {
    // ডাটাবেস সেটআপ
    initializeUser: function(uid, name, email, age) {
        db.ref('Users/' + uid).set({
            full_name: name,
            age: age,
            email: email,
            buyer_wallet: 0.00,
            seller_wallet: 0.00,
            role: "জনাব",
            status: "Pending",
            created_by: "Admin",
            join_date: new Date().toLocaleDateString('bn-BD')
        });
    },

    // ডাইনামিক ওয়ালেট সিঙ্ক
    syncWallet: function() {
        const userName = localStorage.getItem("user_name");
        if (!userName) return;
        const uid = userName.replace(/\s+/g, '_');

        db.ref('Users/' + uid).on('value', (s) => {
            const data = s.val();
            if (data) {
                const mode = localStorage.getItem("active_mode") || 'buyer';
                let bal = (mode === 'seller') ? data.seller_wallet : data.buyer_wallet;
                
                if(document.getElementById("main-balance")) {
                    document.getElementById("main-balance").innerText = parseFloat(bal).toFixed(2) + " ৳";
                }
                if(document.getElementById("wallet-label")) {
                    document.getElementById("wallet-label").innerText = (mode === 'seller') ? "বিক্রেতা ব্যালেন্স" : "ক্রেতা ব্যালেন্স";
                }
            }
        });
    }
};

// অটো রান
window.onload = () => masterEngine.syncWallet();
