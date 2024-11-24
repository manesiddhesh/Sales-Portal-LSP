let isAuthenticated = false;
let logoutTimer; // Timer for automatic logout

// Function to toggle login modal display
function toggleLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (!isAuthenticated) {
        loginModal.style.display = 'block';
    } else {
        logout();
    }
}

// Function to handle login form submission
function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Hardcoded admin credentials for demo purposes
    if (username === 'admin' && password === 'password') {
        loginSuccess();
        return false; // Prevent form submission
    } else {
        loginFailed();
        return false; // Prevent form submission
    }
}

// Function to handle successful login
function loginSuccess() {
    isAuthenticated = true;
    updateLoginLogoutButton();
    closeLoginModal();

    // Store authentication status in session storage
    sessionStorage.setItem('isAuthenticated', 'true');

    // Start logout timer for inactivity
    startLogoutTimer();

    // Redirect to dashboard.html
    window.location.href = '/dashboard.html';
}

// Function to handle failed login attempt
function loginFailed() {
    const errorMessage = document.getElementById('message');
    errorMessage.style.display = 'block';
}

// Function to handle logout
function logout() {
    isAuthenticated = false;
    updateLoginLogoutButton();

    // Clear session storage or any authentication-related data
    sessionStorage.clear();

    // Perform logout request to server
    fetch('/logout', {
        method: 'GET',
        credentials: 'same-origin', // Ensures cookies are sent with the request
    })
    .then(response => {
        if (response.ok) {
            // Remove previous page from history stack
            window.history.replaceState(null, null, null);

            // Redirect after successful logout
            window.location.href = 'index.html';
        } else {
            console.error('Logout failed');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to update login/logout button text and behavior
function updateLoginLogoutButton() {
    const button = document.getElementById('loginLogoutButton');
    if (isAuthenticated) {
        button.innerHTML = '<i class="fas fa-user"></i> ';
    } else {
        button.innerHTML = '<i class="fas fa-user"></i> ';
    }
}

// Function to close login modal
function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    loginModal.style.display = 'none';
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    if (event.target == loginModal) {
        closeLoginModal();
    }
}

// Function to start the logout timer (1 minute of inactivity)
function startLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(logout, 60000); // 1 minute = 60000 milliseconds
}

// Event listener to reset the timer on user activity
window.onmousemove = startLogoutTimer;
window.onkeydown = startLogoutTimer;

// Logout button functionality
document.getElementById('logoutButton').addEventListener('click', function() {
    logout();
});

// Function to check authentication status on page load
function checkAuthentication() {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    if (!authStatus || authStatus !== 'true') {
        window.location.href = 'index.html'; // Redirect to login if not authenticated
    } else {
        // Clear session storage when navigating away from protected page
        window.addEventListener('beforeunload', function() {
            sessionStorage.clear();
        });
    }
}

// Ensure the authentication check happens even on back navigation
window.addEventListener('pageshow', function(event) {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        checkAuthentication(); // Re-check authentication status
    }
});

// Call checkAuthentication on protected pages like dashboard.html
checkAuthentication();
