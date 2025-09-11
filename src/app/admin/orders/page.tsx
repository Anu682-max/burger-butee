
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getAllOrders } from '@/lib/data';
import type { Order, OrderStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateOrderStatus } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Package, ShieldAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const statusMap: Record<OrderStatus, string> = {
  'Хүлээгдэж буй': 'bg-yellow-500',
  'Бэлтгэгдэж буй': 'bg-orange-500',
  'Хүргэлтэнд гарсан': 'bg-blue-500',
  'Хүргэгдсэн': 'bg-green-500',
  'Цуцлагдсан': 'bg-red-500',
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge className={`${statusMap[status]} text-white hover:${statusMap[status]}`}>{status}</Badge>;
}

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (user && user.role === 'admin') {
        setIsAuthorized(true);
        const fetchOrders = async () => {
            const fetchedOrders = await getAllOrders();
            setOrders(fetchedOrders);
            setLoading(false);
        }
        fetchOrders();
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast({
        title: 'Амжилттай',
        description: `Захиалга #${orderId} төлөв ${newStatus} болж шинэчлэгдлээ.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: result.message,
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h1 className="mt-4 font-headline text-3xl font-bold">Хандах эрхгүй</h1>
        <p className="mt-2 text-muted-foreground">Та админ хуудас руу хандах эрхгүй байна. Та админ эрхтэй хэрэглэгчээр нэвтэрнэ үү.</p>
        <Button onClick={() => router.push('/')} className="mt-6">Нүүр хуудас руу буцах</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-3xl">Захиалгын удирдлага</CardTitle>
              <CardDescription>Бүх хэрэглэгчийн захиалгыг эндээс харна уу.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Захиалгын ID</TableHead>
                  <TableHead>Хэрэглэгч</TableHead>
                  <TableHead>Огноо</TableHead>
                  <TableHead>Нийт дүн</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead>Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.userEmail}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString('mn-MN')}</TableCell>
                    <TableCell>{order.totalPrice.toLocaleString('mn-MN')}₮</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Төлөв солих" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(statusMap).map(status => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
