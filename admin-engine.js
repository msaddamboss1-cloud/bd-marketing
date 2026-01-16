// অ্যাডমিন ইঞ্জিন: ডিপোজিট ও নোটিশ কন্ট্রোল
auth.onAuthStateChanged(user => {
    if (user) {
        if (user.email !== "msaddamboss1@gmail.com") {
            window.location.href = "index.html";
        } else {
            console.log("সাদ্দাম ভাই, অ্যাডমিন প্যানেলে স্বাগতম।");
        }
    } else {
        window.location.href = "index.html";
    }
});

// ডিপোজিট এপ্রুভ ফাংশন
function approveDeposit(id, uid, amount) {
    db.collection("users").doc(uid).update({
        balance: firebase.firestore.FieldValue.increment(amount)
    }).then(() => {
        db.collection("deposits").doc(id).update({ status: "approved" });
        alert("ডিপোজিট সফলভাবে এপ্রুভ হয়েছে!");
    });
}
