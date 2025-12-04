
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'clothing' | 'movie';
  sizes?: string[];
  stripeUrl: string;
}

export interface CartItem {
  product: Product;
  size?: string;
  quantity: number;
  finalPrice: number;
}
