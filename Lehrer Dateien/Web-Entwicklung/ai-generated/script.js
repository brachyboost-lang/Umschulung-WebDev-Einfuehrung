// Produkte-Datenbank
const products = [
    {
        id: 1,
        name: 'MacBook Pro 14"',
        category: 'laptops',
        price: 2199.00,
        description: 'Leistungsstarker Laptop mit M3 Chip',
        emoji: '💻'
    },
    {
        id: 2,
        name: 'iPhone 15 Pro',
        category: 'phones',
        price: 1299.00,
        description: 'Neuestes Smartphone mit A17 Pro',
        emoji: '📱'
    },
    {
        id: 3,
        name: 'AirPods Pro',
        category: 'accessories',
        price: 279.00,
        description: 'Kabellose Kopfhörer mit Noise Cancelling',
        emoji: '🎧'
    },
    {
        id: 4,
        name: 'Dell XPS 15',
        category: 'laptops',
        price: 1799.00,
        description: 'Premium Windows Laptop',
        emoji: '💻'
    },
    {
        id: 5,
        name: 'Samsung Galaxy S24',
        category: 'phones',
        price: 999.00,
        description: 'Android Flaggschiff-Smartphone',
        emoji: '📱'
    },
    {
        id: 6,
        name: 'Magic Mouse',
        category: 'accessories',
        price: 99.00,
        description: 'Ergonomische kabellose Maus',
        emoji: '🖱️'
    },
    {
        id: 7,
        name: 'ThinkPad X1 Carbon',
        category: 'laptops',
        price: 1599.00,
        description: 'Business Laptop mit langer Akkulaufzeit',
        emoji: '💻'
    },
    {
        id: 8,
        name: 'Google Pixel 8',
        category: 'phones',
        price: 799.00,
        description: 'Smartphone mit bester Kamera',
        emoji: '📱'
    },
    {
        id: 9,
        name: 'USB-C Hub',
        category: 'accessories',
        price: 49.00,
        description: 'Multi-Port Adapter für alle Geräte',
        emoji: '🔌'
    }
];

// Warenkorb
let cart = [];

// DOM Elemente
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart-icon');
const closeCartBtn = document.getElementById('closeCart');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    displayProducts('all');
    loadCart();
    setupEventListeners();
});

// Event Listeners einrichten
function setupEventListeners() {
    // Warenkorb öffnen/schließen
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            displayProducts(category);
        });
    });
}

// Produkte anzeigen
function displayProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        In den Warenkorb
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Kategorienamen übersetzen
function getCategoryName(category) {
    const names = {
        'laptops': 'Laptops',
        'phones': 'Smartphones',
        'accessories': 'Zubehör'
    };
    return names[category] || category;
}

// Preis formatieren
function formatPrice(price) {
    return price.toLocaleString('de-DE', {
        style: 'currency',
        currency: 'EUR'
    });
}

// Produkt zum Warenkorb hinzufügen
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    saveCart();
    cartSidebar.classList.add('open');
}

// Warenkorb aktualisieren
function updateCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Ihr Warenkorb ist leer</div>';
        cartTotal.textContent = formatPrice(0);
        cartCount.textContent = '0';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">×</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(total);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Menge aktualisieren
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
        saveCart();
    }
}

// Produkt aus Warenkorb entfernen
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
}

// Warenkorb speichern
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Warenkorb laden
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}
