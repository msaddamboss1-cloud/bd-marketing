function registerUser() {
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPassword").value;
  const role = document.getElementById("regRole").value;
  const name = document.getElementById("regName").value;
  if (!role || !name) return alert("All fields are required!");
  
  auth.createUserWithEmailAndPassword(email, pass).then(cred => {
    return db.collection("users").doc(cred.user.uid).set({
      name: name, role: role, balance: 0, email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }).then(() => location.href = "dashboard.html").catch(e => alert(e.message));
}
function loginUser() {
  auth.signInWithEmailAndPassword(document.getElementById("loginEmail").value, document.getElementById("loginPassword").value)
    .then(() => location.href = "dashboard.html").catch(e => alert(e.message));
}
function logout() { auth.signOut().then(() => location.href = "index.html"); }

