
'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { getHeroImage, updateHeroImage } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert, Settings, Upload, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [heroImageUrl, setHeroImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!authLoading) {
      if (user?.role === 'admin') {
        setIsAuthorized(true);
        const fetchSettings = async () => {
          setLoading(true);
          try {
            const url = await getHeroImage();
            setHeroImageUrl(url);
          } catch (error) {
            console.error("Failed to fetch settings:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchSettings();
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const handleImageChange = (file: File | null) => {
    if (!file) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append('heroImage', file);

      try {
        const result = await updateHeroImage(formData);
        if (result.success && result.imageUrl) {
          setHeroImageUrl(result.imageUrl);
          toast({
            title: 'Амжилттай',
            description: 'Нүүр хуудасны зураг шинэчлэгдлээ.',
          });
        } else {
          throw new Error(result.message || 'Зураг шинэчлэхэд алдаа гарлаа.');
        }
      } catch (error: any) {
        console.error("Failed to update hero image:", error);
        toast({
          variant: 'destructive',
          title: 'Алдаа',
          description: error.message || 'Зураг шинэчлэхэд алдаа гарлаа.',
        });
      }
    });
  };

  if (authLoading || (loading && isAuthorized)) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
          <CardContent><Skeleton className="h-48 w-full" /></CardContent>
          <CardFooter><Skeleton className="h-10 w-1/3" /></CardFooter>
        </Card>
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
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl font-bold">Сайтын Тохиргоо</h1>
          <p className="text-muted-foreground">Сайтын ерөнхий тохиргоог эндээс удирдна уу.</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Нүүр хуудасны зураг</CardTitle>
          <CardDescription>Нүүр хуудасны гол хэсэгт харагдах зургийг солих.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-md border">
              {heroImageUrl ? (
                <Image
                  src={heroImageUrl}
                  alt="Нүүр хуудасны зураг"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-muted">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Зураг олдсонгүй</p>
                </div>
              )}
            </div>
             <Label htmlFor="hero-image-upload" className="w-full max-w-xs">
                <Button asChild className="w-full cursor-pointer" disabled={isPending}>
                  <div>
                    {isPending ? (
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
                  id="hero-image-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                  disabled={isPending}
                />
              </Label>
        </CardContent>
      </Card>
    </div>
  );
}
