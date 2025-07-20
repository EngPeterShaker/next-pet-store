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
          <LogoutButton />
        </header>
      )}
      {children}
    </>
  );
}
