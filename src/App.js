import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppRoutes from './routes/index.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importa TODOS os headers
import HeaderSemCadastro from './components/Header_sem_cadastro/index.js';
import HeaderComCadastro from './components/Header_com_cadastro/index.js';
import HeaderVet from './components/HeaderVet/HeaderVet.js';
import HeaderAdmin from './components/HeaderAdmin/HeaderAdmin.js';
import HeaderEmployee from './components/HeaderEmployee/index.js'; // NOVO: Import do Header do Funcionário

const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const renderHeader = () => {
    const path = location.pathname;

    if (path.startsWith('/admin')) {
      return user?.role === 'ADMIN' ? <HeaderAdmin /> : null;
    }

    if (path.startsWith('/vet')) {
      return user?.role === 'VETERINARY' ? <HeaderVet /> : null;
    }

    // NOVO: Renderiza o header do funcionário para as rotas /employee
    if (path.startsWith('/employee')) {
      return user?.role === 'EMPLOYEE' ? <HeaderEmployee /> : null;
    }
    
    // Para todas as outras rotas, decide entre o header de usuário logado e deslogado
    return user ? <HeaderComCadastro /> : <HeaderSemCadastro />;
  };

  return (
    <div className="App">
      {renderHeader()}
      {/* O conteúdo das rotas é renderizado pelo AppRoutes */}
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
