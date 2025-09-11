
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
// To enable real Firebase authentication, uncomment the following lines:
// import { onAuthStateChanged, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
// import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const mockUser: User = {
  uid: 'mock-user-123',
  email: 'test@example.com',
  displayName: 'Тест Хэрэглэгч',
  role: 'customer',
};
const mockAdmin: User = {
  uid: 'mock-admin-123',
  email: 'admin@example.com',
  displayName: 'Админ',
  role: 'admin',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- MOCK AUTHENTICATION ---
    const storedUser = sessionStorage.getItem('burger-land-user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    /*
    // --- REAL FIREBASE AUTHENTICATION ---
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // In a real app, you would fetch the user's role from your database (e.g., Firestore)
        const userWithRole: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: 'customer', // or 'admin' based on your logic
        };
        setUser(userWithRole);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
    */
  }, []);

  const handleSetUser = (user: User | null) => {
    if (user) {
        sessionStorage.setItem('burger-land-user', JSON.stringify(user));
    } else {
        sessionStorage.removeItem('burger-land-user');
    }
    setUser(user);
    setLoading(false);
  }

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    console.log('Signing in with:', email, pass);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // admin@example.com for admin, any other for customer
    if (email === 'admin@example.com') {
      handleSetUser(mockAdmin);
    } else {
      handleSetUser({...mockUser, email, displayName: email.split('@')[0] });
    }
  };

  const signUp = async (email: string, pass: string) => {
    setLoading(true);
    console.log('Signing up with:', email, pass);
    await new Promise(resolve => setTimeout(resolve, 500));
    handleSetUser({...mockUser, email, displayName: email.split('@')[0] });
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    handleSetUser(null);
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
