
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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


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
    const unsubscribe = onAuthStateChanged(clientAuth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // To get the custom claims, we need to force a token refresh.
        await firebaseUser.getIdToken(true);
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const userRole = idTokenResult.claims.role === 'admin' ? 'admin' : 'customer';

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
    await signInWithEmailAndPassword(clientAuth, email, pass);
    // onAuthStateChanged will handle setting the user
  };

  const signUp = async (email: string, pass: string) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(clientAuth, email, pass);
    const newUser = userCredential.user;
    // We set the user role via a server-side action or cloud function
    // For now, let's create the user doc, but custom claims are preferred.
    await setDoc(doc(db, 'users', newUser.uid), {
        email: newUser.email,
        role: 'customer' // All new users are customers by default
    });
    // onAuthStateChanged will handle setting the user, but claims might not be immediately available.
  };

  const signOut = async () => {
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

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
