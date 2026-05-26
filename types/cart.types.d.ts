interface Cart {
  id: number;
  user_id: number;
  status: string;
  amount: number;
  created_at: string;
  updated_at: string;
  items: CartItemFromApi[];
}

type CartRequest = {
  items: CartItemPayload[];
};

interface CartItemPayload {
  product_id: number;
  count: number;
  price?: number;
}

interface CartItemFromApi {
  id?: number;
  product_id?: number;
  quantity?: number;
  count?: number;
  price?: number | string;
  product_name?: string;
  name?: string;
  product_images?: string;
  images?: string[];
}
