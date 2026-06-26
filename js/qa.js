// == 完整購物車與紅點邏輯 JS ==
document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Optional: Close hamburger menu when a nav link is clicked (unless it's a dropdown toggle)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (!link.classList.contains('dropdown-toggle')) {
                    // Close the main nav if a regular link is clicked
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // --- NEW: Dropdown Menu Toggle for Mobile ---
    // Select all dropdown toggles (e.g., "預購商品▼")
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (event) => {
            // Prevent the default link behavior (e.g., navigating to an empty href)
            event.preventDefault();

            // Find the parent <li> of the clicked toggle
            const parentLi = toggle.closest('li');

            if (parentLi) {
                // Optional: Close other open dropdowns if they exist within the same navLinks container
                navLinks.querySelectorAll('li').forEach(item => {
                    if (item !== parentLi && item.classList.contains('active')) {
                        item.classList.remove('active');
                    }
                });

                // Toggle the 'active' class on the parent <li>
                parentLi.classList.toggle('active');
            }
        });
    });

    // Optional: Close dropdowns if clicked outside the navigation
    document.addEventListener('click', (event) => {
        // If the click is not inside the navLinks area and not on the hamburger button
        if (!event.target.closest('.nav-links') && !event.target.closest('.hamburger')) {
            document.querySelectorAll('.nav-links li.active').forEach(item => {
                item.classList.remove('active'); // Close all active dropdowns
            });
        }
    });

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
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">您的購物車是空的，快去逛逛吧！</p>';
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

        cart.forEach(cartItem => {
            const product = window.allProductsData.find(p => p.id === cartItem.id);
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
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('change', function () {
                const productId = parseInt(this.getAttribute('data-id'));
                const newQuantity = parseInt(this.value);
                updateCartQuantity(productId, newQuantity);
            });
        });

        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }

    function updateCartQuantity(productId, newQuantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            if (newQuantity > 0) {
                cart[itemIndex].quantity = newQuantity;
            } else {
                cart.splice(itemIndex, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            showToast("購物車已更新！");
        }
    }

    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        showToast("商品已從購物車移除！");
    }

    function updateCartBadge() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalCount = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

        const cartBtn = document.querySelector('.cart-icon');
        const badge = cartBtn?.querySelector('.cart-badge');

        if (badge) {
            if (totalCount > 0) {
                badge.textContent = totalCount;
                cartBtn.classList.add('has-items');
            } else {
                badge.textContent = '';
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
    window.addToCart = function(productId, quantity = 1) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const index = cart.findIndex(item => item.id === productId);

        if (index > -1) {
            cart[index].quantity += quantity;
        } else {
            cart.push({ id: productId, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        showToast("已加入購物車");
    };
});

const accordionButtons = document.querySelectorAll('.accordion-button');

  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentItem = button.parentElement;
      const isActive = currentItem.classList.contains('active');

      // 關閉所有手風琴
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      // 如果原本不是 active，就開啟它
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });