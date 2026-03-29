const KEY = "rythu_setu_cart";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function setCart(cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.product._id === product._id);
  if (existing) existing.quantity += quantity;
  else cart.push({ product, quantity });
  setCart(cart);
}

export function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.product._id !== productId);
  setCart(cart);
}

export function updateCartQuantity(productId, quantity) {
  const cart = getCart().map((item) =>
    item.product._id === productId ? { ...item, quantity: Math.max(1, Number(quantity || 1)) } : item
  );
  setCart(cart);
}

export function clearCart() {
  setCart([]);
}
