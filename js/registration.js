// Simulated database for uniqueness checks
const existingUsers = {
    usernames: ['admin', 'test123', 'agumon01', 'digimaster'],
    emails: ['admin@digimon.com', 'test@test.com', 'fan1@digimon.com']
};

const form = document.getElementById('registrationForm');
const inputs = form.querySelectorAll('input, select');

// Real-time validation
inputs.forEach(input => {
    input.addEventListener('input', () => validateField(input));
    input.addEventListener('blur', () => validateField(input));
});

// File upload handling
const avatarInput = document.getElementById('avatar');
const fileUploadText = document.getElementById('fileUploadText');
const fileInfo = document.getElementById('fileInfo');

avatarInput.addEventListener('change', handleFileUpload);

function handleFileUpload(e) {
    const file = e.target.files[0];
    const errorDiv = document.getElementById('avatarError');
    
    if (!file) {
        fileUploadText.textContent = '📁 Choose an avatar (JPG/PNG, max 1MB)';
        fileInfo.style.display = 'none';
        hideError('avatarError');
        return;
    }

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        showError('avatarError', 'Please upload a JPG or PNG image only.');
        e.target.value = '';
        fileUploadText.textContent = '📁 Choose an avatar (JPG/PNG, max 1MB)';
        fileInfo.style.display = 'none';
        return;
    }

    // File size validation (1MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
        showError('avatarError', 'File size must be less than 1MB.');
        e.target.value = '';
        fileUploadText.textContent = '📁 Choose an avatar (JPG/PNG, max 1MB)';
        fileInfo.style.display = 'none';
        return;
    }

    // Success
    hideError('avatarError');
    fileUploadText.textContent = `✅ ${file.name}`;
    fileInfo.innerHTML = `
        <strong>File Details:</strong><br>
        Name: ${file.name}<br>
        Size: ${(file.size / 1024).toFixed(2)} KB<br>
        Type: ${file.type}
    `;
    fileInfo.style.display = 'block';
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();

    switch (fieldName) {
        case 'fullName':
            validateFullName(value);
            break;
        case 'username':
            validateUsername(value);
            break;
        case 'email':
            validateEmail(value);
            break;
        case 'password':
            validatePassword(value);
            break;
        case 'confirmPassword':
            validateConfirmPassword(value);
            break;
        case 'favoriteDigimon':
            validateFavoriteDigimon(value);
            break;
        case 'region':
            validateRegion(value);
            break;
        case 'terms':
            validateTerms(field.checked);
            break;
    }
}

function validateFullName(value) {
    if (!value) {
        showError('fullNameError', 'Full name is required.');
        return false;
    }
    if (value.length < 2) {
        showError('fullNameError', 'Full name must be at least 2 characters long.');
        return false;
    }
    hideError('fullNameError');
    return true;
}

function validateUsername(value) {
    if (!value) {
        showError('usernameError', 'Username is required.');
        return false;
    }
    if (value.length < 5 || value.length > 12) {
        showError('usernameError', 'Username must be 5-12 characters long.');
        return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
        showError('usernameError', 'Username can only contain letters and numbers.');
        return false;
    }
    if (existingUsers.usernames.includes(value.toLowerCase())) {
        showError('usernameError', 'This username is already taken.');
        return false;
    }
    hideError('usernameError');
    showSuccess('usernameSuccess', 'Username is available!');
    return true;
}

function validateEmail(value) {
    if (!value) {
        showError('emailError', 'Email address is required.');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showError('emailError', 'Please enter a valid email address.');
        return false;
    }
    if (existingUsers.emails.includes(value.toLowerCase())) {
        showError('emailError', 'This email address is already registered.');
        return false;
    }
    hideError('emailError');
    showSuccess('emailSuccess', 'Email is available!');
    return true;
}

function validatePassword(value) {
    const strengthBar = document.getElementById('passwordStrengthBar');
    
    if (!value) {
        showError('passwordError', 'Password is required.');
        strengthBar.style.width = '0%';
        return false;
    }
    if (value.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters long.');
        strengthBar.style.width = '25%';
        strengthBar.className = 'password-strength-bar strength-weak';
        return false;
    }
    
    const hasLetters = /[a-zA-Z]/.test(value);
    const hasNumbers = /\d/.test(value);
    
    if (!hasLetters || !hasNumbers) {
        showError('passwordError', 'Password must include both letters and numbers.');
        strengthBar.style.width = '50%';
        strengthBar.className = 'password-strength-bar strength-weak';
        return false;
    }

    // Password strength calculation
    let strength = 0;
    if (value.length >= 8) strength++;
    if (hasLetters && hasNumbers) strength++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) strength++;

    if (strength <= 2) {
        strengthBar.style.width = '60%';
        strengthBar.className = 'password-strength-bar strength-weak';
    } else if (strength === 3) {
        strengthBar.style.width = '80%';
        strengthBar.className = 'password-strength-bar strength-medium';
    } else {
        strengthBar.style.width = '100%';
        strengthBar.className = 'password-strength-bar strength-strong';
    }

    hideError('passwordError');
    
    // Re-validate confirm password if it has a value
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (confirmPassword) {
        validateConfirmPassword(confirmPassword);
    }
    
    return true;
}

function validateConfirmPassword(value) {
    const password = document.getElementById('password').value;
    
    if (!value) {
        showError('confirmPasswordError', 'Please confirm your password.');
        return false;
    }
    if (value !== password) {
        showError('confirmPasswordError', 'Passwords do not match.');
        return false;
    }
    hideError('confirmPasswordError');
    showSuccess('confirmPasswordSuccess', 'Passwords match!');
    return true;
}

function validateFavoriteDigimon(value) {
    if (!value) {
        showError('favoriteDigimonError', 'Please select your favorite Digimon.');
        return false;
    }
    hideError('favoriteDigimonError');
    return true;
}

function validateRegion(value) {
    if (!value) {
        showError('regionError', 'Please select your region.');
        return false;
    }
    hideError('regionError');
    return true;
}

function validateTerms(checked) {
    if (!checked) {
        showError('termsError', 'You must agree to the Terms and Conditions.');
        return false;
    }
    hideError('termsError');
    return true;
}

function showError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    const field = document.querySelector(`[name="${elementId.replace('Error', '')}"]`);
    const successDiv = document.getElementById(elementId.replace('Error', 'Success'));
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    if (field) field.classList.add('error');
    if (successDiv) successDiv.style.display = 'none';
}

function hideError(elementId) {
    const errorDiv = document.getElementById(elementId);
    const field = document.querySelector(`[name="${elementId.replace('Error', '')}"]`);
    
    errorDiv.style.display = 'none';
    if (field) field.classList.remove('error');
}

function showSuccess(elementId, message) {
    const successDiv = document.getElementById(elementId);
    const field = document.querySelector(`[name="${elementId.replace('Success', '')}"]`);
    
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    if (field) field.classList.add('success');
}

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateAllFields();
    
    if (isValid) {
        // Collect form data
        const userData = {
            fullName: document.getElementById('fullName').value.trim(),
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            favoriteDigimon: document.getElementById('favoriteDigimon').value,
            region: document.getElementById('region').value,
            avatar: document.getElementById('avatar').files[0] ? 
                   document.getElementById('avatar').files[0].name : null
        };
        
        // Save user to storage
        const savedUser = digimonStorage.saveUser(userData);
        
        // Set as current logged-in user
        digimonStorage.setCurrentUser(userData.username);
        
        // Success message
        alert('🎉 Welcome to the Digital World! Your registration was successful.');
        
        // Add to "database" to simulate uniqueness
        existingUsers.usernames.push(userData.username.toLowerCase());
        existingUsers.emails.push(userData.email.toLowerCase());
        
        // Reset form
        form.reset();
        document.getElementById('passwordStrengthBar').style.width = '0%';
        document.getElementById('fileInfo').style.display = 'none';
        document.getElementById('fileUploadText').textContent = '📁 Choose an avatar (JPG/PNG, max 1MB)';
        
        // Clear all validation states
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        // Hide all messages
        document.querySelectorAll('.error-message, .success-message').forEach(msg => {
            msg.style.display = 'none';
        });
        
        // Redirect to gallery after 2 seconds
        setTimeout(() => {
            window.location.href = 'Gallery.html';
        }, 2000);
    }
});

function validateAllFields() {
    let isValid = true;
    
    // Validate all required fields
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const favoriteDigimon = document.getElementById('favoriteDigimon').value;
    const region = document.getElementById('region').value;
    const terms = document.getElementById('terms').checked;
    
    if (!validateFullName(fullName)) isValid = false;
    if (!validateUsername(username)) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (!validatePassword(password)) isValid = false;
    if (!validateConfirmPassword(confirmPassword)) isValid = false;
    if (!validateFavoriteDigimon(favoriteDigimon)) isValid = false;
    if (!validateRegion(region)) isValid = false;
    if (!validateTerms(terms)) isValid = false;
    
    return isValid;
}