auth.onAuthStateChanged(user => {
    if(!user && !window.location.pathname.includes("index.html") && !window.location.pathname.includes("register.html")) {
        window.location.href = "index.html";
    }
});
