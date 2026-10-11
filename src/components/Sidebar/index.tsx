import { useState, useEffect } from 'react';
import SidebarDesktop from './Desktop';
import SidebarMobile from './Mobile';

import AuthService, { type UsuarioLogado } from '../../services/AuthService';

export function Sidebar() {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const [user, setUser] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await AuthService.getMe();
        setUser(userData);
      } catch (error) {
        console.error("Erro ao carregar usuário na Sidebar:", error);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    window.location.href = '/';
  };

  if (windowSize >= 992) {
    return (
      <SidebarDesktop
        logOut={handleLogout}
        windowSize={windowSize}
        user={user}
      />
    );
  }

  return (
    <SidebarMobile
      logOut={handleLogout}
      user={user}
    />
  );
}