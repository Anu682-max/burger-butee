
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

    if (projectId && clientEmail && privateKey) {
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
    } else {
        console.warn("Firebase Admin SDK environment variables are not set. Server-side Firebase services will not be available.");
    }

  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
} else {
    // If the app is already initialized, get the instances
    const app = admin.app();
    db = admin.firestore(app);
    auth = admin.auth(app);
}


export { auth, db };
