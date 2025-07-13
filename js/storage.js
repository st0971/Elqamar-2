function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 檢查是否已有相同商品（用 ID 判斷）
  const index = cart.findIndex(item => item.id === product.id);
  if (index !== -1) {
    // 如果已存在，累加數量
    cart[index].qty = Number(cart[index].qty) + Number(product.qty || 1);
  } else {
    // 否則加入新項目（帶入數量）
    cart.push({ ...product, qty: Number(product.qty || 1) });
  }

  // 儲存回 localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}
