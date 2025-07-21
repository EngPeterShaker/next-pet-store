'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export default function LogoutButton() {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('token'); 
    // Clear user data
    setUser(null);
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
