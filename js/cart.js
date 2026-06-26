document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');

    // Function to render cart items
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsContainer.innerHTML = ''; // Clear existing items

        const cartHeader = document.querySelector('.cart-header');
        const cartSummaryWrapper = document.querySelector('.cart-summary-wrapper');

        if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <p class="empty-cart-message">
                    您的購物車是空的，快去逛逛吧！<br>
                    <a href="index.html" class="go-shopping-btn">返回首頁</a>
                    </p>
                `;
                cartTotalElement.textContent = '0';
                if (cartHeader) cartHeader.style.display = 'none';
                if (cartSummaryWrapper) cartSummaryWrapper.style.display = 'none';
                updateCartBadge();
                return;
            }
        else {
            // Ensure header and summary are visible if cart has items
            // Using 'grid' for header as defined in CSS, 'block' or 'flex' for wrapper depending on its display type
            if (cartHeader) cartHeader.style.display = 'grid';
            if (cartSummaryWrapper) cartSummaryWrapper.style.display = 'block'; // Or 'flex' if it's a flex container
        }

        let totalAmount = 0;

        cart.forEach(cartItem => {
            const product = window.allProductsData.find(p => p.id === cartItem.id);
            if (product) {
                const itemTotalPrice = product.price * cartItem.quantity;
                totalAmount += itemTotalPrice;

                // 判斷是否售完
                const isSoldOut = product.stock === 0;

                const quantityControlHTML = product.stock === 0
                ? `<span class="sold-out-label">已售完</span>`
                : `<select class="item-quantity" data-id="${product.id}">
                        ${[...Array(product.stock).keys()].map(i => {
                            const qty = i + 1;
                            return `<option value="${qty}" ${qty === cartItem.quantity ? 'selected' : ''}>${qty}</option>`;
                        }).join('')}
                    </select>`;


                const cartItemHTML = `
                    <div class="cart-item" data-id="${product.id}">
                        <div class="cart-item-product">
                            <a href="product.html?id=${product.id}" class="cart-item-img-link">
                                <img src="${product.img}" alt="${product.name}" class="cart-item-img" />
                            </a>
                            <div class="cart-item-details">
                                <h3>${product.name}</h3>
                            </div>
                        </div>
                        <div class="unit-price" data-label="單價"><span>$${product.price}</span></div>
                        <div class="quantity-control" data-label="數量">
                            ${quantityControlHTML}
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

        // 金額逗號
        cartTotalElement.textContent = totalAmount.toLocaleString();
        attachCartEventListeners();
        updateCartBadge();
    }

    // Function to attach event listeners for quantity changes and removal
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

    // Function to update item quantity in localStorage
    function updateCartQuantity(productId, newQuantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            const product = window.allProductsData.find(p => p.id === productId);
            if (!product) return;

            if (newQuantity > product.stock) {
                cart[itemIndex].quantity = product.stock;
                showToast(`數量已達庫存上限（${product.stock}）`);
            } else if (newQuantity > 0) {
                cart[itemIndex].quantity = newQuantity;
                showToast("購物車已更新！");
            } else {
                cart.splice(itemIndex, 1);
                showToast("商品已從購物車移除！");
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }

    }

    // Function to remove item from cart
    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart(); // Re-render cart to update display and total
        showToast("商品已從購物車移除！");
    }

    // Function to update the cart badge (copied from index.js for consistency)
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

    // Function to display toast messages (copied from index.js for consistency)
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

    // Initial render of the cart when the page loads
    renderCart();
    updateCartBadge();
});