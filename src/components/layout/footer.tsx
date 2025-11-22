
"use client";

import Link from 'next/link';
import { ArrowRight, Facebook, Instagram, Youtube, Twitter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const footerLinks = {
  company: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Jobs', href: '/jobs' },
  ],
  documentation: [
    { name: 'Help Centre', href: '#' },
    { name: 'Contact', href: '/#contact' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Privacy Policy', href: '#' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: <Facebook className="w-5 h-5" /> },
    { name: 'Instagram', href: '#', icon: <Instagram className="w-5 h-5" /> },
    { name: 'Youtube', href: '#', icon: <Youtube className="w-5 h-5" /> },
    { name: 'Twitter', href: '#', icon: <Twitter className="w-5 h-5" /> },
  ]
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="icon"
      className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full"
      disabled={pending}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
    </Button>
  );
}

const Footer = () => {
  const [state, formAction] = useActionState(subscribeToNewsletter, { success: false, message: ""});
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Success!",
          description: state.message,
        });
        formRef.current?.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Image src="https://github.com/akm12109/zensolve-assets/blob/main/Logo%20Zensolve.jpg?raw=true" alt="Zensolve Logo" width={36} height={36} className="rounded-md" />
              <span>Zensolve</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Stay in the loop and sign up for the Zensolve newsletter:
            </p>
            <form action={formAction} ref={formRef} className="relative max-w-sm">
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="h-12 pr-14"
                required
              />
              <SubmitButton />
            </form>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-8 col-span-2">
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Documentation</h4>
              <ul className="space-y-3">
                {footerLinks.documentation.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-muted-foreground mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Zensolve Inc. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex space-x-4">
                {footerLinks.social.map((link) => (
                  <Link key={link.name} href={link.href} className="text-muted-foreground hover:text-primary">
                    {link.icon}
                  </Link>
                ))}
            </div>
             <Link href="#" className="text-muted-foreground hover:text-primary">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

    