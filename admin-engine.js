async function loadAdminData() {
    db.collection("users").onSnapshot(snap => {
        const list = document.getElementById('user-list');
        list.innerHTML = "";
        snap.forEach(doc => {
            const u = doc.data();
            list.innerHTML += `<div class="job-card" style="border-left:5px solid #3b82f6;">
                <b>${u.name}</b> (${u.role})<br>
                ব্যালেন্স: ৳${u.balance} <br><small>UID: ${doc.id}</small>
            </div>`;
        });
    });
}
async function updateUserBalance() {
    const uid = document.getElementById('target-uid').value;
    const amt = parseFloat(document.getElementById('add-amt').value);
    const uRef = db.collection("users").doc(uid);
    const doc = await uRef.get();
    if(doc.exists) {
        await uRef.update({ balance: doc.data().balance + amt });
        alert("টাকা যোগ হয়েছে!");
    } else { alert("ইউজার আইডি পাওয়া যায়নি!"); }
}
loadAdminData();
