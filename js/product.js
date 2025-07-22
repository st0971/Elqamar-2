document.addEventListener("DOMContentLoaded", () => {
  const detailContainer = document.getElementById("product-detail");


  // 讀取 URL 參數 ?id=xxx
  const params = new URLSearchParams(location.search);
  const productId = parseInt(params.get("id"));

  if (!productId) {
    detailContainer.innerHTML = "<p>商品ID錯誤，無法顯示商品。</p>";
    return;
  }

  const product = fakeData.find(p => p.id === productId);

  if (!product) {
    detailContainer.innerHTML = "<p>找不到該商品。</p>";
    return;
  }

  detailContainer.innerHTML = `
  <h2>${product.name}</h2>
  <img src="${product.image}" alt="${product.name}" style="width:100%;max-width:400px;border-radius:8px;" />
  <p>價格：$${product.price}</p>
  <p>${(product.description || "").replace(/\n/g, "<br>")}</p>

  <label for="qty-select" style="font-weight:bold;">數量：</label>
  <select id="qty-select" style="margin: 10px 0; padding: 6px 10px; border-radius: 4px;">
  ${[...Array(product.stock || 10)].map((_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
  </select>

  <br/>
  <button id="add-to-cart-btn" style="background:#FEE985;color:#542D13;border:none;padding:10px 20px;border-radius:6px;font-weight:bold;">
    加入購物車
  </button>
`;


  // 加入購物車事件
  document.getElementById("add-to-cart-btn").addEventListener("click", () => {
    const qty = parseInt(document.getElementById("qty-select").value) || 1;
    const productToAdd = { ...product, qty };  // 複製一份產品並加入 qty
    addToCart(productToAdd);
    updateCartBadge();
    alert("已加入購物車！");
  });


  // 更新購物車小紅點
  function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  const cart = getCart();

  if (badge && cart && cart.length > 0) {
    const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    badge.textContent = totalQty;
    badge.classList.remove("hidden");
  } else if (badge) {
    badge.classList.add("hidden");
  }
  }


  updateCartBadge();

  // 漢堡選單和搜尋切換同首頁 main.js
  const hamburger = document.getElementById("hamburger");
  const sideMenu = document.getElementById("side-menu");

  hamburger.addEventListener("click", () => {
    sideMenu.classList.toggle("hidden");
  });

});
