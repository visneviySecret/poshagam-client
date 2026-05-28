import apiClient from "~/utils/axios";

export type Category = {
  id: number;
  name: string;
};

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get("/products/categories");
  return response.data;
}

