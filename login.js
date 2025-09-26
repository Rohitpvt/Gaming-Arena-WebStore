const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// Toggle between login and register forms
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Function to get redirect URL or default to index.html
function getRedirectUrl() {
  const redirectUrl = localStorage.getItem("redirectAfterLogin");
  localStorage.removeItem("redirectAfterLogin"); // Clear after use
  return redirectUrl || "index.html";
}

// Registration form handler
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const errorDiv = document.getElementById("registerError");
  const successDiv = document.getElementById("registerSuccess");

  // Clear previous messages
  errorDiv.textContent = "";
  successDiv.textContent = "";

  // Validate input fields
  if (username.length < 3) {
    errorDiv.textContent = "Username must be at least 3 characters long!";
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = "Password must be at least 6 characters long!";
    return;
  }

  // Check if user already exists
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
  const userExists = existingUsers.some(
    (user) => user.username === username || user.email === email
  );

  if (userExists) {
    errorDiv.textContent = "Username or email already exists!";
    return;
  }

  // Save user data
  const newUser = {
    id: Date.now(),
    username: username,
    email: email,
    password: password,
    registrationDate: new Date().toISOString(),
  };

  existingUsers.push(newUser);
  localStorage.setItem("users", JSON.stringify(existingUsers));
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  successDiv.textContent = "Registration successful! Redirecting...";

  // Redirect after 2 seconds
  setTimeout(() => {
    window.location.href = getRedirectUrl();
  }, 2000);
});

// Login form handler
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const errorDiv = document.getElementById("loginError");
  errorDiv.textContent = "";

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // Check if no users exist
  if (users.length === 0) {
    errorDiv.textContent = "No registered users found. Please register first.";
    setTimeout(() => {
      container.classList.add("active");
    }, 1500);
    return;
  }

  // Find matching user
  const user = users.find(
    (u) =>
      (u.username === username || u.email === username) &&
      u.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Show success message
    const successDiv = document.getElementById("registerSuccess");
    successDiv.textContent = "Login successful! Redirecting...";

    // Redirect after 1 second
    setTimeout(() => {
      window.location.href = getRedirectUrl();
    }, 1000);
  } else {
    // Check if username exists but password is wrong
    const userExists = users.find(
      (u) => u.username === username || u.email === username
    );
    if (userExists) {
      errorDiv.textContent = "Incorrect password!";
    } else {
      errorDiv.textContent = "User not found. Please register first.";
      setTimeout(() => {
        container.classList.add("active");
      }, 1500);
    }
  }
});

// Check if coming from a redirect
document.addEventListener("DOMContentLoaded", () => {
  const redirectUrl = localStorage.getItem("redirectAfterLogin");
  if (redirectUrl) {
    const loginError = document.getElementById("loginError");
    loginError.style.color = "#f39c12";
    loginError.textContent = "Please login to continue...";

    // Clear message after 3 seconds
    setTimeout(() => {
      loginError.textContent = "";
    }, 3000);
  }
});
