
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import type { Burger } from '@/lib/types';
import { getMenuBurgers, updateBurger } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert, Utensils, Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminMenuPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [burgers, setBurgers] = useState<Burger[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (user?.role === 'admin') {
        setIsAuthorized(true);
        const fetchBurgers = async () => {
          setLoading(true);
          try {
            const fetchedBurgers = await getMenuBurgers();
            setBurgers(fetchedBurgers);
          } catch (error) {
            console.error("Failed to fetch burgers:", error);
            toast({
              variant: 'destructive',
              title: 'Алдаа',
              description: 'Меню татахад алдаа гарлаа.',
            });
          } finally {
            setLoading(false);
          }
        };
        fetchBurgers();
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    }
  }, [user, authLoading, toast]);

  const handleImageChange = async (burgerId: string, file: File | null) => {
    if (!file) return;

    setUploadingId(burgerId);

    const formData = new FormData();
    formData.append('burgerId', burgerId);
    formData.append('image', file);

    try {
      const result = await updateBurger(formData);
      if (result.success && result.updatedBurger) {
        setBurgers(prev => prev.map(b => b.id === burgerId ? result.updatedBurger! : b));
        toast({
          title: 'Амжилттай',
          description: `${result.updatedBurger.name}-н зураг шинэчлэгдлээ.`,
        });
      } else {
        throw new Error(result.message || 'Зураг шинэчлэхэд алдаа гарлаа.');
      }
    } catch (error: any) {
      console.error("Failed to update burger image:", error);
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: error.message || 'Зураг шинэчлэхэд алдаа гарлаа.',
      });
    } finally {
      setUploadingId(null);
    }
  };

  if (authLoading || (loading && isAuthorized)) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-48 w-full" /></CardHeader>
              <CardContent><Skeleton className="h-6 w-3/4" /></CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h1 className="mt-4 font-headline text-3xl font-bold">Хандах эрхгүй</h1>
        <p className="mt-2 text-muted-foreground">Та админ хуудас руу хандах эрхгүй байна.</p>
        <Button onClick={() => router.push('/')} className="mt-6">Нүүр хуудас руу буцах</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <Utensils className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold">Меню Удирдлага</h1>
          <p className="text-muted-foreground">Бургеруудын зургийг эндээс шинэчилнэ үү.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {burgers.map(burger => (
          <Card key={burger.id} className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-56 w-full">
                <Image
                  src={burger.imageUrl || `https://picsum.photos/seed/${burger.id}/400/300`}
                  alt={burger.name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <CardTitle>{burger.name}</CardTitle>
            </CardContent>
            <CardFooter className="p-4">
              <Label htmlFor={`upload-${burger.id}`} className="w-full">
                <Button asChild className="w-full cursor-pointer" disabled={uploadingId === burger.id}>
                  <div>
                    {uploadingId === burger.id ? (
                      'Байршуулж байна...'
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Зураг солих
                      </>
                    )}
                  </div>
                </Button>
                <Input 
                  id={`upload-${burger.id}`}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => handleImageChange(burger.id, e.target.files?.[0] || null)}
                  disabled={uploadingId === burger.id}
                />
              </Label>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
