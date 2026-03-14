// Product Data
const products = [
  { id: '1', name: 'Wireless Headphones', category: 'tech', price: 129.99, rating: 4.8, image: 'img/Wireless Headphones.png', stock: true, badge: 'Bestseller', maxQty: 5 },
  { id: '2', name: 'Smart Watch Pro', category: 'tech', price: 299.99, rating: 4.6, image: 'img/Smart Watch Pro.png', stock: true, badge: 'New', maxQty: 3 },
  { id: '3', name: 'Gaming Mouse', category: 'tech', price: 59.99, rating: 4.9, image: 'img/Gaming Mouse.png', stock: false, badge: 'Sold Out', maxQty: 0 },
  { id: '4', name: 'Cotton Hoodie', category: 'fashion', price: 79.99, rating: 4.7, image: 'img/Cotton Hoodie.png', stock: true, badge: 'Sale', maxQty: 10 },
  { id: '5', name: 'Designer Sneakers', category: 'fashion', price: 149.99, rating: 4.5, image: 'img/Designer Sneakers.png', stock: true, maxQty: 8 },
  { id: '6', name: 'Leather Backpack', category: 'fashion', price: 199.99, rating: 4.8, image: 'img/Leather Backpack.png', stock: true, maxQty: 6 },
  { id: '7', name: 'Smart Light Bulb', category: 'home', price: 39.99, rating: 4.4, image: 'img/Smart Light Bulb.png', stock: true, maxQty: 15 },
  { id: '8', name: 'Coffee Maker', category: 'home', price: 89.99, rating: 4.6, image: 'img/Coffee Maker.png', stock: true, maxQty: 4 },
  { id: '9', name: 'Ceramic Vase', category: 'home', price: 49.99, rating: 4.7, image: 'img/Ceramic Vase.png', stock: true, maxQty: 12 }
];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('overlay');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const searchInput = document.getElementById('searchInput');
const navLinks = document.querySelectorAll('.nav-link');
const inStockOnly = document.getElementById('inStockOnly');
const sortSelect = document.getElementById('sortSelect');
const cartCount = document.getElementById('cartCount');
const heroCartCount = document.getElementById('heroCartCount');
const heroTotal = document.getElementById('heroTotal');
const sidebarCartCount = document.getElementById('sidebarCartCount');
const sidebarTotal = document.getElementById('sidebarTotal');
const cartItemsList = document.getElementById('cartItemsList');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');
const themeToggle = document.getElementById('themeToggle');
const wishlistToggle = document.getElementById('wishlistToggle');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const closeWishlist = document.getElementById('closeWishlist');
const wishlistItemsList = document.getElementById('wishlistItemsList');
const wishlistCount = document.getElementById('wishlistCount');
const wishlistItemCount = document.getElementById('wishlistItemCount');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const checkoutForm = document.getElementById('checkoutForm');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutSummary = document.getElementById('checkoutSummary');
const priceRange = document.getElementById('priceRange');
const priceVal = document.getElementById('priceVal');
const scrollTop = document.getElementById('scrollTop');
const searchSuggestions = document.getElementById('searchSuggestions');
const promoClose = document.querySelector('.promo-close');

// State
let cart = JSON.parse(localStorage.getItem('ecommerce-cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('ecommerce-wishlist')) || [];
let orderHistory = JSON.parse(localStorage.getItem('ecommerce-orders')) || [];
let filteredProducts = [...products];
let currentFilter = 'all';
let searchTerm = '';
let sortBy = 'default';
let stockOnly = false;
let maxPrice = 500;
let currentTheme = localStorage.getItem('theme') || 'dark';
let isLoading = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  try {
    initTheme();
    renderProducts();
    updateCartDisplay();
    updateWishlistDisplay();
    setupEventListeners();
    restoreFormData();
  } catch (error) {
    handleError('Initialization failed', error);
  }
});

function initTheme() {
  currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', currentTheme);
  document.documentElement.setAttribute('data-theme', currentTheme);
  showToast(`Switched to ${currentTheme} mode`);
}

function setupEventListeners() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      currentFilter = link.dataset.filter;
      navMenu.classList.remove('active');
      renderProducts();
    });
  });

  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    updateSearchSuggestions();
    renderProducts();
  });
  
  searchInput.addEventListener('blur', () => {
    setTimeout(() => searchSuggestions.classList.remove('active'), 200);
  });

  inStockOnly.addEventListener('change', (e) => {
    stockOnly = e.target.checked;
    renderProducts();
  });

  priceRange.addEventListener('input', (e) => {
    maxPrice = parseInt(e.target.value);
    priceVal.textContent = maxPrice;
    renderProducts();
  });

  sortSelect.addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderProducts();
  });

  cartToggle.addEventListener('click', toggleCart);
  closeCart.addEventListener('click', toggleCart);
  wishlistToggle.addEventListener('click', toggleWishlist);
  closeWishlist.addEventListener('click', toggleWishlist);
  clearCartBtn.addEventListener('click', showClearCartModal);
  checkoutBtn.addEventListener('click', openCheckout);
  closeCheckout.addEventListener('click', closeCheckoutModal);
  checkoutForm.addEventListener('submit', handleCheckout);
  themeToggle.addEventListener('click', toggleTheme);
  
  window.addEventListener('scroll', () => {
    scrollTop.classList.toggle('visible', window.scrollY > 300);
  });
  
  scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  promoClose.addEventListener('click', (e) => {
    e.target.closest('.promo-banner').style.display = 'none';
  });
  
  checkoutOverlay.addEventListener('click', (e) => {
    if (e.target === checkoutOverlay) closeCheckoutModal();
  });

  // Form auto-save
  checkoutForm.addEventListener('change', saveFormData);
}

function updateSearchSuggestions() {
  if (!searchTerm) {
    searchSuggestions.classList.remove('active');
    return;
  }
  
  const suggestions = products
    .filter(p => p.name.toLowerCase().includes(searchTerm))
    .slice(0, 5)
    .map(p => `<div class="suggestion-item" onclick="searchInput.value='${p.name}'; searchTerm='${p.name.toLowerCase()}'; renderProducts(); searchSuggestions.classList.remove('active');">${p.name}</div>`)
    .join('');
  
  searchSuggestions.innerHTML = suggestions;
  searchSuggestions.classList.toggle('active', suggestions.length > 0);
}

function renderProducts() {
  try {
    setLoading(true);
    
    filteredProducts = products.filter(product => {
      const matchesCategory = currentFilter === 'all' || product.category === currentFilter;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      const matchesStock = !stockOnly || product.stock;
      const matchesPrice = product.price <= maxPrice;
      return matchesCategory && matchesSearch && matchesStock && matchesPrice;
    });

    filteredProducts.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

    const badgeClass = { 'Bestseller': 'badge-bestseller', 'New': 'badge-new', 'Sale': 'badge-sale', 'Sold Out': 'badge-soldout' };

    productsGrid.innerHTML = filteredProducts.map(product => {
      const isWishlisted = wishlist.includes(product.id);
      const cartItem = cart.find(item => item.id === product.id);
      const currentQty = cartItem ? cartItem.quantity : 0;
      const canAddMore = currentQty < product.maxQty;
      
      return `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          ${product.badge ? `<span class="product-badge ${badgeClass[product.badge] || ''}">${product.badge}</span>` : ''}
          ${currentQty > 0 ? `<span class="product-qty-badge">${currentQty} in cart</span>` : ''}
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-title">${product.name}</h3>
          <div class="product-meta">
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-rating">⭐ ${product.rating} <span>(${Math.floor(Math.random()*200+50)})</span></div>
          </div>
          ${!product.stock ? '<div class="out-of-stock-label">⚠ Out of stock</div>' : ''}
          ${currentQty >= product.maxQty ? `<div class="out-of-stock-label">Max quantity reached</div>` : ''}
          <div class="product-actions">
            <button class="btn btn-primary add-to-cart" data-id="${product.id}" ${!product.stock || !canAddMore ? 'disabled' : ''}>
              ${!product.stock ? 'Sold Out' : !canAddMore ? 'Max Qty' : 'Add to Cart'}
            </button>
            <button class="btn btn-secondary wishlist-btn" data-id="${product.id}" title="Add to Wishlist" style="color: ${isWishlisted ? 'var(--danger)' : 'var(--text-secondary)'}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
    }).join('');

    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        addToCart(productId);
      });
    });

    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.currentTarget.dataset.id;
        toggleWishlistItem(productId);
      });
    });

    setLoading(false);
  } catch (error) {
    handleError('Failed to render products', error);
    setLoading(false);
  }
}

function addToCart(productId) {
  try {
    const product = products.find(p => p.id === productId);
    if (!product || !product.stock) return;

    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
      if (cartItem.quantity >= product.maxQty) {
        showToast(`Maximum quantity (${product.maxQty}) reached for ${product.name}`);
        return;
      }
      cartItem.quantity++;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
    updateCartDisplay();
    renderProducts();
    showToast(`${product.name} added to cart!`);
  } catch (error) {
    handleError('Error adding to cart', error);
  }
}

function removeFromCart(productId) {
  try {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
    renderCartItems();
    updateCartDisplay();
    renderProducts();
    showToast('Item removed from cart');
  } catch (error) {
    handleError('Error removing item', error);
  }
}

function updateQuantity(productId, change) {
  try {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
      cartItem.quantity += change;
      
      if (cartItem.quantity <= 0) {
        removeFromCart(productId);
      } else if (cartItem.quantity > product.maxQty) {
        cartItem.quantity = product.maxQty;
        showToast(`Maximum quantity (${product.maxQty}) reached`);
      } else {
        localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
        renderCartItems();
        updateCartDisplay();
        renderProducts();
      }
    }
  } catch (error) {
    handleError('Error updating quantity', error);
  }
}

function renderCartItems() {
  try {
    const cartItems = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return '';
      const total = (product.price * item.quantity).toFixed(2);
      return `
        <div class="cart-item">
          <div class="cart-item-image"><img src="${product.image}" alt="${product.name}"></div>
          <div class="cart-item-details">
            <h4>${product.name}</h4>
            <div class="cart-item-price">$${product.price.toFixed(2)} · $${total} total</div>
            <div class="cart-item-controls">
              <button class="qty-btn" onclick="updateQuantity('${product.id}', -1)">−</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-btn" onclick="updateQuantity('${product.id}', 1)" ${item.quantity >= product.maxQty ? 'disabled' : ''}>+</button>
              <button class="remove-btn" onclick="removeFromCart('${product.id}')" title="Remove">×</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    cartItemsList.innerHTML = cartItems || '<p style="text-align: center; color: var(--text-secondary);">Your cart is empty</p>';
  } catch (error) {
    handleError('Error rendering cart items', error);
  }
}

function updateCartDisplay() {
  try {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    cartCount.textContent = totalItems;
    heroCartCount.textContent = totalItems;
    heroTotal.textContent = '$' + totalPrice.toFixed(2);
    sidebarCartCount.textContent = totalItems;
    sidebarTotal.textContent = totalPrice.toFixed(2);
  } catch (error) {
    handleError('Error updating cart display', error);
  }
}

function showClearCartModal() {
  showConfirmModal('Clear Cart?', 'Are you sure you want to remove all items from your cart?', clearCart);
}

function clearCart() {
  try {
    cart = [];
    localStorage.removeItem('ecommerce-cart');
    renderCartItems();
    updateCartDisplay();
    renderProducts();
    showToast('Cart cleared!');
  } catch (error) {
    handleError('Error clearing cart', error);
  }
}

function toggleCart() {
  cartSidebar.classList.toggle('open');
  overlay.classList.toggle('active');
  if (cartSidebar.classList.contains('open')) {
    renderCartItems();
  }
}

function toggleWishlistItem(productId) {
  try {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
    }
    
    localStorage.setItem('ecommerce-wishlist', JSON.stringify(wishlist));
    updateWishlistDisplay();
    renderProducts();
    showToast(index > -1 ? 'Removed from wishlist' : 'Added to wishlist');
  } catch (error) {
    handleError('Error updating wishlist', error);
  }
}

function renderWishlistItems() {
  try {
    const items = wishlist.map(id => {
      const product = products.find(p => p.id === id);
      if (!product) return '';
      return `
        <div class="wishlist-item">
          <div class="wishlist-item-image"><img src="${product.image}" alt="${product.name}"></div>
          <div class="wishlist-item-details">
            <h4>${product.name}</h4>
            <p>$${product.price.toFixed(2)}</p>
          </div>
          <button class="wishlist-add-btn" onclick="addToCart('${product.id}')">Add</button>
          <button class="remove-btn" onclick="toggleWishlistItem('${product.id}')" title="Remove">×</button>
        </div>
      `;
    }).join('');

    wishlistItemsList.innerHTML = items || '<p class="cart-empty">Your wishlist is empty</p>';
  } catch (error) {
    handleError('Error rendering wishlist', error);
  }
}

function updateWishlistDisplay() {
  try {
    wishlistCount.textContent = wishlist.length;
    wishlistItemCount.textContent = wishlist.length;
  } catch (error) {
    handleError('Error updating wishlist display', error);
  }
}

function toggleWishlist() {
  wishlistSidebar.classList.toggle('open');
  overlay.classList.toggle('active');
  if (wishlistSidebar.classList.contains('open')) {
    renderWishlistItems();
  }
}

function openCheckout() {
  try {
    if (cart.length === 0) {
      showToast('Your cart is empty');
      return;
    }
    
    const total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    checkoutTotal.textContent = total.toFixed(2);
    
    const summary = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      return `<div class="checkout-summary-item"><span>${product.name} x${item.quantity}</span><span>$${(product.price * item.quantity).toFixed(2)}</span></div>`;
    }).join('');
    
    checkoutSummary.innerHTML = summary + `<div class="checkout-summary-total"><span>Total</span><span>$${total.toFixed(2)}</span></div>`;
    
    checkoutOverlay.classList.add('active');
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
  } catch (error) {
    handleError('Error opening checkout', error);
  }
}

function closeCheckoutModal() {
  checkoutOverlay.classList.remove('active');
  checkoutForm.reset();
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
}

function saveFormData() {
  try {
    const formData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      emailField: document.getElementById('emailField').value,
      addressField: document.getElementById('addressField').value
    };
    localStorage.setItem('ecommerce-form', JSON.stringify(formData));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
}

function restoreFormData() {
  try {
    const formData = JSON.parse(localStorage.getItem('ecommerce-form'));
    if (formData) {
      document.getElementById('firstName').value = formData.firstName || '';
      document.getElementById('lastName').value = formData.lastName || '';
      document.getElementById('emailField').value = formData.emailField || '';
      document.getElementById('addressField').value = formData.addressField || '';
    }
  } catch (error) {
    console.error('Error restoring form data:', error);
  }
}

function validateCheckout() {
  try {
    const fields = {
      firstName: document.getElementById('firstName'),
      lastName: document.getElementById('lastName'),
      emailField: document.getElementById('emailField'),
      addressField: document.getElementById('addressField'),
      cardNumber: document.getElementById('cardNumber'),
      cardExpiry: document.getElementById('cardExpiry'),
      cardCvv: document.getElementById('cardCvv')
    };
    
    const errors = {};
    
    if (!fields.firstName.value.trim()) errors.firstName = 'First name required';
    if (!fields.lastName.value.trim()) errors.lastName = 'Last name required';
    if (!fields.emailField.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.emailField = 'Valid email required';
    if (!fields.addressField.value.trim()) errors.addressField = 'Address required';
    if (!fields.cardNumber.value.replace(/\s/g, '').match(/^\d{13,19}$/)) errors.cardNumber = 'Valid card number required';
    if (!fields.cardExpiry.value.match(/^\d{2}\/\d{2}$/)) errors.cardExpiry = 'Format: MM/YY';
    if (!fields.cardCvv.value.match(/^\d{3}$/)) errors.cardCvv = 'Valid CVV required';
    
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    
    Object.keys(errors).forEach(key => {
      const errorEl = document.getElementById(key + 'Err');
      if (errorEl) errorEl.textContent = errors[key];
    });
    
    return Object.keys(errors).length === 0;
  } catch (error) {
    handleError('Validation error', error);
    return false;
  }
}

function handleCheckout(e) {
  e.preventDefault();
  
  try {
    if (!validateCheckout()) {
      showToast('Please fix the errors');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toLocaleString(),
        items: cart.map(item => {
          const product = products.find(p => p.id === item.id);
          return { name: product.name, quantity: item.quantity, price: product.price };
        }),
        total: cart.reduce((sum, item) => {
          const product = products.find(p => p.id === item.id);
          return sum + (product ? product.price * item.quantity : 0);
        }, 0),
        customer: {
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          email: document.getElementById('emailField').value,
          address: document.getElementById('addressField').value
        }
      };
      
      orderHistory.push(order);
      localStorage.setItem('ecommerce-orders', JSON.stringify(orderHistory));
      
      closeCheckoutModal();
      cart = [];
      localStorage.removeItem('ecommerce-cart');
      localStorage.removeItem('ecommerce-form');
      updateCartDisplay();
      renderProducts();
      
      showOrderSuccess(order);
      playConfetti();
      setLoading(false);
    }, 1500);
  } catch (error) {
    handleError('Checkout error', error);
    setLoading(false);
  }
}

function showOrderSuccess(order) {
  showToast(`Order ${order.id} placed successfully! 🎉`);
  console.log('Order saved:', order);
}

function playConfetti() {
  try {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 5 + 5,
        color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)]
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.y += p.vy;
        p.x += p.vx;
        p.vy += 0.1;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 8, 8);
        if (p.y > canvas.height) particles.splice(i, 1);
      });
      
      if (particles.length > 0) requestAnimationFrame(animate);
    }
    animate();
  } catch (error) {
    console.error('Confetti error:', error);
  }
}

function showConfirmModal(title, message, onConfirm) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal" style="max-width: 400px;">
      <h3 style="margin-bottom: 1rem; font-size: 1.2rem;">${title}</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${message}</p>
      <div style="display: flex; gap: 1rem;">
        <button class="btn btn-secondary" style="flex: 1;" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" style="flex: 1;" onclick="this.closest('.modal-overlay').remove(); (${onConfirm.toString()})()">Confirm</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function setLoading(state) {
  isLoading = state;
  if (state) {
    document.body.style.opacity = '0.7';
    document.body.style.pointerEvents = 'none';
  } else {
    document.body.style.opacity = '1';
    document.body.style.pointerEvents = 'auto';
  }
}

function handleError(message, error) {
  console.error(message, error);
  showToast(`Error: ${message}`);
}

function showToast(message) {
  try {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  } catch (error) {
    console.error('Toast error:', error);
  }
}
