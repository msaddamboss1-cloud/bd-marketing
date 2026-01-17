
async function login(email, password, errEl) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        window.location.replace("dashboard.html");
    } catch (err) {
        errEl.innerText = "ভুল ইমেইল বা পাসওয়ার্ড!";
    }
}

async function register(email, password, role, errEl) {
    try {
        const res = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection("users").doc(res.user.uid).set({
            email: email,
            role: role,
            balance: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        window.location.replace("dashboard.html");
    } catch (err) {
        errEl.innerText = err.message;
    }
}
