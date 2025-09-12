import type { Burger, Ingredient } from '@/lib/types';
import { Beef, DollarSign } from 'lucide-react';
import { BunIcon, LettuceIcon, OnionIcon, PicklesIcon, SauceIcon, TomatoIcon } from '@/components/icons';

// --- INGREDIENTS ---
export const ingredients: Ingredient[] = [
  { id: 'bun-classic', name: 'Сонгодог булочка', category: 'bun', price: 1000, icon: BunIcon },
  { id: 'bun-sesame', name: 'Гүнждийн үртэй булочка', category: 'bun', price: 1200, icon: BunIcon },
  { id: 'patty-beef', name: 'Үхрийн мах', category: 'patty', price: 4000, icon: Beef },
  { id: 'patty-chicken', name: 'Тахианы мах', category: 'patty', price: 3500, icon: Beef },
  { id: 'cheese-cheddar', name: 'Чеддар бяслаг', category: 'cheese', price: 1500, icon: DollarSign },
  { id: 'cheese-swiss', name: 'Швейцарь бяслаг', category: 'cheese', price: 1800, icon: DollarSign },
  { id: 'topping-lettuce', name: 'Салатын навч', category: 'topping', price: 500, icon: LettuceIcon },
  { id: 'topping-tomato', name: 'Улаан лооль', category: 'topping', price: 500, icon: TomatoIcon },
  { id: 'topping-onion', name: 'Сонгино', category: 'topping', price: 300, icon: OnionIcon },
  { id: 'topping-pickles', name: 'Даршилсан өргөст хэмх', category: 'topping', price: 700, icon: PicklesIcon },
  { id: 'sauce-ketchup', name: 'Кетчуп', category: 'sauce', price: 300, icon: SauceIcon },
  { id: 'sauce-mayo', name: 'Майонез', category: 'sauce', price: 300, icon: SauceIcon },
  { id: 'sauce-bbq', name: 'BBQ соус', category: 'sauce', price: 500, icon: SauceIcon },
];

export const getIngredients = () => ingredients;
export const getAvailableIngredients = () => JSON.stringify(ingredients.map(i => i.name));
