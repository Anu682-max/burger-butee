
'use server';

import { collection, addDoc, getDocs, query, where, updateDoc, doc, Timestamp, orderBy, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase-admin';
import type { Order, OrderStatus, CartItem, OrderItem, Burger } from '@/lib/types';


// --- FIREBASE ORDERS (SERVER-SIDE) ---

export const addOrderToData = async (
    { items, totalPrice, userId, userEmail, deliveryAddress }:
    { items: CartItem[], totalPrice: number, userId: string, userEmail: string, deliveryAddress: string }
) => {
    if (!db) {
        console.warn('DB not available, skipping addOrderToData');
        return;
    }
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
    if (!userId || !db) return [];
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
    if (!db) return [];
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
  if (!db) return;
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status: status
  });
};

// --- FIREBASE BURGERS (SERVER-SIDE) ---
export const getAllBurgers = async (): Promise<Burger[]> => {
    if (!db) return [];
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
    if (!db) throw new Error("Database not available");
    const burgerRef = doc(db, "burgers", burgerId);
    await updateDoc(burgerRef, data);
    const updatedDoc = await getDoc(burgerRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Burger;
}


// --- FIREBASE SETTINGS (SERVER-SIDE) ---
export const getHeroImageFromDb = async (): Promise<string> => {
    const defaultImage = "https://firebasestorage.googleapis.com/v0/b/studio-8825636989-becf3.appspot.com/o/Burger%20build.png?alt=media";
    if (!db) return defaultImage;
    
    try {
        const settingsDoc = await getDoc(doc(db, "settings", "site"));
        if (settingsDoc.exists() && settingsDoc.data().heroImageUrl) {
            return settingsDoc.data().heroImageUrl;
        }
        return defaultImage;
    } catch(error) {
        console.error("Error fetching hero image:", error);
        return defaultImage;
    }
}

export const setHeroImageInDb = async (imageUrl: string): Promise<void> => {
    if (!db) throw new Error("Database not available");
    await setDoc(doc(db, "settings", "site"), { heroImageUrl: imageUrl }, { merge: true });
}


// --- MOCK Functions (for AI) ---
const mockOrderHistoryForAI = {
    'mock-user-123': ['Сонгодог Чизбургер', 'Дабль Трабль', 'Халуун ногоотой Халапено']
};

export async function getMockUserOrderHistory(userId: string) {
  const history = mockOrderHistoryForAI[userId as keyof typeof mockOrderHistoryForAI] || [];
  return JSON.stringify(history);
}

