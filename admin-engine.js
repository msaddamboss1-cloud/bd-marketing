function countCollection(col, elId) {
  db.collection(col).get().then(snap => {
    const el = document.getElementById(elId);
    if (el) el.innerText = snap.size;
  });
}
// Init stats
countCollection("users", "userCount");
countCollection("tasks", "taskCount");
db.collection("deposits").where("status", "==", "pending").get().then(s => { if(document.getElementById("depositCount")) document.getElementById("depositCount").innerText = s.size; });
db.collection("withdraws").where("status", "==", "pending").get().then(s => { if(document.getElementById("withdrawCount")) document.getElementById("withdrawCount").innerText = s.size; });

