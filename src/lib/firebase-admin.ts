
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;

if (!admin.apps.length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error("Firebase Admin SDK environment variables are not properly set. Check your .env file. Required: NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });

    console.log("Firebase Admin SDK initialized successfully.");
    db = admin.firestore();
    auth = admin.auth();

  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    // Throw an error to prevent the app from starting with a misconfigured Firebase admin SDK
    throw new Error('Could not initialize Firebase Admin SDK. See server logs for details.');
  }
} else {
    // If the app is already initialized, get the instances
    db = admin.firestore();
    auth = admin.auth();
}


export { auth, db };
