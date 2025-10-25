import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppRoutes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 1. Importe TODOS os seus componentes de header
import HeaderSemCadastro from './components/Header_sem_cadastro';
import HeaderComCadastro from './components/Header_com_cadastro';
import HeaderAdmin from './components/HeaderAdmin/HeaderAdmin';
import HeaderVet from './components/HeaderVet/HeaderVet';
import HeaderEmployee from './components/HeaderEmployee';

// 2. Crie um componente controlador para escolher o header correto
const HeaderController = () => {
    const { user, loading } = useAuth();

    // Enquanto o estado de autenticação está carregando, não mostre nenhum header
    if (loading) {
        return null;
    }

    // Se não houver usuário, mostre o header de visitante
    if (!user) {
        return <HeaderSemCadastro />;
    }

    // Use um switch para renderizar o header correto com base na role do usuário
    switch (user.role) {
        case 'ADMIN':
            return <HeaderAdmin />;
        case 'VETERINARY':
            return <HeaderVet />;
        case 'EMPLOYEE':
            return <HeaderEmployee />;
        case 'USER':
        default:
            return <HeaderComCadastro />;
    }
};

// 3. Estruture o App para usar o HeaderController de forma centralizada
function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer autoClose={3000} hideProgressBar={false} position="top-right" />
        {/* O HeaderController agora gerencia qual header é exibido para toda a aplicação */}
        <HeaderController />
        {/* Adiciona um padding global para o conteúdo não ficar atrás do header fixo */}
        <div style={{ paddingTop: '90px' }}> 
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;