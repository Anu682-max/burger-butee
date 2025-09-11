
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ChefHat } from 'lucide-react';
import { getMenuBurgers } from '@/lib/menu-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { recommendBurgers } from '@/app/actions';
import { AddToCartButton } from '@/components/add-to-cart-button';

async function RecommendedBurgers() {
  const recommendations = await recommendBurgers();

  if (!recommendations || recommendations.length === 0) {
    return (
        <div className="text-center text-muted-foreground">
            <p>Танд тохирох санал одоогоор олдсонгүй. Захиалга хийсний дараа энд дахин шалгана уу.</p>
        </div>
    );
  }

  const allBurgers = getMenuBurgers();
  const recommendedBurgers = allBurgers.filter(burger => recommendations.includes(burger.name));

  if (recommendedBurgers.length === 0) {
    return (
        <div className="text-center text-muted-foreground">
            <p>Санал болгосон бургер одоогоор менюнд байхгүй байна.</p>
        </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recommendedBurgers.map((burger) => {
        const placeholder = PlaceHolderImages.find(p => p.id === burger.imgId);
        const imageUrl = placeholder?.imageUrl || `https://picsum.photos/seed/${burger.id}/400/300`;
        const imageHint = placeholder?.imageHint || 'burger photo';

        return (
          <Card key={burger.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full overflow-hidden">
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
  );
}

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-burger');

  return (
    <div className="flex flex-col">
      <section className="relative flex h-[60vh] w-full items-center justify-center bg-gray-800 text-white md:h-[70vh]">
        <Image
          src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/1200/800"}
          alt="Delicious Burger"
          fill
          className="object-cover opacity-40"
          priority
          data-ai-hint={heroImage?.imageHint || "gourmet burger"}
        />
        <div className="relative z-10 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Burger Land
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200 md:text-xl">
            Өөрийнхөө хүссэн <span className="font-bold text-primary">БУРГЕРЫГ</span> бүтээ!
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/menu">Меню үзэх</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/builder">Бургер бүтээх <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              <ChefHat className="mr-4 inline-block h-10 w-10 text-primary" />
              Танд зориулсан санал
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Бидний хиймэл оюун таны өмнөх захиалга дээр үндэслэн санал болгож байна.
            </p>
          </div>
          <RecommendedBurgers />
        </div>
      </section>
    </div>
  );
}
