// Form validation and authentication logic for Login Page
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("sign");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("UserName").value.trim();
        const password = document.querySelector("#Password").value.trim();
        const errorMsg = document.getElementById("Errormsg");
        
        // Clear previous messages
        errorMsg.textContent = "";

        // Simple validation checks
        if (!validateEmail(email)) {
            errorMsg.textContent = "Please enter a valid email address.";
            return;
        }

        if (password.length < 8) {
            errorMsg.textContent = "Password must be at least 8 characters long.";
            return;
        }

        // Simulate successful login
        localStorage.setItem("soundguys_user", JSON.stringify({ email: email, isLoggedIn: true }));
        
        // Alert user using a dynamic dialog or simple alert in context
        // Direct redirect with confirmation
        alert("Login successful! Welcome back to SoundGuys.");
        window.location.href = "./index.html";
        this.reset();
    });
});

// Email format regex validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
