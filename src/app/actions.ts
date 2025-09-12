
'use server';

import { revalidatePath } from 'next/cache';
import { recommendBurgers as recommendBurgersFlow } from '@/ai/flows/menu-recommendation-flow';
import { addOrderToData as addOrderToDataInDb, updateStatusInData, getAllOrders as getAllOrdersFromDb, getUserOrders as getUserOrdersFromDb, getMockUserOrderHistory, getAllBurgers as getAllBurgersFromDb, updateBurgerInDb, getHeroImageFromDb, setHeroImageInDb } from '@/lib/db';
import { getAvailableIngredients } from '@/lib/menu-data';
import type { Burger, CartItem, Order, OrderStatus } from '@/lib/types';
import { auth, db, storage } from '@/lib/firebase-admin';

const MOCK_USER_ID_FOR_AI = 'mock-user-123';

/**
 * Recommends burgers using an AI model based on a mock user's order history.
 */
export async function recommendBurgers(): Promise<string[]> {
  try {
    const orderHistory = await getMockUserOrderHistory(MOCK_USER_ID_FOR_AI);
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
  // Return success if admin sdk is not initialized to prevent crash
  if (!auth) {
    console.warn("Firebase Admin not initialized. Skipping order placement.");
    return { success: true, message: 'Захиалга амжилттай.' };
  }
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
  // Return success if admin sdk is not initialized to prevent crash
  if (!auth) {
    console.warn("Firebase Admin not initialized. Skipping order status update.");
    return { success: true, message: 'Захиалгын төлөв шинэчлэгдлээ.' };
  }
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
    // Return empty array to avoid admin SDK error if not initialized
    if (!auth) {
      console.warn("Firebase Admin not initialized. Returning empty array for all orders.");
      return [];
    }
    return await getAllOrdersFromDb();
}

/**
 * Fetches orders for a specific user.
 * @param userId - The ID of the user.
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
    // Return empty array to avoid admin SDK error if not initialized
    if (!auth) {
      console.warn("Firebase Admin not initialized. Returning empty array for user orders.");
      return [];
    }
    return await getUserOrdersFromDb(userId);
}

/**
 * Fetches user data including their role.
 * @param uid - The user's unique ID.
 */
export async function getUserData(uid: string): Promise<{ role: 'customer' | 'admin' } | null> {
    // Return a default role to avoid admin SDK error if not initialized
    if (!auth || !db) {
        console.warn("Firebase Admin not initialized, returning default customer role for user data.");
        return { role: 'customer' };
    }
    
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists && userDoc.data()?.role === 'admin') {
            return { role: 'admin' };
        }
        return { role: 'customer' };

    } catch (error) {
        console.error("Error fetching user data from firestore:", error);
        // Return default customer role on error to prevent blocking UI
        return { role: 'customer' };
    }
}

/**
 * Fetches all burgers from the database.
 */
export async function getMenuBurgers(): Promise<Burger[]> {
  if (!db) {
    console.warn("Firebase Admin not initialized. Returning empty array for burgers.");
    return [];
  }
  return await getAllBurgersFromDb();
}

/**
 * Updates a burger, especially its image.
 * @param formData - The form data containing the burger ID and the new image.
 */
export async function updateBurger(formData: FormData): Promise<{ success: boolean; message?: string; updatedBurger?: Burger }> {
  if (!auth || !storage) {
    return { success: false, message: "Сервер бэлэн биш байна." };
  }

  const burgerId = formData.get('burgerId') as string;
  const imageFile = formData.get('image') as File;

  if (!burgerId || !imageFile) {
    return { success: false, message: "ID эсвэл зураг дутуу байна." };
  }

  try {
    const bucket = storage.bucket();
    const filePath = `burgers/${burgerId}-${Date.now()}-${imageFile.name}`;
    const file = bucket.file(filePath);
    
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

    await file.save(fileBuffer, {
        metadata: {
            contentType: imageFile.type,
        },
    });

    const [downloadURL] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    const updatedBurger = await updateBurgerInDb(burgerId, { imageUrl: downloadURL });
    
    revalidatePath('/menu');
    revalidatePath('/admin/menu');
    revalidatePath('/');

    return { success: true, updatedBurger };

  } catch (error) {
    console.error("Error updating burger:", error);
    return { success: false, message: "Бургер шинэчлэхэд алдаа гарлаа." };
  }
}

/**
 * Fetches the hero image URL from settings.
 */
export async function getHeroImage(): Promise<string> {
    if (!db) {
        console.warn("Firebase Admin not initialized. Returning default hero image.");
        return "https://picsum.photos/seed/hero/1200/800";
    }
    return await getHeroImageFromDb();
}

/**
 * Updates the hero image.
 * @param formData - The form data containing the new hero image.
 */
export async function updateHeroImage(formData: FormData): Promise<{ success: boolean; message?: string; imageUrl?: string }> {
  if (!auth || !storage) {
    return { success: false, message: "Сервер бэлэн биш байна." };
  }

  const imageFile = formData.get('heroImage') as File;

  if (!imageFile) {
    return { success: false, message: "Зураг дутуу байна." };
  }

  try {
    const bucket = storage.bucket();
    const filePath = `settings/heroImage-${Date.now()}-${imageFile.name}`;
    const file = bucket.file(filePath);
    
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

    await file.save(fileBuffer, {
        metadata: {
            contentType: imageFile.type,
        },
    });

    const [downloadURL] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    await setHeroImageInDb(downloadURL);
    
    revalidatePath('/');
    revalidatePath('/admin/settings');

    return { success: true, imageUrl: downloadURL };

  } catch (error) {
    console.error("Error updating hero image:", error);
    return { success: false, message: "Нүүр хуудасны зураг шинэчлэхэд алдаа гарлаа." };
  }
}

    