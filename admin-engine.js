// নোটিশ আপডেট
function updateNotice() {
    const txt = document.getElementById('newNotice').value;
    if(txt) {
        db.collection("settings").doc("notice").set({ text: txt })
        .then(() => alert("নোটিশ আপডেট হয়েছে!"));
    }
}

// ডিপোজিট দেখা ও অ্যাপ্রুভ
db.collection("deposits").where("status", "==", "pending").onSnapshot(snap => {
    let html = "";
    if(snap.empty) html = "<p style='text-align:center; color:green;'>কোন পেন্ডিং রিকোয়েস্ট নেই</p>";
    
    snap.forEach(doc => {
        const d = doc.data();
        html += `<div style="border-bottom:1px solid #ddd; padding:10px; margin-bottom:5px;">
            <p><strong>${d.amount} TK</strong> (${d.method})</p>
            <p style="font-size:12px;">Trx: ${d.trx} <br> User: ${d.email}</p>
            <button onclick="approveDep('${doc.id}', '${d.uid}', ${d.amount})" style="width:48%; background:green; color:white; border:none; padding:5px;">Approve</button>
            <button onclick="rejectDep('${doc.id}')" style="width:48%; background:red; color:white; border:none; padding:5px;">Reject</button>
        </div>`;
    });
    document.getElementById('depositList').innerHTML = html;
});

function approveDep(id, uid, amount) {
    const confirmApprove = confirm("আপনি কি শিওর টাকা এড করবেন?");
    if(confirmApprove) {
        db.collection("users").doc(uid).update({
            balance: firebase.firestore.FieldValue.increment(amount)
        }).then(() => {
            db.collection("deposits").doc(id).update({ status: 'approved' });
        });
    }
}

function rejectDep(id) {
    if(confirm("বাতিল করবেন?")) {
        db.collection("deposits").doc(id).update({ status: 'rejected' });
    }
}
