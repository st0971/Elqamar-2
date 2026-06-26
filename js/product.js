document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = window.allProductsData.find(p => p.id === productId);
    const detailContainer = document.getElementById('productDetail');

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    // 切換漢堡選單與 nav-links 顯示
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // 手機下拉選單展開控制
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
        e.preventDefault(); // 防止連結跳轉
        const parentLi = toggle.closest('li');
        parentLi.classList.toggle('active');
        });
    });

    if (!product) {
        detailContainer.innerHTML = "<p>找不到此商品。</p>";
        return;
    }
    if (product.stock === 0) {
    detailContainer.innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="product-detail-img" /> 
        <div class="product-info">
            <h1>${product.name}</h1>
            <p class="price">價格：$${product.price}</p>
            <p style="color: red; font-weight: bold;">此商品已售完</p>
        </div>
        <div class="product-description-section">
            <h2>商品說明</h2>
            <p>${(product.description || '這是商品的詳細描述。').replace(/\n/g, '<br>')}</p>
        </div>
    `;
    return;
}


    // 將商品圖片從 product.html 中移除的連結邏輯修正，這裡圖片不應連結到首頁
    detailContainer.innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="product-detail-img" /> 
        <div class="product-info">
            <h1>${product.name}</h1>
            <p class="price">價格：$${product.price}</p>
            <div class="form-group">
                <label for="quantity">數量：</label>
                <select id="quantity">
                    ${[...Array(product.stock).keys()].map(i => `<option value="${i+1}">${i+1}</option>`).join('')}
                </select>
                <button id="addToCart">加入購物車</button>
            </div>
        </div>
        <div class="product-description-section">
            <h2>商品說明</h2>
            <p>${(product.description || '這是商品的詳細描述。').replace(/\n/g, '<br>')}</p>
        </div>
    `;


    document.getElementById('addToCart').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        addToCart(product.id, quantity);
        showToast("已加入購物車！"); // 顯示 toast 訊息
        updateCartBadge(); // 更新購物車小紅點
    });

    function addToCart(productId, qty) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity += qty;
        } else {
            cart.push({ id: productId, quantity: qty });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // --- 確保這些函數在 product.js 中存在 ---

    // 顯示 toast 訊息的函數
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

    // 更新購物車小紅點的函數
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

    // 頁面加載時也更新一次購物車小紅點，確保初始狀態正確
    updateCartBadge();
});