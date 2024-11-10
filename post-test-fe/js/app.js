// app.js
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Login berhasil!");
            window.location.href = "dashboard.html";
        } else {
            alert("Login gagal. Silakan cek username/password.");
        }
    })
    .catch(error => console.error("Error:", error));
}

function logout() {
    localStorage.removeItem("token");
    alert("Logout berhasil");
    window.location.href = "login.html";
}

function checkLoginStatus() {
    const token = localStorage.getItem("token");
    
    if (!token) {
        alert("Silakan login terlebih dahulu.");
        window.location.href = "login.html";
    }
}

if (window.location.href.includes("login.html")) {
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
}

if (window.location.href.includes("dashboard.html") || window.location.href.includes("other_page.html")) {
    checkLoginStatus();
}
