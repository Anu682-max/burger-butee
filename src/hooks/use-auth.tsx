
'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { User } from '@/lib/types';
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let userRole: 'customer' | 'admin' = 'customer';
        if (userDoc.exists() && userDoc.data().role === 'admin') {
            userRole = 'admin';
        }

        const userWithRole: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: userRole,
        };
        setUser(userWithRole);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged will handle setting the user
  };

  const signUp = async (email: string, pass: string) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;
    // Create a new document in Firestore for the new user
    await setDoc(doc(db, 'users', newUser.uid), {
        email: newUser.email,
        role: 'customer'
    });
    // onAuthStateChanged will handle setting the user
  };

  const signOut = async () => {
    setLoading(true);
    await firebaseSignOut(auth);
    setUser(null);
    setLoading(false);
  };

  const value = useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
