document.addEventListener('DOMContentLoaded', function () {
    // 主要元素變數
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownParentLi = dropdownToggle.parentElement;

    const searchToggle = document.querySelector('.search-toggle');
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');
    const suggestionList = document.querySelector('.suggestion-list');

    const cartBtn = document.querySelector('.cart-icon');
    if (!cartBtn) {
        console.warn("找不到 .cart-icon 元素，購物車紅點功能無法啟用");
    }

    // 初始下拉選單隱藏
    dropdownParentLi.classList.remove('active');

    // 漢堡選單切換
    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        if (!navLinks.classList.contains('active')) {
            dropdownParentLi.classList.remove('active');
        }
    });

    // 手機版下拉選單點擊
    dropdownToggle.addEventListener('click', function (event) {
        event.preventDefault();
        if (window.innerWidth <= 768) {
            dropdownParentLi.classList.toggle('active');
        }
    });

    // 點擊連結收起選單
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            if (this === dropdownToggle) return;
            if (dropdownParentLi.contains(this)) {
                dropdownParentLi.classList.remove('active');
            } else {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                dropdownParentLi.classList.remove('active');
            }
        });
    });

    // 點擊外部收起選單與搜尋
    document.addEventListener('click', function (event) {
        const isClickInsideNav = navLinks.contains(event.target) || hamburger.contains(event.target);
        const isClickInsideSearch = searchContainer.contains(event.target) || searchToggle.contains(event.target);

        if (!isClickInsideNav) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            dropdownParentLi.classList.remove('active');
        }

        if (!isClickInsideSearch) {
            suggestionList.classList.add('hidden');
            searchContainer.classList.add('hidden');
            searchInput.value = "";
            renderInitialProducts();
        }
    });

    // 螢幕尺寸改變時重設狀態
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            dropdownParentLi.classList.remove('active');
        }
    });

    // 點擊搜尋 icon 顯示或隱藏搜尋欄
    searchToggle.addEventListener('click', () => {
        searchContainer.classList.toggle('hidden');
        suggestionList.classList.add('hidden');
        if (!searchContainer.classList.contains('hidden')) {
            searchInput.focus();
        } else {
            searchInput.value = "";
        }
    });

    // 即時搜尋功能
    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.trim().toLowerCase();
        suggestionList.innerHTML = "";

        if (keyword === "") {
            suggestionList.classList.add('hidden');
            return;
        }

        const matches = window.allProductsData.filter(item => item.name.toLowerCase().includes(keyword));
        if (matches.length > 0) {
            matches.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.name;
                li.addEventListener('click', () => {
                    searchInput.value = item.name;
                    suggestionList.classList.add('hidden');
                    renderSearchResults(item.name);
                });
                suggestionList.appendChild(li);
            });
            suggestionList.classList.remove('hidden');
        } else {
            suggestionList.classList.add('hidden');
        }
    });

    // 按 Enter 搜尋
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const keyword = searchInput.value.trim();
            if (keyword !== "") {
                suggestionList.classList.add('hidden');
                renderSearchResults(keyword);
            }
        }
    });

    // 搜尋按鈕點擊事件，綁定一次
    const searchConfirm = document.querySelector('.search-confirm');
    if (searchConfirm) {
        searchConfirm.addEventListener('click', () => {
            const keyword = searchInput.value.trim();
            if (keyword !== "") {
                suggestionList.classList.add('hidden');
                renderSearchResults(keyword);
            }
        });
    }

    // 商品渲染（ID 101~105）
    function renderInitialProducts() {
        const productContainer = document.getElementById('productList');
        const title = document.getElementById('productSectionTitle');
        if (!productContainer || !title) return;

        const products = window.allProductsData.filter(item => [901, 902, 903].includes(item.id));

        title.textContent = "例圖";

        if (products.length > 0) {
            productContainer.innerHTML = products.map(generateProductHTML).join('');
        } else {
            productContainer.innerHTML = `<div class="no-products">暫無</div>`;
        }

        attachAddToCartEvents();
    }

    // 搜尋結果渲染
    function renderSearchResults(keyword) {
        const results = window.allProductsData.filter(item =>
            item.name.toLowerCase().includes(keyword.toLowerCase())
        );

        const productContainer = document.getElementById('productList');
        const title = document.getElementById('productSectionTitle');
        if (!productContainer || !title) return;

        title.textContent = `搜尋結果：「${keyword}」`;

        if (results.length > 0) {
            productContainer.innerHTML = results.map(generateProductHTML).join('');
        } else {
            productContainer.innerHTML = `<p class="no-products">暫無商品</p>`;
        }

        attachAddToCartEvents();
    }

    // 生成商品卡片 HTML
    function generateProductHTML(product) {
        const isSoldOut = product.stock === 0;
        return `
            <div class="product-card">
                
                    <img src="${product.img}" alt="${product.name}" class="product-img" />
                          
            </div>
        `;
    }


    // 綁定加入購物車事件
    function attachAddToCartEvents() {
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-id'));
                addToCart(productId);
                showToast("已加入購物車！");
                showCartDot();
            });
        });
    }

    // 加入購物車邏輯（localStorage）
    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
    }

    // 更新購物車紅點
    function updateCartBadge() {
        if (!cartBtn) return;
        const badge = cartBtn.querySelector('.cart-badge');
        if (!badge) return;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalCount > 0) {
            badge.textContent = totalCount;
            cartBtn.classList.add('has-items');
        } else {
            badge.textContent = 0;
            cartBtn.classList.remove('has-items');
        }
    }

    // 顯示提示訊息
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

    // 顯示購物車紅點 (初始化呼叫)
    function showCartDot() {
        updateCartBadge();
    }

    // 初始化呼叫
    renderInitialProducts();
    updateCartBadge();
});
