import apiClient from "~/utils/axios";

export async function createCart(cart: CartRequest) {
  const response = await apiClient.post("/cart/create", cart);
  return response.data;
}

export async function getMyCart() {
  const response = await apiClient.get("/cart");
  return response.data;
}

export async function updateCart(cartId: number, cart: CartRequest) {
  const response = await apiClient.put(`/cart/${cartId}`, cart);
  return response.data;
}

export async function clearCart() {
  const response = await apiClient.delete("/cart/");
  return response.data;
}
