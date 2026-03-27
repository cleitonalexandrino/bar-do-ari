export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
  image_url?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}
