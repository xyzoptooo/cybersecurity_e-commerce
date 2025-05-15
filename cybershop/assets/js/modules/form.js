function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            this.classList.add('was-validated');
        }, false);
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(input) {
    const value = input.value.trim();
    const isRequired = input.required;
    const parent = input.closest('.form-group') || input.closest('.form-floating');
    
    // Reset validation state
    input.classList.remove('is-invalid', 'is-valid');
    if (parent) {
        const feedback = parent.querySelector('.invalid-feedback');
        if (feedback) feedback.style.display = 'none';
    }
    
    // Skip validation if field is not required and empty
    if (!isRequired && value === '') {
        return true;
    }
    
    let isValid = true;
    
    // Check required fields
    if (isRequired && value === '') {
        isValid = false;
        setValidationState(input, false, 'This field is required');
        return false;
    }
    
    // Check field types
    switch(input.type) {
        case 'email':
            if (!isValidEmail(value)) {
                isValid = false;
                setValidationState(input, false, 'Please enter a valid email address');
            }
            break;
            
        case 'tel':
            if (!isValidPhone(value)) {
                isValid = false;
                setValidationState(input, false, 'Please enter a valid phone number');
            }
            break;
            
        case 'password':
            if (input.id === 'password' && value.length < 8) {
                isValid = false;
                setValidationState(input, false, 'Password must be at least 8 characters');
            } else if (input.id === 'confirmPassword') {
                const password = document.getElementById('password').value;
                if (value !== password) {
                    isValid = false;
                    setValidationState(input, false, 'Passwords do not match');
                }
            }
            break;
            
        case 'text':
            if (input.classList.contains('card-number')) {
                if (!isValidCardNumber(value)) {
                    isValid = false;
                    setValidationState(input, false, 'Please enter a valid card number');
                }
            } else if (input.classList.contains('card-expiry')) {
                if (!isValidExpiry(value)) {
                    isValid = false;
                    setValidationState(input, false, 'Please enter a valid expiry date (MM/YY)');
                }
            } else if (input.classList.contains('card-cvv')) {
                if (!isValidCVV(value)) {
                    isValid = false;
                    setValidationState(input, false, 'Please enter a valid CVV');
                }
            }
            break;
    }
    
    if (isValid) {
        setValidationState(input, true);
    }
    
    return isValid;
}

function setValidationState(input, isValid, message = '') {
    const parent = input.closest('.form-group') || input.closest('.form-floating');
    
    if (isValid) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
    } else {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        
        if (parent) {
            const feedback = parent.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.textContent = message;
                feedback.style.display = 'block';
            }
        }
    }
}

function isValidPhone(phone) {
    // Simple phone validation
    return /^[\d\s\-\(\)\+]{10,}$/.test(phone);
}