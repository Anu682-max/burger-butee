
'use server';

import { revalidatePath } from 'next/cache';
import { recommendBurgers as recommendBurgersFlow } from '@/ai/flows/menu-recommendation-flow';
import { getAvailableIngredients, getMockUserOrderHistory, updateStatusInData, addOrderToData } from '@/lib/data';
import type { CartItem, OrderStatus } from '@/lib/types';

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
    await addOrderToData({ items, totalPrice, userId, userEmail, deliveryAddress });
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
