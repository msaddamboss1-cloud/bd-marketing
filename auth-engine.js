// User Registration
async function register(email, password, role, errEl) {
    errEl.innerText = "Processing...";
    try {
        const res = await auth.createUserWithEmailAndPassword(email, password);
        const user = res.user;
        
        // ফায়ারবেস ডাটাবেসে ইউজার প্রোফাইল তৈরি
        await db.collection("users").doc(user.uid).set({
            uid: user.uid,
            email: email,
            role: role,
            balance: 0,
            status: "active",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert("Registration Successful!");
        window.location.replace("dashboard.html");
    } catch (err) {
        console.error(err);
        errEl.innerText = "Error: " + err.message;
    }
}

// User Login
async function login(email, password, errEl) {
    errEl.innerText = "Logging in...";
    try {
        await auth.signInWithEmailAndPassword(email, password);
        window.location.replace("dashboard.html");
    } catch (err) {
        errEl.innerText = "ভুল ইমেইল বা পাসওয়ার্ড!";
    }
}
