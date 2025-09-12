
'use client';

import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { placeOrder } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const DELIVERY_FEE = 5000;

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [address, setAddress] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Нэвтэрнэ үү', description: 'Захиалга хийхийн тулд эхлээд нэвтэрнэ үү.' });
      router.push('/auth/login');
      return;
    }
    if (address.trim() === '') {
      toast({ variant: 'destructive', title: 'Хаяг оруулаагүй байна', description: 'Хүргэлтийн хаягаа оруулна уу.' });
      return;
    }

    setIsPlacingOrder(true);
    const result = await placeOrder(cart, total + DELIVERY_FEE, user.uid, user.email || 'N/A', address);
    setIsPlacingOrder(false);

    if (result.success) {
      toast({ title: 'Захиалга амжилттай', description: 'Таны захиалгыг хүлээн авлаа.' });
      clearCart();
      router.push('/orders');
    } else {
      toast({ variant: 'destructive', title: 'Алдаа', description: result.message });
    }
  };


  if (cart.length === 0) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center">
        <ShoppingCart className="h-20 w-20 text-muted-foreground" />
        <h1 className="mt-6 font-headline text-3xl font-bold">Таны сагс хоосон байна</h1>
        <p className="mt-2 text-muted-foreground">Меню эсвэл бургер бүтээгч хуудаснаас бараа нэмнэ үү.</p>
        <div className="mt-6 flex gap-4">
          <Button asChild>
            <Link href="/menu">Меню үзэх</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/builder">Бургер бүтээх</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
      <h1 className="mb-8 font-headline text-4xl font-bold">Миний сагс</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Сагсан дахь бараанууд ({cart.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image src={item.image} alt={item.name} width={100} height={75} className="rounded-md object-cover" />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.price.toLocaleString('mn-MN')}₮</p>
                      {item.ingredients && (
                         <p className="text-xs text-muted-foreground">{item.ingredients.map(i => i.name).join(', ')}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="w-24 text-right font-semibold">{(item.price * item.quantity).toLocaleString('mn-MN')}₮</p>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Захиалгын мэдээлэл</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Хүргэлтийн хаяг</Label>
                <Input id="address" placeholder="Дүүрэг, хороо, байр, тоот" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="flex justify-between">
                <span>Барааны дүн:</span>
                <span>{total.toLocaleString('mn-MN')}₮</span>
              </div>
              <div className="flex justify-between">
                <span>Хүргэлтийн төлбөр:</span>
                <span>{DELIVERY_FEE.toLocaleString('mn-MN')}₮</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-xl font-bold">
                <span>Нийт дүн:</span>
                <span>{(total + DELIVERY_FEE).toLocaleString('mn-MN')}₮</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                {isPlacingOrder ? 'Захиалж байна...' : 'Захиалга хийх'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
