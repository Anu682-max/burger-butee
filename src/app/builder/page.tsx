
'use client';

import { useState, useMemo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getIngredients } from '@/lib/menu-data';
import type { Ingredient, IngredientCategory } from '@/lib/types';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Sandwich, ShoppingCart } from 'lucide-react';

const ingredientData = getIngredients();

const categories: { id: IngredientCategory; name: string; type: 'single' | 'multiple' }[] = [
  { id: 'bun', name: 'Булка', type: 'single' },
  { id: 'patty', name: 'Мах', type: 'multiple' },
  { id: 'cheese', name: 'Бяслаг', type: 'multiple' },
  { id: 'topping', name: 'Нэмэлт Хачир', type: 'multiple' },
  { id: 'sauce', name: 'Соус', type: 'multiple' },
];

export default function BurgerBuilderPage() {
  const [selectedIngredients, setSelectedIngredients] = useState<Record<string, Ingredient>>(
    // Start with a default bun
    ingredientData.filter(i => i.id === 'bun-classic').reduce((acc, i) => ({ ...acc, [i.id]: i }), {})
  );

  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleSingleSelect = (category: IngredientCategory, ingredient: Ingredient) => {
    setSelectedIngredients(prev => {
      const newSelections = { ...prev };
      // Remove all other items from the same category
      Object.values(newSelections).forEach(ing => {
        if (ing.category === category) {
          delete newSelections[ing.id];
        }
      });
      newSelections[ingredient.id] = ingredient;
      return newSelections;
    });
  };

  const handleMultiSelect = (ingredient: Ingredient) => {
    setSelectedIngredients(prev => {
      const newSelections = { ...prev };
      if (newSelections[ingredient.id]) {
        delete newSelections[ingredient.id];
      } else {
        newSelections[ingredient.id] = ingredient;
      }
      return newSelections;
    });
  };

  const totalPrice = useMemo(() => {
    return Object.values(selectedIngredients).reduce((sum, ing) => sum + ing.price, 0);
  }, [selectedIngredients]);

  const handleAddToCart = () => {
    const ingredientsArray = Object.values(selectedIngredients);
    if (ingredientsArray.length === 0) {
      toast({ variant: 'destructive', title: 'Орц сонгоогүй байна', description: 'Бургер бүтээхийн тулд ядаж нэг орц сонгоно уу.' });
      return;
    }

    const customBurger = {
      id: `custom-${Date.now()}`,
      name: 'Өөрийн бүтээсэн бургер',
      price: totalPrice,
      quantity: 1,
      image: 'https://picsum.photos/seed/custom/400/300', // Placeholder for custom burger
      ingredients: ingredientsArray,
    };
    addToCart(customBurger);
    toast({
      title: 'Сагсанд нэмэгдлээ',
      description: 'Таны бүтээсэн бургер сагсанд нэмэгдлээ.',
    });
  };

  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          <Sandwich className="mr-4 inline-block h-12 w-12 text-primary" />
          Бургер бүтээгч
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Өөрийнхөө дуртай орцуудаар мөрөөдлийн бургераа бүтээ.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Accordion type="multiple" defaultValue={categories.map(c => c.id)} className="w-full rounded-lg border bg-card p-4 shadow-sm">
            {categories.map(category => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="text-xl font-semibold">{category.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                    {ingredientData.filter(i => i.category === category.id).map(ingredient => (
                      <div key={ingredient.id} className="flex items-center space-x-3 rounded-md border p-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                        {category.type === 'single' ? (
                          <RadioGroup
                            onValueChange={() => handleSingleSelect(category.id, ingredient)}
                            value={Object.values(selectedIngredients).find(i => i.category === category.id)?.id}
                            className="flex items-center"
                          >
                            <RadioGroupItem value={ingredient.id} id={ingredient.id} />
                          </RadioGroup>
                        ) : (
                          <Checkbox
                            id={ingredient.id}
                            checked={!!selectedIngredients[ingredient.id]}
                            onCheckedChange={() => handleMultiSelect(ingredient)}
                          />
                        )}
                        <Label htmlFor={ingredient.id} className="flex flex-grow cursor-pointer items-center justify-between text-base">
                          <div className="flex items-center gap-2">
                            <ingredient.icon className="h-5 w-5 text-muted-foreground" />
                            <span>{ingredient.name}</span>
                          </div>
                          <span className="font-bold text-primary">{ingredient.price.toLocaleString('mn-MN')}₮</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-24 rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 font-headline text-2xl font-bold">Таны бургер</h2>
            <div className="min-h-[200px] space-y-2">
              {Object.values(selectedIngredients).length > 0 ? (
                Object.values(selectedIngredients).map(ing => (
                  <div key={ing.id} className="flex justify-between">
                    <span>{ing.name}</span>
                    <span>{ing.price.toLocaleString('mn-MN')}₮</span>
                  </div>
                ))
              ) : (
                <p className="py-16 text-center text-muted-foreground">Орцоо сонгоно уу...</p>
              )}
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-xl font-bold">
              <span>Нийт:</span>
              <span>{totalPrice.toLocaleString('mn-MN')}₮</span>
            </div>
            <Button size="lg" className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Сагсанд нэмэх
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
