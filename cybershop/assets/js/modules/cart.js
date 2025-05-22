// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product, quantity = 1) {
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    updateCart();
    showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showToast('Item removed from cart');
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    
    // If on cart page, update the display
    if (document.querySelector('.cart-items')) {
        renderCartItems();
        updateCartTotals();
    }
    
    // If on checkout page, update the display
    if (document.querySelector('.checkout-items')) {
        renderCheckoutItems();
        updateCheckoutTotals();
    }
}

function updateCartCounter() {
    const countElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    countElements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function renderCartItems() {
    const cartItemsEl = document.querySelector('.cart-items');
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        document.querySelector('.cart-totals').style.display = 'none';
        document.querySelector('.checkout-btn').style.display = 'none';
        return;
    }
    
    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="assets/images/products/${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const item = cart.find(item => item.id === productId);
            
            if (item.quantity > 1) {
                item.quantity--;
                updateCart();
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const item = cart.find(item => item.id === productId);
            item.quantity++;
            updateCart();
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            removeFromCart(productId);
        });
    });
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax for example
    const total = subtotal + tax;
    
    document.querySelector('.subtotal-amount').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.tax-amount').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
    
    // Show checkout button and totals
    document.querySelector('.cart-totals').style.display = 'block';
    document.querySelector('.checkout-btn').style.display = 'block';
}

function initCartPage() {
    renderCartItems();
    updateCartTotals();
    
    // Apply promo code
    const promoForm = document.querySelector('.promo-form');
    if (promoForm) {
        promoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const promoCode = this.elements['promo-code'].value;
            applyPromoCode(promoCode);
        });
    }
    
    // Proceed to checkout
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        }
    });
}

function applyPromoCode(code) {
    // In a real app, this would validate against a server
    const validCodes = {
        'CYBER20': 0.2,  // 20% off
        'SHIELD10': 0.1,  // 10% off
        'SECURE15': 0.15  // 15% off
    };
    
    if (validCodes[code]) {
        const discount = validCodes[code];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountAmount = subtotal * discount;
        
        document.querySelector('.discount-row').style.display = 'flex';
        document.querySelector('.discount-amount').textContent = `-$${discountAmount.toFixed(2)}`;
        
        const tax = (subtotal - discountAmount) * 0.1;
        const total = (subtotal - discountAmount) + tax;
        
        document.querySelector('.subtotal-amount').textContent = `$${(subtotal - discountAmount).toFixed(2)}`;
        document.querySelector('.tax-amount').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
        
        showToast('Promo code applied successfully!');
    } else {
        showToast('Invalid promo code', 'error');
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}