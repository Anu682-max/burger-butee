
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-headline text-2xl font-bold text-primary">Burger Land</h3>
            <p className="mt-2 text-muted-foreground">Дэлхийн хамгийн амттай бургер.</p>
          </div>
          <div>
            <h4 className="font-semibold">Холбоосууд</h4>
            <ul className="mt-4 space-y-2">
              <li><Link href="/menu" className="text-muted-foreground hover:text-primary">Меню</Link></li>
              <li><Link href="/builder" className="text-muted-foreground hover:text-primary">Бургер бүтээх</Link></li>
              <li><Link href="/delivery" className="text-muted-foreground hover:text-primary">Хүргэлт</Link></li>
              <li><Link href="/orders" className="text-muted-foreground hover:text-primary">Миний захиалгууд</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Бидэнтэй холбогдох</h4>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary"><Facebook /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Twitter /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Instagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Burger Land. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}
