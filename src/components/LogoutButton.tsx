'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

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
      Logout
    </Button>
  );
}
