// Products Data 
const products = [
    {
        id: 'av-pro-2023',
        name: 'CyberShield Antivirus Pro 2023',
        category: 'antivirus',
        price: 49.99,
        annualPrice: 39.99,
        image: 'antivirus-pro.jpg',
        description: 'Advanced protection against viruses, malware, ransomware and more with real-time threat detection.',
        features: [
            'Real-time antivirus protection',
            'Ransomware defense',
            'Web protection',
            'Performance optimizer',
            'VPN included (200MB/day)'
        ],
        rating: 4.8,
        reviews: 1245
    },
    {
        id: 'av-home-2023',
        name: 'CyberShield Antivirus Home',
        category: 'antivirus',
        price: 29.99,
        annualPrice: 24.99,
        image: 'antivirus-home.jpg',
        description: 'Essential protection for your home devices against viruses and malware.',
        features: [
            'Basic antivirus protection',
            'Web protection',
            'Email scanning',
            'Lightweight design'
        ],
        rating: 4.5,
        reviews: 876
    },
    {
        id: 'vpn-premium',
        name: 'CyberShield VPN Premium',
        category: 'vpn',
        price: 9.99,
        annualPrice: 7.99,
        image: 'vpn-premium.jpg',
        description: 'Secure your internet connection with military-grade encryption and access content worldwide.',
        features: [
            '500+ servers worldwide',
            'No-log policy',
            'Unlimited bandwidth',
            'Simultaneous connections on 5 devices'
        ],
        rating: 4.7,
        reviews: 892
    },
    {
        id: 'vpn-basic',
        name: 'CyberShield VPN Basic',
        category: 'vpn',
        price: 4.99,
        annualPrice: 3.99,
        image: 'vpn-basic.jpg',
        description: 'Basic VPN protection for secure browsing on public networks.',
        features: [
            '100+ servers',
            'No-log policy',
            'Limited bandwidth',
            'Simultaneous connections on 3 devices'
        ],
        rating: 4.3,
        reviews: 567
    },
    {
        id: 'firewall-pro',
        name: 'CyberShield Firewall Pro',
        category: 'firewall',
        price: 29.99,
        annualPrice: 24.99,
        image: 'firewall-pro.jpg',
        description: 'Advanced network protection with customizable rules and intrusion prevention.',
        features: [
            'Customizable rules',
            'Intrusion prevention',
            'Application control',
            'Network monitoring'
        ],
        rating: 4.9,
        reviews: 567
    },
    {
        id: 'pen-test-pro',
        name: 'CyberShield Pen Test Pro',
        category: 'pen-testing',
        price: 99.99,
        annualPrice: 89.99,
        image: 'pen-test.jpg',
        description: 'Professional penetration testing tools for security professionals.',
        features: [
            'Vulnerability scanning',
            'Exploit database',
            'Reporting tools',
            'Custom payloads'
        ],
        rating: 4.8,
        reviews: 342
    }
];

// Product Filtering and Sorting
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.querySelector('.sort-select');
    const searchInput = document.querySelector('.product-search');
    const productGrid = document.querySelector('.product-grid');
    
    // Load all products initially
    renderProducts(products);
    
    // Filter by category
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            const filteredProducts = category === 'all' 
                ? products 
                : products.filter(p => p.category === category);
            
            renderProducts(filteredProducts);
        });
    });
    
    // Sort products
    sortSelect.addEventListener('change', function() {
        const sortedProducts = [...products];
        const value = this.value;
        
        switch(value) {
            case 'price-low':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        
        renderProducts(sortedProducts);
    });
    
    // Search products
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
        
        renderProducts(filteredProducts);
    });
}

function renderProducts(productsToRender) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<p class="no-results">No products match your criteria.</p>';
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    // Initialize add to cart buttons for these products
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    });
}