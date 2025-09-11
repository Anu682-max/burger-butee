
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Clock, MapPin } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <div className="container mx-auto p-4 py-8 md:p-8">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          <Truck className="mr-4 inline-block h-12 w-12 text-primary" />
          Хүргэлтийн мэдээлэл
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Таны халуун, шүүслэг бургерийг хурдан шуурхай хүргэнэ.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mt-4">Хүргэлтийн бүс</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Бид Улаанбаатар хотын дараах дүүргүүдэд хүргэлт хийж байна:</p>
            <ul className="mt-4 list-inside list-disc text-left">
              <li>Баянгол дүүрэг</li>
              <li>Баянзүрх дүүрэг</li>
              <li>Сүхбаатар дүүрэг</li>
              <li>Чингэлтэй дүүрэг</li>
              <li>Хан-Уул дүүрэг</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mt-4">Хүргэлтийн хугацаа</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Захиалга хийгдсэнээс хойш дунджаар <strong>45-60 минут</strong>-д багтаан хүргэнэ.</p>
            <p className="mt-2 text-sm text-muted-foreground">Замын хөдөлгөөний ачаалал болон бусад нөхцөл байдлаас шалтгаалан хугацаа өөрчлөгдөж болно.</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mt-4">Хүргэлтийн төлбөр</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">5,000₮</p>
            <p className="mt-2">Бүс харгалзахгүй нэг үнээр хүргэнэ.</p>
            <p className="mt-4 font-semibold text-accent">100,000₮-с дээш захиалгад хүргэлт үнэгүй!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
