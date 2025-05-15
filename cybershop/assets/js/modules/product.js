function initProductPage() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Find product in our data (would normally fetch from API)
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        document.querySelector('.product-details').innerHTML = `
            <div class="product-not-found">
                <h2>Product not found</h2>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }
    
    // Render product details
    renderProductDetails(product);
    
    // Initialize subscription toggle
    initSubscriptionToggle(product);
    
    // Initialize add to cart button
    document.querySelector('.add-to-cart').addEventListener('click', function() {
        const quantity = parseInt(document.querySelector('.product-quantity input').value);
        addToCart(product, quantity);
    });
    
    // Initialize product tabs
    initProductTabs();
}

function renderProductDetails(product) {
    document.querySelector('.product-name').textContent = product.name;
    document.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
    document.querySelector('.annual-price .price').textContent = `$${product.annualPrice.toFixed(2)}`;
    document.querySelector('.product-rating').innerHTML = `
        ${generateStarRating(product.rating)} 
        <span>${product.rating} (${product.reviews} reviews)</span>
    `;
    document.querySelector('.product-description').textContent = product.description;
    document.querySelector('.main-image img').src = `assets/images/products/${product.image}`;
    document.querySelector('.main-image img').alt = product.name;
    
    // Render features list
    const featuresList = document.querySelector('.product-features ul');
    featuresList.innerHTML = product.features.map(feature => `
        <li><i class="fas fa-check-circle"></i> ${feature}</li>
    `).join('');
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

function initSubscriptionToggle(product) {
    const toggleButtons = document.querySelectorAll('.pricing-toggle button');
    const priceDisplay = document.querySelector('.price-display #price');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const plan = this.dataset.plan;
            if (plan === 'annual') {
                priceDisplay.textContent = `$${product.annualPrice.toFixed(2)}`;
                document.querySelector('.billing-cycle').textContent = '/year';
            } else {
                priceDisplay.textContent = `$${product.price.toFixed(2)}`;
                document.querySelector('.billing-cycle').textContent = '/month';
            }
        });
    });
}

function initProductTabs() {
    const tabButtons = document.querySelectorAll('.product-tabs button');
    const tabContents = document.querySelectorAll('.product-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.style.display = content.id === tabId ? 'block' : 'none';
            });
        });
    });
    
    // Show first tab by default
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
}