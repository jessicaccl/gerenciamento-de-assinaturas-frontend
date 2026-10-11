import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Planos } from '../pages/Planos';
import { Dashboard } from '../pages/Dashboard';
import { Usuarios } from '../pages/Usuarios';
import { Assinaturas } from '../pages/Assinaturas';
import { Perfil } from '../pages/Perfil';

// Sem token salvo, qualquer rota interna volta para o login
function RotaPrivada({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('user_token');
  return token ? children : <Navigate to="/" replace />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/home" element={<RotaPrivada><Dashboard /></RotaPrivada>} />

        <Route path="/planos" element={<RotaPrivada><Planos /></RotaPrivada>} />

        <Route path="/usuarios" element={<RotaPrivada><Usuarios /></RotaPrivada>} />

        <Route path="/assinaturas" element={<RotaPrivada><Assinaturas /></RotaPrivada>} />

        <Route path="/perfil" element={<RotaPrivada><Perfil /></RotaPrivada>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
