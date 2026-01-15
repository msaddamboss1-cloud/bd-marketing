// লগইন করার সময় সঠিক ড্যাশবোর্ডে পাঠানোর লজিক
async function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;
    try {
        const res = await auth.signInWithEmailAndPassword(email, pass);
        const doc = await db.collection("users").doc(res.user.uid).get();
        const userData = doc.data();

        if (userData.role === 'seller') {
            window.location.href = "seller-dashboard.html"; // যে কাজ দিবে
        } else if (userData.role === 'buyer') {
            window.location.href = "buyer-dashboard.html"; // যে কাজ করবে
        } else if (userData.role === 'admin') {
            window.location.href = "admin-panel.html";
        }
    } catch (e) { alert("লগইন ব্যর্থ! ইমেইল বা পাসওয়ার্ড চেক করুন।"); }
}
