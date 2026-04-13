// Hardcoded credentials for demo purposes
const VALID_USER = "admin";
const VALID_PASSWORD = "12345678";

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Get DOM elements
    const form = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    
    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get user input values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Clear previous message
        messageDiv.innerHTML = '';
        messageDiv.className = 'message';
        
        // Validate empty fields
        if (username === '' || password === '') {
            showMessage('Por favor, complete todos los campos', 'error');
            return;
        }
        
        // Validate credentials
        if (username === VALID_USER && password === VALID_PASSWORD) {
            // Save session and redirect
            localStorage.setItem('loggedUser', username);
            showMessage(`✅ ¡Bienvenido ${username}! Redirigiendo...`, 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            // Invalid credentials
            showMessage('❌ Usuario o contraseña incorrectos', 'error');
            document.getElementById('password').value = '';
        }
    });
    
    // Helper function to display messages
    function showMessage(text, type) {
        messageDiv.innerHTML = text;
        messageDiv.classList.add(type);
        
        // Auto-hide message after 3 seconds
        setTimeout(() => {
            messageDiv.innerHTML = '';
            messageDiv.className = 'message';
        }, 3000);
    }
});