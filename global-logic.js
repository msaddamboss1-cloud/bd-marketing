auth.onAuthStateChanged(user => {
    if(user) {
        // ব্যালেন্স লোড
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            if(doc.exists && document.getElementById('userBalance')) {
                document.getElementById('userBalance').innerText = doc.data().balance + " ৳";
            }
        });

        // নোটিশ লোড
        db.collection("settings").doc("notice").onSnapshot(doc => {
            const text = doc.exists ? doc.data().text : "BD Marketing এ স্বাগতম!";
            if(document.getElementById('adminNotice')) {
                document.getElementById('adminNotice').innerText = text;
            }
        });
    } else {
        window.location.href = 'index.html';
    }
});
