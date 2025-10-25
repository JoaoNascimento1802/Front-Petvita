import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const VetConsultasNav = () => {
  const location = useLocation();
  // Determina a aba ativa com base no path ou no search param
  const activeTab = location.pathname.includes('/schedule') ? 'calendario' : new URLSearchParams(location.search).get('tab') || 'pedidos';

  return (
    <div className="status-section">
      <div className="status-buttons">
        <Link 
          to="/vet/consultas?tab=pedidos" 
          className={`status-button ${activeTab === 'pedidos' ? 'active' : ''}`}
        >
          Novos Pedidos
        </Link>
        <Link 
          to="/vet/consultas?tab=agendadas" 
          className={`status-button ${activeTab === 'agendadas' ? 'active' : ''}`}
        >
          Agendadas
        </Link>
        <Link 
          to="/vet/consultas?tab=historico" 
          className={`status-button ${activeTab === 'historico' ? 'active' : ''}`}
        >
          Histórico
        </Link>
        {/* CORREÇÃO: Link agora aponta para a rota /vet/schedule */}
        <Link 
          to="/vet/schedule" 
          className={`status-button ${activeTab === 'calendario' ? 'active' : ''}`}
        >
          Agenda
        </Link>
      </div>
    </div>
  );
};

export default VetConsultasNav;