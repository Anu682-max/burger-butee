
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import { getStorage } from 'firebase-admin/storage';

dotenv.config();

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;
let storage: admin.storage.Storage;

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // The private key from the .env file often has its newlines escaped. We need to un-escape them.
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (!projectId || !clientEmail || !privateKey) {
        console.warn("Firebase Admin SDK environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are not fully set. Server-side Firebase services will not be available.");
    } else {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: projectId,
            clientEmail: clientEmail,
            privateKey: privateKey,
          }),
          storageBucket: storageBucket,
        });

        console.log("Firebase Admin SDK initialized successfully.");
        db = admin.firestore();
        auth = admin.auth();
        storage = getStorage();
    }

  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
  }
} else {
    // If the app is already initialized, get the instances
    const app = admin.app();
    db = admin.firestore(app);
    auth = admin.auth(app);
    storage = getStorage(app);
}


export { auth, db, storage };
