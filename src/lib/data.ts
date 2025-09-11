
import type { Burger, Ingredient, Order, OrderStatus, CartItem, OrderItem, IngredientInfo } from '@/lib/types';
import { Beef, DollarSign } from 'lucide-react';
import { BunIcon, LettuceIcon, OnionIcon, PicklesIcon, SauceIcon, TomatoIcon } from '@/components/icons';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// --- INGREDIENTS ---
export const ingredients: Ingredient[] = [
  { id: 'bun-classic', name: 'Сонгодог булочка', category: 'bun', price: 1000, icon: BunIcon },
  { id: 'bun-sesame', name: 'Гүнждийн үртэй булочка', category: 'bun', price: 1200, icon: BunIcon },
  { id: 'patty-beef', name: 'Үхрийн мах', category: 'patty', price: 4000, icon: Beef },
  { id: 'patty-chicken', name: 'Тахианы мах', category: 'patty', price: 3500, icon: Beef },
  { id: 'cheese-cheddar', name: 'Чеддар бяслаг', category: 'cheese', price: 1500, icon: DollarSign },
  { id: 'cheese-swiss', name: 'Швейцарь бяслаг', category: 'cheese', price: 1800, icon: DollarSign },
  { id: 'topping-lettuce', name: 'Салатын навч', category: 'topping', price: 500, icon: LettuceIcon },
  { id: 'topping-tomato', name: 'Улаан лооль', category: 'topping', price: 500, icon: TomatoIcon },
  { id: 'topping-onion', name: 'Сонгино', category: 'topping', price: 300, icon: OnionIcon },
  { id: 'topping-pickles', name: 'Даршилсан өргөст хэмх', category: 'topping', price: 700, icon: PicklesIcon },
  { id: 'sauce-ketchup', name: 'Кетчуп', category: 'sauce', price: 300, icon: SauceIcon },
  { id: 'sauce-mayo', name: 'Майонез', category: 'sauce', price: 300, icon: SauceIcon },
  { id: 'sauce-bbq', name: 'BBQ соус', category: 'sauce', price: 500, icon: SauceIcon },
];

export const getIngredients = () => ingredients;
export const getAvailableIngredients = () => JSON.stringify(ingredients.map(i => i.name));


// --- MENU BURGERS ---
const burgers: Burger[] = [
  { id: '1', name: 'Сонгодог Чизбургер', ingredients: ['bun-classic', 'patty-beef', 'cheese-cheddar', 'topping-pickles', 'sauce-ketchup'], price: 8500, imgId: 'classic-cheeseburger' },
  { id: '2', name: 'Бэкон Делюкс', ingredients: ['bun-sesame', 'patty-beef', 'cheese-cheddar', 'topping-lettuce', 'topping-tomato', 'topping-onion'], price: 12500, imgId: 'bacon-deluxe' },
  { id: '3', name: 'Дабль Трабль', ingredients: ['bun-classic', 'patty-beef', 'patty-beef', 'cheese-cheddar', 'cheese-cheddar', 'topping-pickles'], price: 15000, imgId: 'double-trouble' },
  { id: '4', name: 'Халуун ногоотой Халапено', ingredients: ['bun-sesame', 'patty-beef', 'cheese-swiss', 'topping-onion'], price: 11000, imgId: 'spicy-jalapeno' },
  { id: '5', name: 'Цагаан хоолтны дилайт', ingredients: ['bun-sesame', 'cheese-swiss', 'topping-lettuce', 'topping-tomato'], price: 9000, imgId: 'veggie-delight' },
  { id: '6', name: 'BBQ Ранчер', ingredients: ['bun-classic', 'patty-beef', 'cheese-cheddar', 'sauce-bbq'], price: 11500, imgId: 'bbq-rancher' },
];

export const getMenuBurgers = () => burgers;


// --- FIREBASE ORDERS ---

export const addOrderToData = async (
    { items, totalPrice, userId, userEmail, deliveryAddress }: 
    { items: CartItem[], totalPrice: number, userId: string, userEmail: string, deliveryAddress: string }
) => {
    const orderItems: OrderItem[] = items.map(cartItem => {
        const item: OrderItem = {
            id: cartItem.id,
            name: cartItem.name,
            quantity: cartItem.quantity,
            price: cartItem.price,
        };
        if (cartItem.ingredients) {
            item.ingredients = cartItem.ingredients.map(({icon, ...rest}) => rest)
        }
        return item;
    });

    const newOrder = {
        userId,
        userEmail,
        items: orderItems,
        totalPrice,
        status: 'Хүлээгдэж буй',
        createdAt: Timestamp.now(),
        deliveryAddress: deliveryAddress,
    };
    
    await addDoc(collection(db, "orders"), newOrder);
}


export const getUserOrders = async (userId: string): Promise<Order[]> => {
    if (!userId) return [];
    const q = query(collection(db, "orders"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as Order);
    });
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getAllOrders = async (): Promise<Order[]> => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as Order);
    });
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};


export const updateStatusInData = async (orderId: string, status: OrderStatus): Promise<void> => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status: status
  });
};


// --- MOCK Functions (for AI) ---
const mockOrderHistoryForAI = {
    'mock-user-123': ['Сонгодог Чизбургер', 'Дабль Трабль', 'Халуун ногоотой Халапено']
};

export const getMockUserOrderHistory = (userId: string) => {
  const history = mockOrderHistoryForAI[userId as keyof typeof mockOrderHistoryForAI] || [];
  return JSON.stringify(history);
}
