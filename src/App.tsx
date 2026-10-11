import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { AppRoutes } from "./routes"; 

import { AcessibilidadeProvider } from './components/Acessibilidade/Context';
import { Acessibilidade } from './components/Acessibilidade';

export function App() {
  return (   
    <AcessibilidadeProvider>
      
      <Acessibilidade />

      <AppRoutes />
      
      <ToastContainer autoClose={3000} theme="colored" />
    </AcessibilidadeProvider>
  );
}