
'use server';

import { collection, addDoc, getDocs, query, where, updateDoc, doc, Timestamp, orderBy, getDoc } from 'firebase/firestore';
import { db } from './firebase-admin';
import type { Order, OrderStatus, CartItem, OrderItem, Burger } from '@/lib/types';


// --- FIREBASE ORDERS (SERVER-SIDE) ---

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    await db.collection("orders").add(newOrder);
}


export const getUserOrders = async (userId: string): Promise<Order[]> => {
    if (!userId) return [];
    const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"));
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
    return orders;
};

export const getAllOrders = async (): Promise<Order[]> => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
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
    return orders;
};


export const updateStatusInData = async (orderId: string, status: OrderStatus): Promise<void> => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status: status
  });
};

// --- FIREBASE BURGERS (SERVER-SIDE) ---
export const getAllBurgers = async (): Promise<Burger[]> => {
    const q = query(collection(db, "burgers"), orderBy("name"));
    const querySnapshot = await getDocs(q);
    const burgers: Burger[] = [];
    querySnapshot.forEach((doc) => {
        burgers.push({
            id: doc.id,
            ...doc.data()
        } as Burger);
    });
    return burgers;
}

export const updateBurgerInDb = async (burgerId: string, data: Partial<Burger>): Promise<Burger> => {
    const burgerRef = doc(db, "burgers", burgerId);
    await updateDoc(burgerRef, data);
    const updatedDoc = await getDoc(burgerRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Burger;
}


// --- MOCK Functions (for AI) ---
const mockOrderHistoryForAI = {
    'mock-user-123': ['Сонгодог Чизбургер', 'Дабль Трабль', 'Халуун ногоотой Халапено']
};

export async function getMockUserOrderHistory(userId: string) {
  const history = mockOrderHistoryForAI[userId as keyof typeof mockOrderHistoryForAI] || [];
  return JSON.stringify(history);
}
