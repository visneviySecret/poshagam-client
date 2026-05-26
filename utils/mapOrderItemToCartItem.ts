type OrderItemFromApi = {
  id?: number;
  product_id?: number;
  quantity?: number;
  count?: number;
  price?: number | string;
  product_name?: string;
  name?: string;
  product_images?: string;
  images?: string[];
};

export function mapOrderItemToCartItem(item: OrderItemFromApi) {
  const productId = item.product_id ?? item.id;
  let images: string[] = [];

  if (Array.isArray(item.images) && item.images.length > 0) {
    images = item.images;
  } else if (item.product_images) {
    try {
      const parsed = JSON.parse(item.product_images);
      if (Array.isArray(parsed)) {
        images = parsed;
      }
    } catch {
      images = [];
    }
  }

  return {
    product: {
      id: productId,
      product_id: productId,
      name: item.product_name ?? item.name,
      product_name: item.product_name,
      price: Number(item.price),
      images,
      preview: images[0] ?? null,
    },
    count: item.quantity ?? item.count ?? 1,
  };
}
