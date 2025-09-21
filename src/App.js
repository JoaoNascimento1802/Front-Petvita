// src/App.js

import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppRoutes from './routes/index.js';

// Importa TODOS os headers
import HeaderSemCadastro from './components/Header_sem_cadastro/index.js';
import HeaderComCadastro from './components/Header_com_cadastro/index.js';
import HeaderVet from './components/HeaderVet/HeaderVet.js';
import HeaderAdmin from './components/HeaderAdmin/HeaderAdmin.js';

// NOVO: Componente para controlar o layout (Header + Conteúdo)
// Este componente fica responsável por decidir qual header mostrar.
const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const renderHeader = () => {
    const path = location.pathname;

    // Se a URL começar com /admin, mostra o HeaderAdmin
    if (path.startsWith('/admin')) {
      // O PrivateRoute já garante que o usuário terá a role correta,
      // mas é uma boa prática verificar aqui também.
      return user?.role === 'ADMIN' ? <HeaderAdmin /> : null;
    }

    // Se a URL começar com /vet, mostra o HeaderVet
    if (path.startsWith('/vet')) {
      return user?.role === 'VETERINARY' ? <HeaderVet /> : null;
    }
    
    // Para todas as outras rotas, decide entre o header de usuário logado e deslogado
    return user ? <HeaderComCadastro /> : <HeaderSemCadastro />;
  };

  return (
    <div className="App">
      {renderHeader()}
      <AppRoutes />
      {/* O Footer é renderizado dentro de cada página, o que está correto. */}
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* CORREÇÃO: Usamos o novo componente de layout que contém a lógica do header */}
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;