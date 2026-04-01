// Authentication State
const authState = {
    isLoading: false
};

// DOM Elements
const getElements = () => ({
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),
    loginBtn: document.getElementById('login-btn'),
    signUpBtn: document.getElementById('sign-up-btn'),
    googleBtn: document.getElementById('google-btn'),
    guestBtn: document.getElementById('guest-btn'),
    togglePassword: document.getElementById('toggle-password'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    nameInput: document.getElementById('name')
});

// Initialize Auth Page
function initAuthPage() {
    const elements = getElements();
    
    // Check if already authenticated
    const token = localStorage.getItem('bibleai_token');
    if (token) {
        window.location.href = 'index.html';
        return;
    }

    setupAuthEventListeners();
}

// Setup Event Listeners
function setupAuthEventListeners() {
    const elements = getElements();

    // Toggle password visibility
    if (elements.togglePassword) {
        elements.togglePassword.addEventListener('click', togglePasswordVisibility);
    }

    // Login form
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form
    if (elements.signupForm) {
        elements.signupForm.addEventListener('submit', handleSignup);
    }

    // Google OAuth
    if (elements.googleBtn) {
        elements.googleBtn.addEventListener('click', handleGoogleAuth);
    }

    // Guest access
    if (elements.guestBtn) {
        elements.guestBtn.addEventListener('click', handleGuestAccess);
    }
}

// Toggle Password Visibility
function togglePasswordVisibility() {
    const elements = getElements();
    const passwordInput = elements.passwordInput;
    const toggleBtn = elements.togglePassword;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = `
            <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = `
            <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    if (authState.isLoading) return;

    const elements = getElements();
    const email = elements.emailInput.value.trim();
    const password = elements.passwordInput.value;

    // Validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    setLoading(elements.loginBtn, true);

    try {
        // Simulate API call (replace with actual authentication endpoint)
        await simulateAuthRequest({
            email,
            password,
            action: 'login'
        });

        // Store auth token and user info
        const token = generateToken();
        const userName = email.split('@')[0];
        
        localStorage.setItem('bibleai_token', token);
        localStorage.setItem('bibleai_user', userName);

        // Show success
        showSuccess('Login successful! Redirecting...');

        // Redirect to main app
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Login failed. Please check your credentials and try again.');
        setLoading(elements.loginBtn, false);
    }
}

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();

    if (authState.isLoading) return;

    const elements = getElements();
    const name = elements.nameInput.value.trim();
    const email = elements.emailInput.value.trim();
    const password = elements.passwordInput.value;

    // Validation
    if (!name || !email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (password.length < 8) {
        showError('Password must be at least 8 characters long');
        return;
    }

    setLoading(elements.signUpBtn, true);

    try {
        // Simulate API call (replace with actual registration endpoint)
        await simulateAuthRequest({
            name,
            email,
            password,
            action: 'signup'
        });

        // Store auth token and user info
        const token = generateToken();
        
        localStorage.setItem('bibleai_token', token);
        localStorage.setItem('bibleai_user', name);

        // Show success
        showSuccess('Account created successfully! Redirecting...');

        // Redirect to main app
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {
        console.error('Signup error:', error);
        showError(error.message || 'Signup failed. Please try again.');
        setLoading(elements.signUpBtn, false);
    }
}

// Handle Google OAuth
function handleGoogleAuth() {
    // In a real implementation, this would integrate with Google OAuth
    showError('Google OAuth integration coming soon! Please use email/password or guest access.');
    
    // Placeholder for Google OAuth flow:
    // 1. Redirect to Google OAuth consent page
    // 2. Handle callback with authorization code
    // 3. Exchange code for tokens
    // 4. Store tokens and redirect to app
}

// Handle Guest Access
function handleGuestAccess() {
    // Store guest token
    localStorage.setItem('bibleai_token', 'guest_token');
    localStorage.setItem('bibleai_user', 'Guest');

    // Show success
    showSuccess('Continuing as guest...');

    // Redirect to main app
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Simulate Authentication Request
async function simulateAuthRequest(data) {
    // This simulates an API call with a delay
    // In production, replace this with actual API endpoint
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful authentication
            // In reality, you would check credentials against your backend
            if (data.action === 'login') {
                // Simulate login validation
                resolve({
                    success: true,
                    token: generateToken(),
                    user: {
                        email: data.email,
                        name: data.email.split('@')[0]
                    }
                });
            } else if (data.action === 'signup') {
                // Simulate signup validation
                resolve({
                    success: true,
                    token: generateToken(),
                    user: {
                        name: data.name,
                        email: data.email
                    }
                });
            } else {
                reject(new Error('Invalid action'));
            }
        }, 1500);
    });
}

// Generate Token (for demo purposes)
function generateToken() {
    return 'bibleai_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Loading State
function setLoading(button, isLoading) {
    if (!button) return;

    authState.isLoading = isLoading;
    const span = button.querySelector('span');
    const loader = button.querySelector('.loader');

    if (isLoading) {
        button.disabled = true;
        if (span) span.style.opacity = '0';
        if (loader) loader.style.display = 'block';
    } else {
        button.disabled = false;
        if (span) span.style.opacity = '1';
        if (loader) loader.style.display = 'none';
    }
}

// Error Display
function showError(message) {
    // Create error notification
    const notification = createNotification(message, 'error');
    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Success Display
function showSuccess(message) {
    // Create success notification
    const notification = createNotification(message, 'success');
    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Create Notification Element
function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        backgroundColor: type === 'error' ? '#ef4444' : '#10b981',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '400px'
    });

    return notification;
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .notification.fade-out {
        animation: fadeOut 0.3s ease forwards;
    }

    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthPage);
} else {
    initAuthPage();
}
