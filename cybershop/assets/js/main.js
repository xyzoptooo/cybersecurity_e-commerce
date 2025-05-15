// Main Application Controller
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme from localStorage or prefer-color-scheme
    initTheme();
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize cart counter
    updateCartCounter();
    
    // Load featured products on homepage
    if (document.querySelector('.featured-products')) {
        loadFeaturedProducts();
    }
    
    // Initialize product filtering if on products page
    if (document.querySelector('.product-filters')) {
        initProductFilters();
    }
    
    // Initialize product page functionality
    if (document.querySelector('.product-details')) {
        initProductPage();
    }
    
    // Initialize cart page functionality
    if (document.querySelector('.cart-items')) {
        initCartPage();
    }
    
    // Initialize checkout page functionality
    if (document.querySelector('.checkout-steps')) {
        initCheckout();
    }
    
    // Initialize form validation
    if (document.querySelector('.needs-validation')) {
        initFormValidation();
    }
});

// Theme Management
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme
    let currentTheme = localStorage.getItem('theme') || 
                     (prefersDarkScheme.matches ? 'dark' : 'light');
    document.body.classList.add(`${currentTheme}-theme`);
    updateThemeIcon(currentTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        currentTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${currentTheme}-theme`);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon(currentTheme);
    });
    
    // Watch for system theme changes
    prefersDarkScheme.addListener(e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.body.classList.remove('light-theme', 'dark-theme');
            document.body.classList.add(`${newTheme}-theme`);
            updateThemeIcon(newTheme);
        }
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const darkOverlay = document.createElement('div');
    darkOverlay.className = 'dark-overlay';
    document.body.appendChild(darkOverlay);
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        darkOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    darkOverlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        this.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
}

// Load featured products
function loadFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    
    // Clear skeleton loaders
    productGrid.innerHTML = '';
    
    // Get 3 featured products (in a real app, this would come from an API)
    const featuredProducts = [
        {
            id: 'av-pro-2023',
            name: 'CyberShield Antivirus Pro 2023',
            category: 'antivirus',
            price: 49.99,
            annualPrice: 39.99,
            image: 'antivirus-pro.jpg',
            description: 'Advanced protection against viruses, malware, ransomware and more with real-time threat detection.',
            rating: 4.8,
            reviews: 1245
        },
        {
            id: 'vpn-premium',
            name: 'CyberShield VPN Premium',
            category: 'vpn',
            price: 9.99,
            annualPrice: 7.99,
            image: 'vpn-premium.jpg',
            description: 'Secure your internet connection with military-grade encryption and access content worldwide.',
            rating: 4.7,
            reviews: 892
        },
        {
            id: 'firewall-pro',
            name: 'CyberShield Firewall Pro',
            category: 'firewall',
            price: 29.99,
            annualPrice: 24.99,
            image: 'firewall-pro.jpg',
            description: 'Advanced network protection with customizable rules and intrusion prevention.',
            rating: 4.9,
            reviews: 567
        }
    ];
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    // Initialize add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const product = featuredProducts.find(p => p.id === productId);
            addToCart(product);
        });
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="assets/images/products/${product.image}" alt="${product.name}">
        </div>
        <div class="product-content">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description.substring(0, 100)}...</p>
            <div class="product-price">$${product.price} <span>$${product.annualPrice}/yr</span></div>
            <div class="product-actions">
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                <a href="product.html?id=${product.id}" class="btn btn-secondary">View Details</a>
            </div>
        </div>
    `;
    
    return card;
}

// Utility function to load scripts dynamically
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.body.appendChild(script);
}