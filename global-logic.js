
function trackBalance(uid){
  db.collection("users").doc(uid).onSnapshot(doc=>{
      if(!doc.exists) return;
      const bal = doc.data().balance || 0;
      const el = document.getElementById("balanceText");
      if(el) el.innerText = "Balance: ৳" + bal;
      const el2 = document.getElementById("balanceDisplay"); 
      if(el2) el2.innerText = "৳" + bal;
  });
}
function addBalance(uid, amount){
  return db.collection("users").doc(uid).update({ balance: firebase.firestore.FieldValue.increment(amount) });
}
function deductBalance(uid, amount){
  return db.collection("users").doc(uid).update({ balance: firebase.firestore.FieldValue.increment(-amount) });
}
