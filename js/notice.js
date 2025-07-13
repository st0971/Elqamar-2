document.addEventListener("DOMContentLoaded", () => {
  // 漢堡選單切換
  const hamburger = document.getElementById("hamburger");
  const sideMenu = document.getElementById("side-menu");
  if (hamburger && sideMenu) {
    hamburger.addEventListener("click", () => {
      sideMenu.classList.toggle("hidden");
    });
  }

  // 取得購物車資料
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      console.error("解析購物車資料失敗", e);
      return [];
    }
  }

  // 更新購物車紅點數量
  function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    const cart = getCart();

    if (badge && cart.length > 0) {
      const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
      if (totalQty > 0) {
        badge.textContent = totalQty;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    } else if (badge) {
      badge.classList.add("hidden");
    }
  }

  updateCartBadge();
});
