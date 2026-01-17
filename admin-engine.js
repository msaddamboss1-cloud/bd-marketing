// Admin Statistics and Protection
auth.onAuthStateChanged(async user => {
    if (!user) return window.location.replace("index.html");

    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists || doc.data().role !== "admin") {
        alert("Access Denied!");
        window.location.replace("dashboard.html");
        return;
    }

    // Load Stats
    db.collection("users").onSnapshot(s => {
        if(document.getElementById("users")) document.getElementById("users").innerText = "Total Users: " + s.size;
    });

    db.collection("tasks").onSnapshot(s => {
        if(document.getElementById("tasks")) document.getElementById("tasks").innerText = "Total Tasks: " + s.size;
    });

    db.collection("transactions").onSnapshot(s => {
        if(document.getElementById("tx")) document.getElementById("tx").innerText = "Total Tx: " + s.size;
    });
});

function logout() {
    auth.signOut().then(() => window.location.replace("index.html"));
}

