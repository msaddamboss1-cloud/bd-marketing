// Global helper functions
function redirect(path) {
    window.location.replace(path);
}

function generateTxID(prefix) {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

// Global App State
const AppState = {
    user: null,
    profile: null
};

// State observer
auth.onAuthStateChanged(async (user) => {
    if (user) {
        AppState.user = user;
        const snap = await db.collection("users").doc(user.uid).get();
        if (snap.exists) {
            AppState.profile = snap.data();
        }
    }
});

