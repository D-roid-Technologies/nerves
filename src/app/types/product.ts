export interface Product {
  id: number;
  name: string;
  price: number;
  slug?: string;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  description?: string;
  details?: string[];
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
  category?: string;
}
