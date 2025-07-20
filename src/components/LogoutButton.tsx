'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication token (dummy example)
    localStorage.removeItem('authToken'); 
    // Redirect to login page
    router.push('/login');
  };

  return (
    <Button onClick={handleLogout} variant="outline" size="sm">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
