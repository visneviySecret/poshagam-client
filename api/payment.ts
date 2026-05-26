import axios from "~/utils/axios";

interface CartItemPayload {
  product_id: number;
  count: number;
  price: number;
}

export const createPaymentUrl = async (data: {
  cartId?: number;
  items?: CartItemPayload[];
}) => {
  const response = await axios.post("/payment/create", data);
  return response.data;
};

