/* বিডি মার্কেটিং - মাস্টার ইঞ্জিন ২০২৬
   কর্তৃপক্ষ: অ্যাডমিন
*/

const masterEngine = {
    // ইউজারের ডাটাবেস সেটআপ
    initializeUser: function(uid, name, email) {
        db.ref('Users/' + uid).set({
            full_name: name,
            email: email,
            buyer_wallet: 0.00,
            seller_wallet: 0.00,
            role: "জনাব", // সম্মানসূচক সম্বোধন
            created_by: "Admin" // তোমার পরিচয়ে 'অ্যাডমিন'
        });
    },

    // ব্যালেন্স ও ওয়ালেট আপডেট লজিক
    syncWallet: function() {
        const userName = localStorage.getItem("user_name");
        if (!userName) return;
        const uid = userName.replace(/\s+/g, '_');

        db.ref('Users/' + uid).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const mode = localStorage.getItem("active_mode") || 'buyer';
                let balance = (mode === 'seller') ? data.seller_wallet : data.buyer_wallet;
                
                // স্ক্রিনে ডাটা দেখানো
                const balText = document.getElementById("main-balance");
                const labelText = document.getElementById("wallet-label");

                if (balText) balText.innerText = parseFloat(balance).toFixed(2) + " ৳";
                if (labelText) {
                    labelText.innerText = (mode === 'seller') ? "বিক্রেতা ব্যালেন্স" : "ক্রেতা ব্যালেন্স";
                }
            }
        });
    },

    // মোড পরিবর্তনের সময় মেসেজ
    switchProfile: function(mode) {
        localStorage.setItem("active_mode", mode);
        this.syncWallet();
        
        const message = (mode === 'seller') ? "জনাব, আপনি এখন বিক্রেতা মোডে আছেন।" : "জনাব, আপনি এখন ক্রেতা মোডে আছেন।";
        
        Swal.fire({
            title: 'সফল',
            text: message,
            icon: 'success',
            confirmButtonText: 'ঠিক আছে',
            confirmButtonColor: '#1f6feb'
        });
    }
};

// অটোমেটিক রান
window.onload = () => {
    masterEngine.syncWallet();
};
