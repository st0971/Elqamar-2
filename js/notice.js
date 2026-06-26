// == 完整購物車與紅點邏輯 JS ==
document.addEventListener('DOMContentLoaded', function () {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');

  // --- 漢堡選單邏輯 Start ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle'); // Select all dropdown toggles

  // Toggle hamburger menu and navigation links
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Handle dropdown toggles for mobile
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', function (event) {
      // Only prevent default if on mobile (navLinks is active)
      if (window.innerWidth <= 768) {
        event.preventDefault(); // Prevent navigating to a blank page
        const parentLi = this.closest('li');
        parentLi.classList.toggle('active'); // Toggle 'active' class on the parent li
      }
    });
  });

  // Close menu when a link is clicked (optional, but good for UX)
  navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        // Close any open dropdowns when a main nav link is clicked
        dropdownToggles.forEach((toggle) => {
          toggle.closest('li').classList.remove('active');
        });
      }
    });
  });

  // Close menu when clicking outside on mobile
  document.addEventListener('click', (event) => {
    if (window.innerWidth <= 768) {
      const isClickInsideNav =
        navLinks.contains(event.target) || hamburger.contains(event.target);
      if (!isClickInsideNav && navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        // Close any open dropdowns when clicking outside
        dropdownToggles.forEach((toggle) => {
          toggle.closest('li').classList.remove('active');
        });
      }
    }
  });
  // --- 漢堡選單邏輯 End ---

  // 從這裡開始是購物車的 JavaScript 程式碼
  if (!cartItemsContainer || !cartTotalElement) {
    updateCartBadge(); // 至少紅點仍可作用
    return;
  }

  // 以下繼續執行購物車渲染與監聽

  // 初始化購物車
  renderCart();
  updateCartBadge();

  // 渲染購物車內容
  function renderCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = '';

    const cartHeader = document.querySelector('.cart-header');
    const cartSummaryWrapper = document.querySelector('.cart-summary-wrapper');

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="empty-cart-message">您的購物車是空的，快去逛逛吧！</p>';
      cartTotalElement.textContent = '0';
      if (cartHeader) cartHeader.style.display = 'none';
      if (cartSummaryWrapper) cartSummaryWrapper.style.display = 'none';
      updateCartBadge();
      return;
    } else {
      if (cartHeader) cartHeader.style.display = 'grid';
      if (cartSummaryWrapper) cartSummaryWrapper.style.display = 'block';
    }

    let totalAmount = 0;

    cart.forEach((cartItem) => {
      // Make sure allProductsData is globally available or passed here
      const product = window.allProductsData.find((p) => p.id === cartItem.id);
      if (product) {
        const itemTotalPrice = product.price * cartItem.quantity;
        totalAmount += itemTotalPrice;

        const cartItemHTML = `
                    <div class="cart-item" data-id="${product.id}">
                        <div class="cart-item-product">
                            <a href="product.html?id=${product.id}" class="cart-item-img-link">
                                <img src="${product.img}" alt="${product.name}" class="cart-item-img">
                            </a>
                            <div class="cart-item-details">
                                <h3>${product.name}</h3>
                            </div>
                        </div>
                        <div class="unit-price" data-label="單價"><span>$${product.price}</span></div>
                        <div class="quantity-control" data-label="數量">
                            <input type="number" class="item-quantity" value="${cartItem.quantity}" min="1" data-id="${product.id}">
                        </div>
                        <div class="subtotal-price" data-label="小計"><span>$${itemTotalPrice}</span></div>
                        <div class="action-buttons">
                            <button class="remove-item-btn" data-id="${product.id}">刪除</button>
                        </div>
                    </div>
                `;
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
      }
    });

    cartTotalElement.textContent = totalAmount.toFixed(0);
    attachCartEventListeners();
    updateCartBadge();
  }

  function attachCartEventListeners() {
    document.querySelectorAll('.item-quantity').forEach((input) => {
      input.addEventListener('change', function () {
        const productId = parseInt(this.getAttribute('data-id'));
        const newQuantity = parseInt(this.value);
        updateCartQuantity(productId, newQuantity);
      });
    });

    document.querySelectorAll('.remove-item-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        const productId = parseInt(this.getAttribute('data-id'));
        removeFromCart(productId);
      });
    });
  }

  function updateCartQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex((item) => item.id === productId);

    if (itemIndex > -1) {
      if (newQuantity > 0) {
        cart[itemIndex].quantity = newQuantity;
      } else {
        cart.splice(itemIndex, 1);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      showToast('購物車已更新！');
    }
  }

  function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    showToast('商品已從購物車移除！');
  }

  function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce(
      (sum, item) => sum + (parseInt(item.quantity) || 0),
      0,
    );

    const cartBtn = document.querySelector('.cart-icon');
    const badge = cartBtn?.querySelector('.cart-badge');

    if (badge) {
      if (totalCount > 0) {
        badge.textContent = totalCount;
        badge.style.display = 'inline-block'; // Explicitly show the badge
        cartBtn.classList.add('has-items'); // Keep this for potential animation/styling
      } else {
        badge.textContent = '';
        badge.style.display = 'none'; // Explicitly hide the badge
        cartBtn.classList.remove('has-items');
      }
    }
  }

  function showToast(message) {
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 1500);
    }, 10);
  }

  // 提供外部使用（例如加入商品按鈕）
  window.addToCart = function (productId, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex((item) => item.id === productId);

    if (index > -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({ id: productId, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast('已加入購物車');
  };
});