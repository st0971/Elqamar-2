document.addEventListener("DOMContentLoaded", () => {
    const cartTableBody = document.querySelector("#cart-table tbody");
    const totalPriceEl = document.getElementById("total-price");
    const badge = document.getElementById("cart-badge"); // 這個在 header 沒有，不會顯示小紅點

    // 新增的元素選擇
    const cartTable = document.getElementById("cart-table");
    const cartSummary = document.getElementById("cart-summary");
    const checkoutBtn = document.getElementById("checkout-btn");
    const emptyCartMessage = document.getElementById("empty-cart-message");

    // 漢堡選單切換
    const hamburger = document.getElementById("hamburger");
    const sideMenu = document.getElementById("side-menu");
    if (hamburger && sideMenu) {
        hamburger.addEventListener("click", () => {
            sideMenu.classList.toggle("hidden");
        });
    }

    function updateCartUI() {
    let cart = getCart() || [];

    // ✅ 過濾掉 localStorage 中已經不在資料庫的商品
    const validProductIds = allProductsData.map(p => p.id); // 或 fakeData
    const originalLength = cart.length;
    cart = cart.filter(item => validProductIds.includes(item.id));
    if (cart.length !== originalLength) {
        saveCart(cart); // 移除無效商品
    }

    console.log("目前購物車內容（過濾後）:", cart);

    cartTableBody.innerHTML = ""; // 清空表格內容

        if (cart.length === 0) {
            // 購物車為空：顯示提示訊息，隱藏表格、總金額和結帳按鈕
            if (emptyCartMessage) { // 檢查元素是否存在
                emptyCartMessage.style.display = 'block';
            }
            if (cartTable) {
                cartTable.style.display = 'none';
            }
            if (cartSummary) {
                cartSummary.style.display = 'none';
            }
            if (checkoutBtn) {
                checkoutBtn.style.display = 'none';
            }

            totalPriceEl.textContent = "總金額：$0";
            if (badge) badge.classList.add("hidden");

            return; // 結束函式執行
        }

        // 購物車有商品：隱藏提示訊息，顯示表格、總金額和結帳按鈕
        if (emptyCartMessage) { // 檢查元素是否存在
            emptyCartMessage.style.display = 'none';
        }
        if (cartTable) {
            cartTable.style.display = 'table'; // 使用 'table' 來確保表格正確顯示
        }
        if (cartSummary) {
            cartSummary.style.display = 'block';
        }
        if (checkoutBtn) {
            checkoutBtn.style.display = 'block';
        }

        let total = 0;
        cart.forEach(item => {
            const subtotal = item.qty * item.price;
            total += subtotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <a href="product.html?id=${item.id}" class="cart-product-link">
                        <img src="${item.image}" alt="${item.name}" class="cart-product-img" />
                        ${item.name}
                    </a>
                </td>
                <td>$${item.price}</td>
                <td>
                    <select data-id="${item.id}">
                        ${Array.from({ length: 10 }, (_, i) =>
                            `<option value="${i + 1}" ${item.qty === i + 1 ? "selected" : ""}>${i + 1}</option>`
                        ).join("")}
                    </select>
                </td>
                <td>$${subtotal}</td>
                <td><button data-id="${item.id}" class="delete-btn">刪除</button></td>
            `;
            cartTableBody.appendChild(row);
        });

        totalPriceEl.textContent = `總金額：$${total}`;
        if (badge) {
            badge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
            badge.classList.remove("hidden");
        }
    }

    // 監聽數量變更
    cartTableBody.addEventListener("change", e => {
        if (e.target.tagName === "SELECT") {
            const id = parseInt(e.target.dataset.id);
            const qty = parseInt(e.target.value);
            const cart = getCart() || [];
            const index = cart.findIndex(item => item.id === id);
            if (index !== -1) {
                cart[index].qty = qty;
                saveCart(cart);
                updateCartUI();
            }
        }
    });

    // 監聽刪除按鈕
    cartTableBody.addEventListener("click", e => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            const cart = getCart() || [];
            const index = cart.findIndex(item => item.id === id);
            if (index !== -1) {
                cart.splice(index, 1);
                saveCart(cart);
                updateCartUI();
            }
        }
    });

    // 結帳事件
    if (checkoutBtn) { // 檢查元素是否存在
        checkoutBtn.addEventListener("click", () => {
            alert("請前往IG、FB喊單！");
        });
    }

    // 初始化購物車介面
    updateCartUI();
});
