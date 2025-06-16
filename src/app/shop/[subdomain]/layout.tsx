import { ReactNode } from 'react';

interface ShopLayoutProps {
  children: ReactNode;
  params: {
    subdomain: string;
  };
}

export default function ShopLayout({ children, params }: ShopLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">{params.subdomain}</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="#" className="text-sm hover:underline">Shop</a>
              <a href="#" className="text-sm hover:underline">About</a>
              <a href="#" className="text-sm hover:underline">Contact</a>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 {params.subdomain}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}