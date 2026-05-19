// ============================================
// NEWSLETTER POPUP
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const popup = document.getElementById('newsletter-popup');
  const closeBtn = document.getElementById('closePopup');
  
  // Check if user has already seen popup (optional — uses localStorage)
  const hasSeenPopup = localStorage.getItem('bohoPopupSeen');
  
  if (!hasSeenPopup) {
    // Show popup after 3 seconds
    setTimeout(function() {
      popup.classList.add('active');
    }, 3000);
  }
  
  // Close popup function
  function closePopup() {
    popup.classList.remove('active');
    // Store that user has seen popup (for 7 days)
    localStorage.setItem('bohoPopupSeen', 'true');
    
    // Optional: Set expiry (7 days)
    setTimeout(function() {
      localStorage.removeItem('bohoPopupSeen');
    }, 7 * 24 * 60 * 60 * 1000);
  }
  
  // Close when clicking X
  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }
  
  // Close when clicking outside the popup
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      closePopup();
    }
  });
  
  // Handle form submission
  const popupForm = document.getElementById('popup-form');
  if (popupForm) {
    popupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      
      // Here you would send to your email service (Mailchimp, ConvertKit, etc.)
      console.log('Newsletter signup:', { name, email });
      
      // Show success message
      alert('Welcome to the Boho Circle! Check your email for 15% off.');
      closePopup();
    });
  }
});
// ============================================
// INSTAGRAM FEED CAROUSEL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('instaCarousel');
  const prevBtn = document.getElementById('instaPrev');
  const nextBtn = document.getElementById('instaNext');
  const dotsContainer = document.getElementById('instaDots');
  const slides = document.querySelectorAll('.insta-slide');
  
  if (!carousel || slides.length === 0) return;
  
  let currentIndex = 0;
  const slideWidth = slides[0]?.offsetWidth + 20; // width + gap
  const totalSlides = slides.length;
  
  // Create dots
  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        scrollToSlide(i);
      });
      dotsContainer.appendChild(dot);
    }
  }
  
  // Scroll to specific slide
  function scrollToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    currentIndex = index;
    carousel.scrollTo({
      left: currentIndex * slideWidth,
      behavior: 'smooth'
    });
    updateDots();
  }
  
  // Update active dot
  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  // Update current index based on scroll position
  function updateIndexOnScroll() {
    const scrollPosition = carousel.scrollLeft;
    const newIndex = Math.round(scrollPosition / slideWidth);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalSlides) {
      currentIndex = newIndex;
      updateDots();
    }
  }
  
  // Event listeners
  prevBtn?.addEventListener('click', () => {
    scrollToSlide(currentIndex - 1);
  });
  
  nextBtn?.addEventListener('click', () => {
    scrollToSlide(currentIndex + 1);
  });
  
  carousel.addEventListener('scroll', () => {
    requestAnimationFrame(updateIndexOnScroll);
  });
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate slide width
      const newSlideWidth = slides[0]?.offsetWidth + 20;
      if (newSlideWidth) {
        scrollToSlide(currentIndex);
      }
    }, 150);
  });
  
  // Initialize
  createDots();
});
// ============================================
// BACK TO TOP BUTTON
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const backToTopBtn = document.getElementById('backToTop');
  
  if (!backToTopBtn) return;
  
  // Show button when user scrolls down 300px
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  
  // Smooth scroll to top when clicked
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
// ============================================
// SHOP PAGE FUNCTIONALITY - the-Boho-market
// ============================================

// DOM Elements
const productGrid = document.getElementById('product-grid');
const resultsCount = document.getElementById('results-count');
const categoryFilterItems = document.querySelectorAll('#category-filter li');
const sortFilterItems = document.querySelectorAll('#sort-filter li');
const priceSlider = document.getElementById('price-slider');
const priceValue = document.getElementById('price-value');
const searchInput = document.getElementById('search-input');
const clearFiltersBtn = document.getElementById('clear-filters');
const loadMoreBtn = document.getElementById('load-more');
const noResultsDiv = document.getElementById('no-results');

// State
let currentCategory = 'all';
let currentSort = 'default';
let currentPriceMax = 5000;
let currentSearch = '';
let visibleProducts = 12;
let allProducts = [];

// Get all product cards
function getAllProducts() {
  return Array.from(document.querySelectorAll('.product-card'));
}

// Update results count
function updateResultsCount(count) {
  const span = resultsCount.querySelector('span');
  if (span) span.textContent = count;
}

// Show/hide no results
function toggleNoResults(show) {
  if (noResultsDiv) {
    noResultsDiv.style.display = show ? 'flex' : 'none';
    noResultsDiv.style.flexDirection = 'column';
    noResultsDiv.style.alignItems = 'center';
  }
}

// Filter products
function filterProducts() {
  const products = getAllProducts();
  
  let filtered = products.filter(product => {
    const category = product.dataset.category;
    const price = parseInt(product.dataset.price);
    const title = product.querySelector('h3')?.innerText.toLowerCase() || '';
    const searchMatch = currentSearch === '' || title.includes(currentSearch.toLowerCase());
    const categoryMatch = currentCategory === 'all' || category === currentCategory;
    const priceMatch = price <= currentPriceMax;
    
    return categoryMatch && priceMatch && searchMatch;
  });
  
  // Sort products
  filtered.sort((a, b) => {
    const priceA = parseInt(a.dataset.price);
    const priceB = parseInt(b.dataset.price);
    const isNewA = a.dataset.new === 'true';
    const isNewB = b.dataset.new === 'true';
    
    switch(currentSort) {
      case 'low-high':
        return priceA - priceB;
      case 'high-low':
        return priceB - priceA;
      case 'newest':
        return (isNewB ? 1 : 0) - (isNewA ? 1 : 0);
      default:
        return 0;
    }
  });
  
  // Update visibility
  filtered.forEach((product, index) => {
    product.style.display = index < visibleProducts ? 'block' : 'none';
  });
  
  const visibleCount = filtered.filter(p => p.style.display === 'block').length;
  const totalFiltered = filtered.length;
  
  updateResultsCount(visibleCount);
  toggleNoResults(totalFiltered === 0);
  
  // Hide load more if all products are visible
  if (loadMoreBtn) {
    loadMoreBtn.style.display = visibleCount >= totalFiltered ? 'none' : 'inline-flex';
  }
  
  return { filtered, visibleCount, totalFiltered };
}

// Load more products
function loadMore() {
  visibleProducts += 8;
  filterProducts();
}

// Clear all filters
function clearAllFilters() {
  currentCategory = 'all';
  currentSort = 'default';
  currentPriceMax = 5000;
  currentSearch = '';
  
  // Update UI
  if (priceSlider) priceSlider.value = 5000;
  if (priceValue) priceValue.textContent = '₹5000';
  if (searchInput) searchInput.value = '';
  
  // Update active classes
  categoryFilterItems.forEach(item => {
    if (item.dataset.filter === 'all') {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  sortFilterItems.forEach(item => {
    if (item.dataset.sort === 'default') {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  visibleProducts = 12;
  filterProducts();
}

// Event Listeners
categoryFilterItems.forEach(item => {
  item.addEventListener('click', () => {
    categoryFilterItems.forEach(li => li.classList.remove('active'));
    item.classList.add('active');
    currentCategory = item.dataset.filter;
    visibleProducts = 12;
    filterProducts();
  });
});

sortFilterItems.forEach(item => {
  item.addEventListener('click', () => {
    sortFilterItems.forEach(li => li.classList.remove('active'));
    item.classList.add('active');
    currentSort = item.dataset.sort;
    visibleProducts = 12;
    filterProducts();
  });
});

if (priceSlider) {
  priceSlider.addEventListener('input', (e) => {
    currentPriceMax = parseInt(e.target.value);
    if (priceValue) priceValue.textContent = `₹${currentPriceMax}`;
    visibleProducts = 12;
    filterProducts();
  });
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    visibleProducts = 12;
    filterProducts();
  });
}

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', clearAllFilters);
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', loadMore);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Hide all products initially, then filter will show them
  getAllProducts().forEach(p => p.style.display = 'none');
  filterProducts();
});

// Make clearAllFilters available globally for the no-results button
window.clearAllFilters = clearAllFilters;
// Make all product cards clickable
document.querySelectorAll('.product-card').forEach((card, index) => {
  // Get product ID (use index + 1 since we have 16 products)
  const productId = index + 1;
  
  // Make card clickable
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    // Don't trigger if clicking on buttons inside card
    if (e.target.closest('.wishlist-btn') || e.target.closest('.cart-btn')) {
      return;
    }
    window.location.href = `product-detail.html?id=${productId}`;
  });
});
// ============================================
// CART PAGE FUNCTIONALITY - the-Boho-market
// ============================================

// Update cart totals
function updateCartTotals() {
  let subtotal = 0;
  const cartItems = document.querySelectorAll('.cart-item');
  
  cartItems.forEach(item => {
    const price = parseFloat(item.querySelector('.cart-price').innerText.replace('₹', '').replace(',', ''));
    const quantity = parseInt(item.querySelector('.cart-quantity input').value);
    const total = price * quantity;
    subtotal += total;
    
    // Update item total
    item.querySelector('.cart-total').innerText = `₹${total.toLocaleString()}`;
  });
  
  // Update subtotal
  document.getElementById('subtotal').innerText = `₹${subtotal.toLocaleString()}`;
  
  // Calculate tax (18% GST)
  const tax = subtotal * 0.18;
  document.getElementById('tax').innerText = `₹${Math.round(tax).toLocaleString()}`;
  
  // Update total
  const total = subtotal + tax;
  document.getElementById('total').innerText = `₹${Math.round(total).toLocaleString()}`;
}

// Quantity buttons
document.querySelectorAll('.cart-quantity').forEach(quantityDiv => {
  const decrementBtn = quantityDiv.querySelector('.qty-decr');
  const incrementBtn = quantityDiv.querySelector('.qty-incr');
  const input = quantityDiv.querySelector('input');
  
  if (decrementBtn) {
    decrementBtn.addEventListener('click', () => {
      let value = parseInt(input.value);
      if (value > 1) {
        input.value = value - 1;
        updateCartTotals();
      }
    });
  }
  
  if (incrementBtn) {
    incrementBtn.addEventListener('click', () => {
      let value = parseInt(input.value);
      if (value < 10) {
        input.value = value + 1;
        updateCartTotals();
      }
    });
  }
  
  if (input) {
    input.addEventListener('change', () => {
      let value = parseInt(input.value);
      if (isNaN(value) || value < 1) input.value = 1;
      if (value > 10) input.value = 10;
      updateCartTotals();
    });
  }
});

// Remove items
document.querySelectorAll('.remove-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cartItem = btn.closest('.cart-item');
    cartItem.remove();
    
    // Check if cart is empty
    const remainingItems = document.querySelectorAll('.cart-item');
    const cartItemsDiv = document.querySelector('.cart-items');
    const emptyCartDiv = document.querySelector('.empty-cart');
    const cartHeader = document.querySelector('.cart-header');
    
    if (remainingItems.length === 0) {
      cartHeader.style.display = 'none';
      emptyCartDiv.style.display = 'block';
    }
    
    updateCartTotals();
  });
});

// Promo code
const promoInput = document.querySelector('.promo-code input');
const promoBtn = document.querySelector('.promo-code button');

if (promoBtn) {
  promoBtn.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();
    if (code === 'BOHO15') {
      alert('Promo code applied! 15% off your order.');
      let total = parseFloat(document.getElementById('total').innerText.replace('₹', '').replace(',', ''));
      const discount = total * 0.15;
      const newTotal = total - discount;
      document.getElementById('total').innerText = `₹${Math.round(newTotal).toLocaleString()}`;
      promoInput.disabled = true;
      promoBtn.disabled = true;
      promoBtn.style.opacity = '0.5';
    } else {
      alert('Invalid promo code. Try BOHO15');
    }
  });
}

// Checkout button
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    alert('Redirecting to checkout page...');
    // window.location.href = 'checkout.html';
  });
}

// Initialize totals
updateCartTotals();
// ============================================
// BLOG POST PAGE - the-Boho-market
// ============================================

// Blog posts database
const blogPosts = {
  1: {
    id: 1,
    title: "5 Ways to Bring Boho Vibes into Your Home This Spring",
    category: "Decor",
    date: "April 15, 2026",
    readTime: "5 min read",
    views: "2.3k views",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format",
    content: `
      <p>Spring is the perfect time to refresh your space and invite new energy into your home. If you're drawn to the free-spirited, earthy aesthetic of bohemian style, you're in for a treat. Here are five simple ways to transform your home into a boho sanctuary this season.</p>
      
      <h2>1. Layer Textures</h2>
      <p>Boho style is all about mixing and matching different textures. Combine macrame wall hangings with rattan furniture, jute rugs, and velvet cushions. Don't be afraid to layer — the more texture, the better!</p>
      
      <h2>2. Bring in Plants</h2>
      <p>Nothing says boho like lush greenery. Add trailing plants like pothos or string of pearls, and large statement plants like fiddle leaf figs or monstera. Use woven baskets as planters for extra boho points.</p>
      
      <h2>3. Add Warm Lighting</h2>
      <p>Swap harsh overhead lights for warm, ambient lighting. String lights, paper lanterns, and candle holders create that cozy, magical boho glow.</p>
      
      <h2>4. Display Handmade Treasures</h2>
      <p>Boho style celebrates craftsmanship. Display handmade pottery, woven baskets, and unique artifacts from your travels. Each piece tells a story.</p>
      
      <h2>5. Use Earthy Colors</h2>
      <p>Stick to a palette inspired by nature — terracotta, sage green, warm beige, and deep rust. These colors create a calming, grounded atmosphere.</p>
      
      <p>Ready to start your boho transformation? Shop our curated home decor collection and find pieces that speak to your soul.</p>
    `,
    related: [2, 4, 6]
  },
  2: {
    id: 2,
    title: "The Ultimate Boho Summer Wardrobe Guide",
    category: "Style",
    date: "April 10, 2026",
    readTime: "3 min read",
    views: "1.8k views",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1974&auto=format",
    content: `<p>Summer is calling, and it's time to embrace your free-spirited style. From flowy maxi dresses to earthy accessories, here's everything you need for a boho summer.</p>
    <h2>Flowy Maxi Dresses</h2>
    <p>The quintessential boho summer staple. Look for floral prints, tiered layers, and lightweight fabrics like cotton and linen.</p>
    <h2>Wide-Brim Hats</h2>
    <p>Protect your face from the sun while looking effortlessly chic. Straw hats are a boho must-have.</p>
    <h2>Layered Jewelry</h2>
    <p>Mix and match necklaces of different lengths. Think terracotta beads, shells, and natural stones.</p>
    <h2>Slides and Sandals</h2>
    <p>Comfortable, earthy, and stylish. Leather slides or woven sandals complete any boho look.</p>
    <p>Shop our summer collection and get ready to shine!</p>`,
    related: [1, 3, 5]
  },
  3: {
    id: 3,
    title: "Handmade Macrame: A Beginner's Guide",
    category: "Decor",
    date: "April 5, 2026",
    readTime: "4 min read",
    views: "3.1k views",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format",
    content: `<p>Macrame is making a major comeback, and it's easier than you think to create your own beautiful pieces. In this guide, we'll cover the basic knots you need to get started.</p>
    <h2>What You'll Need</h2>
    <p>Cotton cord, a wooden dowel or ring, scissors, and a comb for fraying.</p>
    <h2>The Basic Knots</h2>
    <p>The lark's head knot, square knot, and half-hitch are the foundation of most macrame projects. Once you master these, you can create wall hangings, plant hangers, and more.</p>
    <h2>Start Small</h2>
    <p>Try a simple plant hanger or a small wall hanging before tackling larger projects.</p>
    <p>Ready to try? Check out our macrame supplies and kits!</p>`,
    related: [1, 4, 7]
  },
  4: {
    id: 4,
    title: "Slow Living: Embracing the Boho Mindset",
    category: "Lifestyle",
    date: "March 28, 2026",
    readTime: "6 min read",
    views: "4.2k views",
    image: "https://images.unsplash.com/photo-1516490981167-dc990a242afe?q=80&w=2070&auto=format",
    content: `<p>Slow living isn't just a trend — it's a philosophy that aligns perfectly with the bohemian spirit. Here's how to incorporate mindful, intentional practices into your daily routine.</p>
    <h2>Start Your Day Mindfully</h2>
    <p>Instead of reaching for your phone, take a few minutes to breathe, journal, or sip tea in silence.</p>
    <h2>Declutter Your Space</h2>
    <p>Keep only what brings you joy. A clutter-free home leads to a clutter-free mind.</p>
    <h2>Connect with Nature</h2>
    <p>Spend time outdoors, even if it's just a 10-minute walk. Grounding yourself in nature is essential for the boho soul.</p>
    <h2>Shop Intentionally</h2>
    <p>Choose handmade, sustainable pieces that tell a story. Quality over quantity, always.</p>`,
    related: [1, 2, 6]
  },
  5: {
    id: 5,
    title: "Rattan & Wicker: The Comeback of Natural Textures",
    category: "Decor",
    date: "March 20, 2026",
    readTime: "4 min read",
    views: "1.5k views",
    image: "https://images.unsplash.com/photo-1595425970373-064a0ff020b0?q=80&w=2070&auto=format",
    content: `<p>Rattan and wicker furniture are having a major moment — and for good reason. These natural materials add warmth, texture, and an earthy elegance to any space.</p>
    <h2>The Difference Between Rattan and Wicker</h2>
    <p>Rattan is a natural palm, while wicker refers to the weaving technique. Both are sustainable and beautiful.</p>
    <h2>Where to Use Them</h2>
    <p>Rattan chairs, wicker baskets, woven mirrors — the possibilities are endless. They work especially well in living rooms, bedrooms, and sunrooms.</p>
    <h2>How to Style</h2>
    <p>Pair rattan pieces with soft textiles like linen and cotton. Add plants for a fresh, organic look.</p>`,
    related: [1, 3, 7]
  },
  6: {
    id: 6,
    title: "Festival Fashion: What to Wear This Season",
    category: "Style",
    date: "March 15, 2026",
    readTime: "3 min read",
    views: "2.7k views",
    image: "https://images.unsplash.com/photo-1573485628007-3b5f1d15d847?q=80&w=1974&auto=format",
    content: `<p>Festival season is here, and it's time to unleash your inner boho goddess. Here's what to wear to stand out while staying comfortable.</p>
    <h2>Crop Tops and Bralettes</h2>
    <p>Layer them under sheer kimonos or mesh tops for a playful yet chic look.</p>
    <h2>High-Waisted Shorts</h2>
    <p>Denim or flowy fabric — either works. Pair with a bodysuit or crochet top.</p>
    <h2>Statement Accessories</h2>
    <p>Layer necklaces, stack rings, and don't forget the sunglasses. A fanny pack or crossbody bag keeps your hands free.</p>`,
    related: [2, 4, 7]
  },
  7: {
    id: 7,
    title: "Meet the Makers: Behind the Scenes with Our Artisans",
    category: "Lifestyle",
    date: "March 8, 2026",
    readTime: "5 min read",
    views: "3.8k views",
    image: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?q=80&w=1974&auto=format",
    content: `<p>At The Boho Market, we believe in fair trade and ethical craftsmanship. Meet the incredible artisans behind our handmade treasures.</p>
    <h2>Meet Meera</h2>
    <p>Meera is a third-generation block printer from Jaipur. She hand-carves wooden blocks and prints fabrics using natural dyes.</p>
    <h2>Meet Raj</h2>
    <p>Raj specializes in macrame and has been practicing the craft for over 15 years. Every knot is tied with intention.</p>
    <h2>Meet The Women's Collective</h2>
    <p>A group of 20+ women creating handmade jewelry and accessories. Your purchase supports their families and education.</p>`,
    related: [1, 3, 4]
  }
};

// Get post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// Load post content
if (blogPosts[postId]) {
  const post = blogPosts[postId];
  const container = document.getElementById('blogPostContent');
  
  container.innerHTML = `
    <div class="blog-post-content">
      <span class="post-category">${post.category}</span>
      <h1 class="post-title">${post.title}</h1>
      <div class="post-meta">
        <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
        <span><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
        <span><i class="fa-regular fa-eye"></i> ${post.views}</span>
      </div>
      <div class="post-featured-image">
        <img src="${post.image}" alt="${post.title}">
      </div>
      <div class="post-body">
        ${post.content}
      </div>
      <div class="share-section">
        <h4>Share this post</h4>
        <div class="share-icons">
          <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#"><i class="fa-brands fa-twitter"></i></a>
          <a href="#"><i class="fa-brands fa-pinterest"></i></a>
          <a href="#"><i class="fa-regular fa-envelope"></i></a>
        </div>
      </div>
    </div>
  `;
  
  // Update page title
  document.title = `${post.title} — the-Boho-market`;
  
  // Load related posts
  const relatedContainer = document.getElementById('relatedPosts');
  if (post.related && post.related.length > 0) {
    let relatedHtml = '';
    post.related.forEach(relatedId => {
      if (blogPosts[relatedId]) {
        const related = blogPosts[relatedId];
        relatedHtml += `
          <div class="related-card">
            <img src="${related.image}" alt="${related.title}">
            <div class="related-info">
              <span class="post-category" style="font-size:0.6rem;">${related.category}</span>
              <h4>${related.title}</h4>
              <a href="blog-post.html?id=${related.id}" class="read-more">Read More <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        `;
      }
    });
    relatedContainer.innerHTML = relatedHtml;
  }
} else {
  document.getElementById('blogPostContent').innerHTML = `
    <div class="blog-post-content" style="text-align:center;">
      <h2>Post not found</h2>
      <p>Sorry, the blog post you're looking for doesn't exist.</p>
      <a href="blog.html" class="read-more">Back to Blog</a>
    </div>
  `;
}

// Newsletter form
document.querySelector('.blog-newsletter-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thanks for subscribing!');
});