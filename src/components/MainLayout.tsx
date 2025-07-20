'use client';

import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && (
        <header className="flex justify-end p-4 border-b">
          <div className="container mx-auto px-4">
            <div className="flex justify-end">
              <LogoutButton />
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
