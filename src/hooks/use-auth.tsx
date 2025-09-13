
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
import { auth as clientAuth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserData } from '@/app/actions';


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
    if (!clientAuth) {
      console.warn('Firebase auth not available');
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(clientAuth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Fetch role from server action
        const userData = await getUserData(firebaseUser.uid);
        
        const userWithRole: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: userData?.role || 'customer',
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
    if (!clientAuth) {
      throw new Error('Firebase auth not available');
    }
    setLoading(true);
    await signInWithEmailAndPassword(clientAuth, email, pass);
    // onAuthStateChanged will handle setting the user
  };

  const signUp = async (email: string, pass: string) => {
    if (!clientAuth || !db) {
      throw new Error('Firebase services not available');
    }
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(clientAuth, email, pass);
    const newUser = userCredential.user;
    
    // Create a user document in Firestore with the default role
    // Custom claims are preferred for production for better security
    await setDoc(doc(db, 'users', newUser.uid), {
        email: newUser.email,
        role: 'customer' // All new users are customers by default
    });
    // onAuthStateChanged will handle setting the user.
  };

  const signOut = async () => {
    if (!clientAuth) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    await firebaseSignOut(clientAuth);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
