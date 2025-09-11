
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getUserOrders } from '@/lib/data';
import type { Order, OrderStatus } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const statusMap: Record<OrderStatus, string> = {
  'Хүлээгдэж буй': 'border-yellow-500 text-yellow-500',
  'Бэлтгэгдэж буй': 'border-orange-500 text-orange-500',
  'Хүргэлтэнд гарсан': 'border-blue-500 text-blue-500',
  'Хүргэгдсэн': 'border-green-500 text-green-500',
  'Цуцлагдсан': 'border-red-500 text-red-500',
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant="outline" className={`${statusMap[status]}`}>{status}</Badge>;
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
        if (!authLoading && user) {
            const userOrders = await getUserOrders(user.uid);
            setOrders(userOrders);
            setLoading(false);
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }
    fetchOrders();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-8">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="mt-2 h-4 w-1/2" />
            </div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center">
        <History className="h-20 w-20 text-muted-foreground" />
        <h1 className="mt-6 font-headline text-3xl font-bold">Захиалгын түүхээ харна уу</h1>
        <p className="mt-2 text-muted-foreground">Захиалгын түүхээ харахын тулд нэвтэрнэ үү.</p>
        <Button asChild className="mt-6">
          <Link href="/auth/login">Нэвтрэх</Link>
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center">
        <ShoppingBag className="h-20 w-20 text-muted-foreground" />
        <h1 className="mt-6 font-headline text-3xl font-bold">Танд захиалга байхгүй байна</h1>
        <p className="mt-2 text-muted-foreground">Та одоогоор ямар ч захиалга хийгээгүй байна.</p>
        <Button asChild className="mt-6">
          <Link href="/menu">Одоо захиалах</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
       <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <History className="h-8 w-8 text-primary" />
                <div>
                <CardTitle className="font-headline text-3xl">Миний захиалгууд</CardTitle>
                <CardDescription>Таны өмнөх бүх захиалгын түүх.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
            {orders.map(order => (
                <AccordionItem key={order.id} value={order.id}>
                <AccordionTrigger>
                    <div className="flex w-full items-center justify-between pr-4">
                    <div className="text-left">
                        <p className="font-semibold">Захиалга #{order.id}</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('mn-MN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">{order.totalPrice.toLocaleString('mn-MN')}₮</span>
                        <StatusBadge status={order.status} />
                    </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="p-4">
                        <h4 className="mb-2 font-semibold">Барааны жагсаалт:</h4>
                        <ul className="space-y-2">
                            {order.items.map(item => (
                            <li key={item.id} className="flex justify-between">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{(item.price * item.quantity).toLocaleString('mn-MN')}₮</span>
                            </li>
                            ))}
                        </ul>
                         {order.deliveryAddress && (
                           <div className="mt-4 border-t pt-4">
                            <h4 className="font-semibold">Хүргэлтийн хаяг:</h4>
                            <p className="text-muted-foreground">{order.deliveryAddress}</p>
                           </div>
                         )}
                    </div>
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </CardContent>
       </Card>
    </div>
  );
}
