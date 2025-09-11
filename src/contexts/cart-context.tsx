
'use client';

import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import type { CartItem } from '@/lib/types';

interface CartState {
  cart: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

const initialState: CartState = {
  cart: [],
  total: 0,
};

const CartContext = createContext<{
  state: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cart: CartItem[];
  total: number;
}>({
  state: initialState,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cart: [],
  total: 0,
});

function calculateTotal(cart: CartItem[]): number {
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART': {
        const newCart = action.payload;
        return {
            ...state,
            cart: newCart,
            total: calculateTotal(newCart),
        }
    }
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cart.findIndex(item => item.id === action.payload.id);
      let newCart: CartItem[];

      if (existingItemIndex !== -1) {
        newCart = state.cart.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }
      return { ...state, cart: newCart, total: calculateTotal(newCart) };
    }
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.payload.id);
      return { ...state, cart: newCart, total: calculateTotal(newCart) };
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newCart = state.cart.filter(item => item.id !== action.payload.id);
        return { ...state, cart: newCart, total: calculateTotal(newCart) };
      }
      const newCart = state.cart.map(item =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      return { ...state, cart: newCart, total: calculateTotal(newCart) };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [], total: 0 };
    default:
      return state;
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  useEffect(() => {
    try {
        const savedCart = localStorage.getItem('burger-land-cart');
        if (savedCart) {
            dispatch({ type: 'SET_CART', payload: JSON.parse(savedCart) });
        }
    } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('burger-land-cart', JSON.stringify(state.cart));
    } catch(error) {
        console.error("Failed to save cart to localStorage", error);
    }
  }, [state.cart]);

  const addToCart = (item: CartItem) => dispatch({ type: 'ADD_TO_CART', payload: item });
  const removeFromCart = (id: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  const updateQuantity = (id: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, updateQuantity, clearCart, cart: state.cart, total: state.total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
