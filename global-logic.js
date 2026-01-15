auth.onAuthStateChanged(async (user) => {
    if (user) {
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            const data = doc.data();
            if(document.getElementById('balance')) document.getElementById('balance').innerText = "৳ " + data.balance.toFixed(2);
            if(document.getElementById('s-balance')) document.getElementById('s-balance').innerText = "৳ " + data.balance.toFixed(2);
        });
    }
});
