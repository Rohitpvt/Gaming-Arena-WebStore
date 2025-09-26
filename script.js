"use strict";

/**
 * add event on multiple elements
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

/**
 * MOBILE NAVBAR
 * navbar will show after clicking menu button
 */
const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const toggleNav = function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
};

navToggler.addEventListener("click", toggleNav);

const navClose = () => {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
};

addEventOnElements(navLinks, "click", navClose);

/**
 * HEADER and BACK TOP BTN
 * header and back top btn will be active after scrolled down to 100px of screen
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeEl = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
};

window.addEventListener("scroll", activeEl);

/**
 * Button hover ripple effect
 */
const buttons = document.querySelectorAll("[data-btn]");

const buttonHoverRipple = function (event) {
  this.style.setProperty("--top", `${event.offsetY}px`);
  this.style.setProperty("--left", `${event.offsetX}px`);
};

addEventOnElements(buttons, "mousemove", buttonHoverRipple);

/**
 * Scroll reveal
 */
const revealElements = document.querySelectorAll("[data-reveal]");

const revealElementOnScroll = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    const isElementInsideWindow =
      revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.1;

    if (isElementInsideWindow) {
      revealElements[i].classList.add("revealed");
    }
  }
};

window.addEventListener("scroll", revealElementOnScroll);
window.addEventListener("load", revealElementOnScroll);

/**
 * Custom cursor
 */
const cursor = document.querySelector("[data-cursor]");
const hoverElements = [
  ...document.querySelectorAll("a"),
  ...document.querySelectorAll("button"),
];

const cursorMove = function (event) {
  cursor.style.top = `${event.clientY}px`;
  cursor.style.left = `${event.clientX}px`;
};

window.addEventListener("mousemove", cursorMove);

addEventOnElements(hoverElements, "mouseover", function () {
  cursor.classList.add("hovered");
});

addEventOnElements(hoverElements, "mouseout", function () {
  cursor.classList.remove("hovered");
});

/**
 * PROFILE BUTTON AUTHENTICATION CHECK
 * Check if user is logged in when profile button is clicked
 */
const profileBtn = document.querySelector(".profile-btn");

// Function to check if user is logged in
function checkUserAuthentication() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return currentUser !== null;
}

// Function to update profile button based on login status
function updateProfileButton() {
  if (!profileBtn) return; // Safety check added

  const isLoggedIn = checkUserAuthentication();

  if (isLoggedIn) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    profileBtn.title = `Logged in as: ${currentUser.username}`;

    // Change icon to logged in state (optional)
    const profileIcon = profileBtn.querySelector("ion-icon");
    if (profileIcon) {
      // Safety check added
      profileIcon.setAttribute("name", "person");
    }
  } else {
    profileBtn.title = "Login / Register";

    // Keep default icon
    const profileIcon = profileBtn.querySelector("ion-icon");
    if (profileIcon) {
      // Safety check added
      profileIcon.setAttribute("name", "person-outline");
    }
  }
}

// Profile button click handler
function handleProfileClick() {
  const isLoggedIn = checkUserAuthentication();

  if (isLoggedIn) {
    // User is logged in - show profile options
    showProfileMenu();
  } else {
    // User is not logged in - redirect to login page
    // Store current page for redirect after login
    localStorage.setItem("redirectAfterLogin", window.location.href);
    window.location.href = "./LoginSignup.html";
  }
}

// Function to show profile menu for logged in users
function showProfileMenu() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Create profile dropdown menu
  const existingMenu = document.querySelector(".profile-dropdown");
  if (existingMenu) {
    existingMenu.remove();
  }

  const profileMenu = document.createElement("div");
  profileMenu.className = "profile-dropdown";
  profileMenu.innerHTML = `
    <div class="profile-dropdown-content">
      <div class="profile-user-info">
        <ion-icon name="person-circle"></ion-icon>
        <div>
          <strong>${currentUser.username}</strong>
          <small>${currentUser.email}</small>
        </div>
      </div>
      <hr>
      <button class="profile-menu-item" id="viewProfile">
        <ion-icon name="person-outline"></ion-icon>
        View Profile
      </button>
      <button class="profile-menu-item" id="accountSettings">
        <ion-icon name="settings-outline"></ion-icon>
        Account Settings
      </button>
      <hr>
      <button class="profile-menu-item logout-item" id="logoutBtn">
        <ion-icon name="log-out-outline"></ion-icon>
        Logout
      </button>
    </div>
  `;

  // Position the menu relative to profile button
  const profileBtnRect = profileBtn.getBoundingClientRect();
  profileMenu.style.position = "fixed";
  profileMenu.style.top = `${profileBtnRect.bottom + 10}px`;
  profileMenu.style.right = `${window.innerWidth - profileBtnRect.right}px`;
  profileMenu.style.zIndex = "1000";

  document.body.appendChild(profileMenu);

  // Add event listeners to menu items
  document.getElementById("viewProfile").addEventListener("click", () => {
    profileMenu.remove();
    window.location.href = "./profile.html";
  });

  document.getElementById("accountSettings").addEventListener("click", () => {
    alert(
      "Account settings functionality - you can redirect to settings page here"
    );
    profileMenu.remove();
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    profileMenu.remove();
    updateProfileButton();
    alert("You have been logged out successfully!");
  });

  // Close menu when clicking outside
  const closeMenu = (event) => {
    if (
      !profileMenu.contains(event.target) &&
      !profileBtn.contains(event.target)
    ) {
      profileMenu.remove();
      document.removeEventListener("click", closeMenu);
    }
  };

  setTimeout(() => {
    document.addEventListener("click", closeMenu);
  }, 100);
}

// Add event listener to profile button when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.querySelector(".profile-btn");

  if (profileBtn) {
    profileBtn.addEventListener("click", handleProfileClick);
    updateProfileButton();
  }

  // Listen for login status changes (when user comes back from login page)
  window.addEventListener("focus", () => {
    updateProfileButton();
  });
});
