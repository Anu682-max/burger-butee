
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'customer' | 'admin';
}

export type IngredientCategory = 'bun' | 'patty' | 'cheese' | 'topping' | 'sauce';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  price: number;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Burger {
  id: string;
  name: string;
  ingredients: string[]; // array of ingredient ids
  price: number;
  imgId: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  ingredients?: Ingredient[];
}

export interface CartItem extends OrderItem {
  image: string;
}

export type OrderStatus = 'Хүлээгдэж буй' | 'Бэлтгэгдэж буй' | 'Хүргэлтэнд гарсан' | 'Хүргэгдсэн' | 'Цуцлагдсан';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  deliveryAddress?: string;
}
