
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '/#services', label: 'Services' },
  { href: '/jobs', label: 'Find Jobs' },
  { href: '/#about', label: 'About Us' },
];

interface HeaderProps {
  variant?: 'default' | 'transparent';
}

const Header = ({ variant = 'default' }: HeaderProps) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const headerClasses = cn(
    "fixed top-0 z-50 w-full transition-colors duration-300",
    {
      'bg-transparent text-white': variant === 'transparent',
      'bg-background/95 border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground': variant === 'default',
    }
  );
  
  const linkClasses = cn(
    "transition-colors font-medium",
    {
      'text-white/80 hover:text-white': variant === 'transparent',
      'text-foreground/60 hover:text-foreground/80': variant === 'default',
    }
  );

  return (
    <header className={headerClasses}>
      <div className="container flex h-20 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-6">
          <Image src="https://github.com/akm12109/zensolve-assets/blob/main/Logo%20Zensolve.jpg?raw=true" alt="Zensolve Logo" width={32} height={32} className="rounded-md" />
          <span>Zensolve</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClasses}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
           <Button variant="ghost" onClick={() => router.push('/join-membership')} className={cn("hidden md:flex rounded-lg", linkClasses)}>Join Membership</Button>
           <Button variant="ghost" onClick={() => router.push('/employee/login')} className={cn(
             "hidden md:flex rounded-lg", 
             linkClasses
           )}>Employee Login</Button>
           <Separator orientation="vertical" className={cn("h-6 hidden md:block", {'bg-white/30': variant === 'transparent'})} />
           <Button onClick={() => router.push('/login')} className={cn(
             "hidden md:flex rounded-lg",
             {'bg-white text-primary hover:bg-white/90 border-none': variant === 'transparent'}
           )}>Login / Sign Up</Button>

           <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-background text-foreground">
                <div className="p-4">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-8" onClick={() => setMenuOpen(false)}>
                        <Image src="https://github.com/akm12109/zensolve-assets/blob/main/Logo%20Zensolve.jpg?raw=true" alt="Zensolve Logo" width={32} height={32} className="rounded-md" />
                        <span>Zensolve</span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                    {NAV_LINKS.map((link) => (
                        <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                        >
                         {link.label}
                        </Link>
                    ))}
                    </nav>
                    <div className="mt-8 border-t pt-6 flex flex-col gap-4">
                        <Button className="w-full" onClick={() => { router.push('/login'); setMenuOpen(false); }}>Login / Sign Up</Button>
                        <Button variant="outline" className="w-full" onClick={() => { router.push('/employee/login'); setMenuOpen(false); }}>Employee Login</Button>
                        <Button variant="secondary" className="w-full" onClick={() => { router.push('/join-membership'); setMenuOpen(false); }}>Join Membership</Button>
                    </div>
                </div>
                </SheetContent>
            </Sheet>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
