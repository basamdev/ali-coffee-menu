// Login.js - Handles admin authentication

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                loginError.textContent = 'Please fill in all fields';
                loginError.style.display = 'block';
                return;
            }
            
            // Sign in with Firebase
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in successfully
                    loginError.style.display = 'none';
                    // Redirect to admin panel
                    window.location.href = 'admin.html';
                })
                .catch((error) => {
                    const errorCode = error.code;
                    let errorMessage = 'Authentication failed';
                    
                    if (errorCode === 'auth/user-not-found') {
                        errorMessage = 'No user found with this email';
                    } else if (errorCode === 'auth/wrong-password') {
                        errorMessage = 'Invalid password';
                    }
                    
                    loginError.textContent = errorMessage;
                    loginError.style.display = 'block';
                });
        });
    }
    
    // Check if user is already logged in when loading login page
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, redirect to admin
            window.location.href = 'admin.html';
        }
    });
});