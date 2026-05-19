import apiClient from "~/utils/axios";

async function getProducts(): Promise<Product[]> {
  const response = await apiClient.get("/products");
  return response.data;
}

async function createProduct(payload: CreateProductPayload) {
  const response = await apiClient.post("/products/create", payload);
  return response.data;
}

async function getOwnerProducts(): Promise<Product[]> {
  const response = await apiClient.get("/products/owner");
  return response.data;
}

async function deleteProduct(productId: number) {
  const response = await apiClient.delete(`/products/${productId}`);
  return response.data;
}

async function getProductForEdit(productId: number): Promise<Product> {
  const response = await apiClient.get(`/products/edit/${productId}`);
  return response.data;
}

async function updateProduct(productId: number, payload: CreateProductPayload) {
  const response = await apiClient.patch(`/products/${productId}`, payload);
  return response.data;
}

export {
  getProducts,
  createProduct,
  getOwnerProducts,
  deleteProduct,
  getProductForEdit,
  updateProduct,
};
