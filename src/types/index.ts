export type Locale = "ar" | "en";

export type Category = "makeup" | "perfume" | "skincare";

export interface Product {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  stock: number;
  category: Category;
  image_url: string;
  is_featured: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  city?: string;
  address?: string;
  lat?: number;
  lng?: number;
  is_admin: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  city: string;
  address: string;
  created_at: string;
}
