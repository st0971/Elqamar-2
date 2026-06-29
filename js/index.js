document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownParentLi = dropdownToggle.parentElement;

    const searchToggle = document.querySelector('.search-toggle');
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');
    const suggestionList = document.querySelector('.suggestion-list');
    const searchConfirm = document.querySelector('.search-confirm');

    const cartBtn = document.querySelector('.cart-icon'); // ← 修正選擇器

    // ✅ 初始隱藏手機版選單
    dropdownParentLi.classList.remove('active');

    // ✅ 漢堡選單切換
    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        if (!navLinks.classList.contains('active')) {
            dropdownParentLi.classList.remove('active');
        }
    });

    // ✅ 手機下拉選單展開/收合
    dropdownToggle.addEventListener('click', function (event) {
        event.preventDefault();
        if (window.innerWidth <= 768) {
            dropdownParentLi.classList.toggle('active');
        }
    });

    // ✅ 點選導覽選單後自動收合
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

    // ✅ 點擊外部收合導覽與搜尋欄
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
            renderInitialProducts(); // 回復初始商品
        }
    });

    // ✅ 螢幕寬度變化時自動收合選單
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            dropdownParentLi.classList.remove('active');
        }
    });

  
    // ✅ 渲染首頁商品（ID 1~3）
    function renderInitialProducts() {
        const productContainer = document.getElementById('productList');
        const title = document.getElementById('productSectionTitle');
        if (!productContainer || !title) return;

        const products = window.allProductsData.filter(item => [1, 2, 3].includes(item.id));

        title.textContent = "委託項目";

        if (products.length > 0) {
            productContainer.innerHTML = products.map(generateProductHTML).join('');
        } else {
            productContainer.innerHTML = `<div class="no-products">暫無</div>`;
        }

        attachAddToCartEvents();
    }



   

    // ✅ 單一商品卡片 HTML
    function generateProductHTML(product) {
        return `
            <div class="product-card">
                <a href="product.html?id=${product.id}">
                    <img src="${product.img}" alt="${product.name}" class="product-img" />
                </a>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <button class="add-to-cart" data-id="${product.id}">加入購物車</button>
                </div>
            </div>
        `;
    }

    // ✅ 加入購物車按鈕綁定
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

    // ✅ 加入購物車（儲存在 localStorage）
    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.id === productId);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        console.log("✅ 加入後購物車內容：", cart); // ← 這行會幫你 debug
        updateCartBadge();
    }

    // ✅ 輪播功能（滿版 + 自動播放）
    (function initCarousel() {
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        let currentIndex = 0;
        let autoPlayInterval;

        function updateCarousel() {
            const slideWidth = slides[0].clientWidth;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
            resetAutoPlay();
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
            resetAutoPlay();
        }

        function autoPlay() {
            autoPlayInterval = setInterval(showNext, 5000); // 每 5 秒播放一次
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlay();
        }

        window.addEventListener('resize', updateCarousel);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        updateCarousel(); // 初始定位
        autoPlay();       // 啟動自動播放
    })();


    // ✅ 更新購物車紅點
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

    // ✅ 顯示提示訊息
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

    // ✅ 初次載入顯示紅點
    function showCartDot() {
        updateCartBadge();
    }

    // ✅ 初始化
    renderInitialProducts();
    updateCartBadge();
});
