
'use server';

import { revalidatePath } from 'next/cache';
import { recommendBurgers as recommendBurgersFlow } from '@/ai/flows/menu-recommendation-flow';
import { addOrderToData as addOrderToDataInDb, updateStatusInData, getAllOrders as getAllOrdersFromDb, getUserOrders as getUserOrdersFromDb, getMockUserOrderHistory } from '@/lib/db';
import { getAvailableIngredients } from '@/lib/menu-data';
import type { CartItem, Order, OrderStatus } from '@/lib/types';
import { auth } from '@/lib/firebase-admin';

const MOCK_USER_ID_FOR_AI = 'mock-user-123';

/**
 * Recommends burgers using an AI model based on a mock user's order history.
 */
export async function recommendBurgers(): Promise<string[]> {
  try {
    const orderHistory = getMockUserOrderHistory(MOCK_USER_ID_FOR_AI);
    const availableIngredients = getAvailableIngredients();

    const result = await recommendBurgersFlow({
      orderHistory,
      availableIngredients,
    });
    
    return result.recommendations;
  } catch (error) {
    console.error('Error getting burger recommendations:', error);
    return [];
  }
}

/**
 * Places a new order.
 * @param items - The items in the cart.
 * @param totalPrice - The total price of the order.
 * @param userId - The ID of the user placing the order.
 * @param userEmail - The email of the user placing the order.
 * @param deliveryAddress - The delivery address.
 */
export async function placeOrder(items: CartItem[], totalPrice: number, userId: string, userEmail: string, deliveryAddress: string) {
  try {
    await addOrderToDataInDb({ items, totalPrice, userId, userEmail, deliveryAddress });
    revalidatePath('/orders');
    revalidatePath('/admin/orders');
    return { success: true, message: 'Захиалга амжилттай.' };
  } catch (error) {
    console.error('Error placing order:', error);
    return { success: false, message: 'Захиалга хийхэд алдаа гарлаа.' };
  }
}

/**
 * Updates the status of an existing order.
 * @param orderId - The ID of the order to update.
 * @param status - The new status of the order.
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    await updateStatusInData(orderId, status);
    revalidatePath('/admin/orders');
    revalidatePath('/orders');
    return { success: true, message: 'Захиалгын төлөв шинэчлэгдлээ.' };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, message: 'Захиалгын төлөв шинэчлэхэд алдаа гарлаа.' };
  }
}

/**
 * Fetches all orders for the admin page.
 */
export async function getAllOrders(): Promise<Order[]> {
    return await getAllOrdersFromDb();
}

/**
 * Fetches orders for a specific user.
 * @param userId - The ID of the user.
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
    return await getUserOrdersFromDb(userId);
}

/**
 * Fetches user data including their role.
 * @param uid - The user's unique ID.
 */
export async function getUserData(uid: string): Promise<{ role: 'customer' | 'admin' } | null> {
    try {
        const userRecord = await auth.getUser(uid);
        const role = userRecord.customClaims?.role === 'admin' ? 'admin' : 'customer';

        if (role === 'admin') {
            return { role: 'admin' };
        }
        
        // Fallback to check Firestore if claims are not set
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists && userDoc.data()?.role === 'admin') {
            return { role: 'admin' };
        }
        
        return { role: 'customer' };

    } catch (error) {
        console.error("Error fetching user data:", error);
         // Gracefully fallback to checking firestore
        try {
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists && userDoc.data()?.role === 'admin') {
                return { role: 'admin' };
            }
        } catch (dbError) {
             console.error("Error fetching user data from firestore:", dbError);
        }
        return null;
    }
}
