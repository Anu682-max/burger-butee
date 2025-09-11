
import Image from 'next/image';
import { getMenuBurgers } from '@/lib/menu-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { Utensils } from 'lucide-react';

export default function MenuPage() {
  const burgers = getMenuBurgers();

  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          <Utensils className="mr-4 inline-block h-12 w-12 text-primary" />
          Бидний Меню
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Туршлагатай тогоочийн гарын жороор бүтсэн амтат бургерууд.
        </p>
      </header>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {burgers.map(burger => {
          const placeholder = PlaceHolderImages.find(p => p.id === burger.imgId);
          const imageUrl = placeholder?.imageUrl || `https://picsum.photos/seed/${burger.id}/400/300`;
          const imageHint = placeholder?.imageHint || 'burger photo';

          return (
            <Card key={burger.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader className="p-0">
                <div className="relative h-56 w-full">
                  <Image
                    src={imageUrl}
                    alt={burger.name}
                    fill
                    className="object-cover"
                    data-ai-hint={imageHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <CardTitle>{burger.name}</CardTitle>
                <CardDescription className="mt-2 text-lg font-bold text-primary">
                  {burger.price.toLocaleString('mn-MN')}₮
                </CardDescription>
              </CardContent>
              <CardFooter className="p-4">
                <AddToCartButton burger={burger} imageUrl={imageUrl} />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
