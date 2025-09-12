'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Utensils, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';
import { CartIcon } from '@/components/cart-icon';
import { BurgerIcon } from './icons';

const navLinks = [
  { href: '/menu', label: 'Меню' },
  { href: '/builder', label: 'Бургер бүтээх' },
  { href: '/orders', label: 'Миний захиалгууд' },
  { href: '/delivery', label: 'Хүргэлт' },
];

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <BurgerIcon className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl">Burger Land</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <div className="flex items-center gap-6">
             <div className="h-6 w-px bg-border" />
             <Link href="/admin/orders" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
                Захиалга
             </Link>
             <Link href="/admin/menu" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
                Меню
             </Link>
             <Link href="/admin/settings" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
                Тохиргоо
             </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <CartIcon />
          <div className="hidden md:block">
            {loading ? (
                <div className="h-10 w-24 animate-pulse rounded-md bg-muted"></div>
            ) : user ? (
              <UserNav />
            ) : (
              <Button asChild>
                <Link href="/auth/login">Нэвтрэх</Link>
              </Button>
            )}
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="mt-8 grid gap-6 text-lg">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  ))}
                  {user?.role === 'admin' && (
                    <div className="border-t pt-6 grid gap-6">
                        <Link href="/admin/orders" className="font-semibold text-primary hover:text-primary/80 flex items-center gap-2">
                            <Menu className="h-5 w-5"/> Захиалгын удирдлага
                        </Link>
                        <Link href="/admin/menu" className="font-semibold text-primary hover:text-primary/80 flex items-center gap-2">
                           <Utensils className="h-5 w-5" /> Меню удирдлага
                        </Link>
                         <Link href="/admin/settings" className="font-semibold text-primary hover:text-primary/80 flex items-center gap-2">
                           <Settings className="h-5 w-5" /> Тохиргоо
                        </Link>
                    </div>
                  )}
                </nav>
                <div className="mt-8">
                 {loading ? (
                    <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
                  ) : user ? (
                    <UserNav />
                  ) : (
                    <Button asChild className="w-full">
                      <Link href="/auth/login">Нэвтрэх</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
