function initCheckout() {
    // Load cart items in checkout
    renderCheckoutItems();
    updateCheckoutTotals();
    
    // Initialize multi-step form
    initMultiStepForm();
    
    // Payment method selection
    initPaymentMethods();
    
    // Form submission
    document.querySelector('.checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        completeCheckout();
    });
}

function renderCheckoutItems() {
    const checkoutItems = document.querySelector('.checkout-items');
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-image">
                <img src="assets/images/products/${item.image}" alt="${item.name}">
            </div>
            <div class="checkout-item-details">
                <h4>${item.name}</h4>
                <div class="checkout-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
            </div>
            <div class="checkout-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
}

function updateCheckoutTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    document.querySelector('.checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.checkout-total').textContent = `$${total.toFixed(2)}`;
}

function initMultiStepForm() {
    const steps = document.querySelectorAll('.checkout-step');
    const nextButtons = document.querySelectorAll('.btn-next-step');
    const prevButtons = document.querySelectorAll('.btn-prev-step');
    
    // Show first step initially
    steps[0].classList.add('active');
    updateProgressBar();
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.checkout-step');
            const nextStepId = this.dataset.next;
            const nextStep = document.getElementById(nextStepId);
            
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                currentStep.classList.remove('active');
                nextStep.classList.add('active');
                updateProgressBar();
                
                // If moving to review step, update the review information
                if (nextStepId === 'review-step') {
                    updateReviewInformation();
                }
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.checkout-step');
            const prevStepId = this.dataset.prev;
            const prevStep = document.getElementById(prevStepId);
            
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            updateProgressBar();
        });
    });
}

function validateStep(step) {
    const inputs = step.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    // Special validation for email
    const emailInput = step.querySelector('input[type="email"]');
    if (emailInput && !isValidEmail(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    }
    
    // Special validation for credit card if on payment step
    if (step.id === 'payment-step') {
        const cardInput = step.querySelector('.card-number');
        if (cardInput && !isValidCardNumber(cardInput.value)) {
            cardInput.classList.add('is-invalid');
            isValid = false;
        }
        
        const expiryInput = step.querySelector('.card-expiry');
        if (expiryInput && !isValidExpiry(expiryInput.value)) {
            expiryInput.classList.add('is-invalid');
            isValid = false;
        }
        
        const cvvInput = step.querySelector('.card-cvv');
        if (cvvInput && !isValidCVV(cvvInput.value)) {
            cvvInput.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showToast('Please fill all required fields correctly', 'error');
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidCardNumber(number) {
    // Simple validation - in real app would use payment processor validation
    return /^\d{13,16}$/.test(number.replace(/\s/g, ''));
}

function isValidExpiry(expiry) {
    return /^\d{2}\/\d{2}$/.test(expiry);
}

function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

function updateProgressBar() {
    const steps = document.querySelectorAll('.checkout-step');
    const progressItems = document.querySelectorAll('.progress-item');
    let currentActiveIndex = 0;
    
    steps.forEach((step, index) => {
        if (step.classList.contains('active')) {
            currentActiveIndex = index;
        }
    });
    
    progressItems.forEach((item, index) => {
        if (index < currentActiveIndex) {
            item.classList.add('completed');
            item.classList.remove('active');
        } else if (index === currentActiveIndex) {
            item.classList.add('active');
            item.classList.remove('completed');
        } else {
            item.classList.remove('active', 'completed');
        }
    });
}

function initPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding payment form
            const paymentType = this.dataset.payment;
            document.querySelectorAll('.payment-form').forEach(form => {
                form.style.display = form.id === `${paymentType}-form` ? 'block' : 'none';
            });
        });
    });
    
    // Select first payment method by default
    if (paymentMethods.length > 0) {
        paymentMethods[0].click();
    }
}

function updateReviewInformation() {
    // Customer information
    document.getElementById('review-name').textContent = 
        `${document.getElementById('first-name').value} ${document.getElementById('last-name').value}`;
    document.getElementById('review-email').textContent = document.getElementById('email').value;
    document.getElementById('review-phone').textContent = document.getElementById('phone').value;
    
    // Billing address
    const address = [
        document.getElementById('address').value,
        document.getElementById('city').value,
        document.getElementById('zip').value,
        document.getElementById('country').value
    ].filter(Boolean).join(', ');
    document.getElementById('review-address').textContent = address;
    
    // Payment method
    const activePayment = document.querySelector('.payment-method.active');
    document.getElementById('review-payment').textContent = 
        activePayment ? activePayment.querySelector('span').textContent : '';
}

function completeCheckout() {
    // In a real app, this would process payment with Stripe/PayPal/etc.
    // For demo, we'll just simulate success
    
    // Show loading state
    const submitButton = document.querySelector('.checkout-form .btn-primary');
    const originalText = submitButton.textContent;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Get customer email
        const email = document.getElementById('email').value;
        
        // Generate random order number
        const orderNumber = Math.floor(100000 + Math.random() * 900000);
        
        // Show success message
        document.querySelector('.checkout-form').style.display = 'none';
        document.querySelector('.checkout-success').style.display = 'block';
        document.getElementById('success-email').textContent = email;
        document.getElementById('order-number').textContent = orderNumber;
        
        // Clear cart
        cart = [];
        updateCart();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}