interface Product {
  description: string;
  id: number;
  images: string[];
  name: string;
  preview: string;
  price: number;
  instruction: string;
}

interface CreateProductPayload extends Omit<Product, "id" | "photo"> {
  images: Blob[];
}
