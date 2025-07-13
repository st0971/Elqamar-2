// js/index.js

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const sideMenu = document.getElementById("side-menu");
    const searchBar = document.getElementById("search-bar"); // This is the container for search input
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button"); // The search toggle button (magnifying glass)
    const productList = document.getElementById("product-list");
    const carousel = document.querySelector(".carousel");
    const searchSubmit = document.getElementById("search-submit"); // Add this line if it's missing
    
    // Assuming 'fakeData' is globally available or imported from another file
    // Example fakeData structure:
    // const fakeData = [
    //     { id: 1, name: "商品 A", price: 100, category: "limited", image: "img/product1.jpg", description: "這是商品 A" },
    //     { id: 2, name: "商品 B", price: 150, category: "reborn", image: "img/product2.jpg", description: "這是商品 B" },
    //     { id: 3, name: "商品 C", price: 200, category: "idv", image: "img/product3.jpg", description: "這是商品 C" },
    //     { id: 4, name: "限時開團商品", price: 250, category: "limited", image: "img/product4.jpg", description: "這是限時開團商品" },
    //     // ... more products
    // ];
    
    const itemsPerPage = 6;
    let currentPage = 1;
    let currentDisplayedProducts = []; // Stores products currently being displayed (filtered or default)

    // Determine the category for the current page
    function getCategoryFromPath() {
        
        const path = location.pathname;
        if (path.includes("idv")) return "idv";
        if (path.includes("reborn")) return "reborn";
        if (path.includes("spot")) return "spot";
        if (path.includes("test")) return "test";
        // If it's the homepage (index.html or root), return 'limited' as the default category
        if (path.includes("index.html") || path === "/" || path === "/index.html") {
            return "limited";
        }
        return null; // For other pages that might not have a specific category
    }
    const currentCategory = getCategoryFromPath();

    // Define the initial products for this specific page based on its category
    // This will be used when the search input is empty or hidden
    const initialProductsForThisPage = fakeData.filter(product => {
        if (currentCategory) {
            return product.category === currentCategory;
        }
        return true; // If no specific category, consider all products for initial display (though typically a category will be present)
    });
    
    // Set the default page title based on the category
    // 放在 DOMContentLoaded 裡靠前面

    const defaultPageTitleMap = {
        "limited": "限時開團",
        "idv": "預購商品",
        "reborn": "Reborn 系列",
        "spot": "現貨商品",
        "test": "測試商品",
        null: "所有商品" // fallback
    };

    // 根據目前路徑取得分類
    function getCategoryFromPath() {
        const path = location.pathname.toLowerCase();
        if (path.includes("idv")) return "idv";
        if (path.includes("reborn")) return "reborn";
        if (path.includes("spot")) return "spot";
        if (path.includes("test")) return "test";
        if (path.includes("index.html") || path.endsWith("/") || path.endsWith("index")) return "limited";
        return null;
    }

    const defaultPageTitle = defaultPageTitleMap[currentCategory] || "商品列表";

    // ✅ 設定 h2 標題
    const pageTitleElement = document.getElementById("page-title");
    if (pageTitleElement) {
        pageTitleElement.textContent = defaultPageTitle;
        console.log("設定標題成功：", defaultPageTitle); // 可選：除錯用
    } else {
        console.warn("找不到 page-title 元素");
    }


    // --- 1. 漢堡選單切換 ---
    if (hamburger && sideMenu) {
        hamburger.addEventListener("click", () => {
            sideMenu.classList.toggle("hidden");
        });
    }

    // --- 2. 輪播控制 (保持不變) ---
    let imgs = [];
    let current = 0;
    let autoPlayTimer = null;

    if (carousel) {
        imgs = carousel.querySelectorAll("img");

        function showSlide(index) {
            imgs.forEach((img, i) => {
                img.style.display = i === index ? "block" : "none";
            });
        }

        function showNext() {
            current = (current + 1) % imgs.length;
            showSlide(current);
        }

        function showPrev() {
            current = (current - 1 + imgs.length) % imgs.length;
            showSlide(current);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(showNext, 3000);
        }

        showSlide(current);
        autoPlayTimer = setInterval(showNext, 3000);

        const prevBtn = carousel.querySelector(".prev");
        const nextBtn = carousel.querySelector(".next");

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener("click", () => {
                showPrev();
                resetAutoPlay();
            });

            nextBtn.addEventListener("click", () => {
                showNext();
                resetAutoPlay();
            });
        }
    }

    // --- 搜尋功能核心邏輯 ---

    // Function to filter products and then render them with pagination
    // `dataSource` can be `fakeData` (for site-wide search) or `initialProductsForThisPage` (for default view)
    function filterAndRenderProducts(searchTerm, dataSource, titleToSet) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

        if (lowerCaseSearchTerm !== '') {
            // If there's a search term, filter from the entire `fakeData` set
            currentDisplayedProducts = fakeData.filter(product =>
                (product.name && product.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (product.description && product.description.toLowerCase().includes(lowerCaseSearchTerm))
            );
            // Update page title to show search results
            if (pageTitleElement) {
                pageTitleElement.textContent = `搜尋結果："${searchTerm}"`;
            }
        } else {
            // If no search term, use the initial products for the current page/category
            currentDisplayedProducts = initialProductsForThisPage;
            // Restore the default page title
            if (pageTitleElement) {
                pageTitleElement.textContent = titleToSet;
            }
        }

        currentPage = 1; // Reset to the first page after filtering
        renderProductCards(currentDisplayedProducts, currentPage);
        setupPaginationButtons(currentDisplayedProducts);
    }

    // --- 搜尋欄開關和行為 ---
    if (searchButton && searchInput && searchBar) { // 確保這些元素都存在
        searchButton.addEventListener('click', function (e) {
            e.preventDefault(); // 阻止預設行為 (如跳轉頁面)
            e.stopPropagation(); // 阻止事件冒泡到 window，防止立即觸發外部點擊隱藏

            // 修正點：將切換 hidden 類別的目標改為 searchBar
            searchBar.classList.toggle('hidden'); 

            if (!searchBar.classList.contains('hidden')) { // 檢查 searchBar 是否顯示
                searchInput.focus(); // 如果顯示，則讓輸入框獲得焦點
            } else {
                searchInput.value = ''; // 隱藏時清空內容
                // 當搜尋框隱藏時，恢復顯示首頁預設的商品
                filterAndRenderProducts('', initialProductsForThisPage, defaultPageTitle);
            }
        });

        // Prevent clicks inside the search input/bar from closing it
        searchBar.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止所有在搜尋容器內部發生的點擊事件冒泡
        });

        // Hide search bar when clicking outside
        window.addEventListener('click', function (event) {
            // 如果點擊目標不在 searchBar 內部，並且 searchBar 目前不是隱藏的
            if (searchBar && !searchBar.contains(event.target) && !searchBar.classList.contains('hidden')) {
                searchBar.classList.add('hidden'); // 隱藏 searchBar
                searchInput.value = ''; // 隱藏時清空內容
                // 當點擊搜尋框外部時，恢復顯示首頁預設的商品
                filterAndRenderProducts('', initialProductsForThisPage, defaultPageTitle);
            }
        });

        // --- Real-time search input listener ---
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value;
            // 當有搜尋內容時，搜尋範圍是 allProductsData
            filterAndRenderProducts(searchTerm, fakeData, `搜尋結果："${searchTerm}"`);
        });

        // Optional: Enter key listener (input event already handles real-time)
        // 如果你保留了 search-submit 按鈕，這個區塊可以這樣做
        if (searchSubmit) { // 確保 searchSubmit 存在才綁定
            searchSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                const searchTerm = searchInput.value;
                filterAndRenderProducts(searchTerm, fakeData, `搜尋結果："${searchTerm}"`);
                // 如果你想在點擊「搜尋」按鈕後隱藏搜尋列，可以在這裡加上：
                // searchBar.classList.add('hidden');
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    searchSubmit.click(); // 模擬點擊「搜尋」按鈕
                }
            });
        }
    }

    // --- 渲染商品 (Modified to use `renderProductCards` and `currentDisplayedProducts`) ---
    function renderProductCards(productsToDisplay, page = 1) {
        if (!productList) return;
        productList.innerHTML = ""; // Clear existing products

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const productsForCurrentPage = productsToDisplay.slice(start, end);

        if (productsForCurrentPage.length === 0) {
            productList.innerHTML = "<p>暫無商品。</p>";
            return;
        }

        productsForCurrentPage.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" />
                </a>
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">加入購物車</button>
            `;
            productList.appendChild(card);
        });
        attachAddToCartListeners(); // Re-attach event listeners for cart buttons
    }

    // --- 分頁按鈕 (Modified to use `setupPaginationButtons` and `currentDisplayedProducts`) ---
    let paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) {
        paginationContainer = document.createElement("div");
        paginationContainer.id = "pagination";
        paginationContainer.style.textAlign = "center";
        paginationContainer.style.margin = "15px 0";
        productList.parentNode.insertBefore(paginationContainer, productList.nextSibling);
    }

    function setupPaginationButtons(products) {
        if (!paginationContainer) return;

        const totalPages = Math.ceil(products.length / itemsPerPage);
        paginationContainer.innerHTML = "";

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';
        paginationContainer.style.justifyContent = 'center'; // Center the pagination buttons

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.classList.add('page-btn'); // Add a class for styling
            button.textContent = i;
            button.style.margin = "0 4px";
            button.style.padding = "6px 12px";
            button.style.border = "1px solid #ccc";
            button.style.background = i === currentPage ? "#FEE985" : "white";
            button.style.color = "#542D13";
            button.style.cursor = "pointer";
            button.style.borderRadius = "4px"; // Add some rounding

            if (i === currentPage) {
                button.classList.add('active');
            }

            button.addEventListener("click", () => {
                currentPage = i;
                renderProductCards(products, currentPage);
                // Remove active class from all and add to the clicked one
                paginationContainer.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
            paginationContainer.appendChild(button);
        }
    }

    // --- 加入購物車功能 (Refactored for consistency) ---
    // Make sure getCart(), addToCart(), and updateCartBadge() are defined or imported
    // For example:
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch (e) {
            console.error("Failed to parse cart from localStorage", e);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(productToAdd, quantity = 1) {
        let cart = getCart();
        const existingProductIndex = cart.findIndex(item => item.id === productToAdd.id);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].qty += quantity;
        } else {
            cart.push({ ...productToAdd, qty: quantity });
        }
        saveCart(cart);
        updateCartBadge();
        return true; // Indicate success
    }

    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    }

    function updateCartBadge() {
        const badge = document.getElementById("cart-badge"); // Assuming you have an element with this ID
        const cart = getCart();

        if (badge && cart && cart.length > 0) {
            const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
            badge.textContent = totalQty;
            badge.classList.remove("hidden"); // Ensure it's visible
        } else if (badge) {
            badge.classList.add("hidden"); // Hide if cart is empty
        }
    }

    function attachAddToCartListeners() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            // Remove existing listener to prevent multiple bindings after re-rendering
            btn.removeEventListener('click', handleAddToCart); 
            btn.addEventListener('click', handleAddToCart);
        });
    }

    function handleAddToCart(e) {
        const productId = parseInt(e.currentTarget.dataset.id);
        const productData = fakeData.find(p => p.id === productId);

        if (productData) {
            addToCart(productData); // Pass the product object directly
            showToast('商品已加入購物車！');
        } else {
            console.error('商品資料未找到，ID:', productId);
            showToast('無法將商品加入購物車：商品資料不存在！', 5000);
        }
    }

    // --- 初始化頁面 ---
    // Initial load: render the default products for this page and set up pagination
    filterAndRenderProducts('', initialProductsForThisPage, defaultPageTitle);
    updateCartBadge(); // Update cart badge on page load
});