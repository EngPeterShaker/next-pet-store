'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const { user } = useUser();

  return (
    <>
      {!isLoginPage && (
        <header className="sticky top-0 z-50 p-4 border-b bg-white dark:bg-gray-900 backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:supports-[backdrop-filter]:bg-gray-900/95">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </Button>
              <div className="flex items-center gap-4">
                {user && (
                  <Badge variant="secondary" className="px-3 py-1.5 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                  </Badge>
                )}
                <LogoutButton />
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="content-wrapper">
        {children}
      </main>
    </>
  );
}
