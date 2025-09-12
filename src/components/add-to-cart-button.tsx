
'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import type { Burger } from '@/lib/types';
import { getIngredients } from '@/lib/menu-data';
import { ShoppingCart } from 'lucide-react';

const allIngredients = getIngredients();

type AddToCartButtonProps = {
  burger: Burger;
};

export function AddToCartButton({ burger }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const burgerIngredients = burger.ingredients
      .map(id => allIngredients.find(ing => ing.id === id))
      .filter((ing): ing is NonNullable<typeof ing> => ing != null);

    const cartItem = {
      id: burger.id,
      name: burger.name,
      price: burger.price,
      quantity: 1,
      image: burger.imageUrl,
      ingredients: burgerIngredients,
    };
    addToCart(cartItem);
    toast({
      title: 'Сагсанд нэмэгдлээ',
      description: `${burger.name} таны сагсанд орлоо.`,
    });
  };

  return (
    <Button onClick={handleAddToCart} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      <ShoppingCart className="mr-2 h-4 w-4" /> Сагсанд нэмэх
    </Button>
  );
}
