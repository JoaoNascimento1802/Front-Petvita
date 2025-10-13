import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/Header/LogoPet_vita(Atualizado).png';
import profileIcon from '../../assets/images/Header/perfilIcon.png'; // Ícone padrão como fallback
import { BsChatDots, BsBellFill } from 'react-icons/bs';
import './css/Header.css';

const HeaderVet = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // ===== ALTERAÇÃO 1: Obter o usuário completo do contexto =====
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <NavLink to="/vet/dashboard"><img src={logo} alt="Pet Vita Logo" /></NavLink>
      </div>
      
      <nav className="nav nav-center">
        <NavLink to="/vet/dashboard" className="nav_link">Home</NavLink>
        <NavLink to="/vet/consultas" className="nav_link">Consultas</NavLink>
        <NavLink to="/vet/relatorios" className="nav_link">Relatórios</NavLink>
        <NavLink to="/vet/schedule" className="nav_link">Agenda</NavLink>
      </nav>

      <div className="icons-container">
        <NavLink to="/vet/chat" className="header-icon">
            <BsChatDots size={26} />
        </NavLink>
        
        <div className="notification-icon-wrapper">
            <div 
                className="header-icon notification-icon" 
                onClick={() => setShowNotifications(!showNotifications)}
            >
                <BsBellFill size={26} />
                <span className="notification-badge">3</span>
            </div>
            {/* O dropdown de notificações continuaria aqui */}
        </div>
        
        <div className="profile-icon-container">
          <div className="profile-icon" onClick={() => setShowDropdown(!showDropdown)}>
            {/* ===== ALTERAÇÃO 2: Usar a imagem do usuário ou o ícone padrão ===== */}
            <img 
              src={user?.imageurl || profileIcon} 
              alt="Perfil"
              onError={(e) => { e.target.onerror = null; e.target.src = profileIcon; }} // Fallback se a URL da imagem quebrar
            />
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <NavLink to="/vet/perfil" className="dropdown-item">Meu Perfil</NavLink>
              <button onClick={handleLogout} className="dropdown-item" style={{border: 'none', width: '100%', textAlign: 'left', background: 'none', cursor: 'pointer'}}>Sair</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderVet;