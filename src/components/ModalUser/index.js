import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './css/styles.css';
import logo from '../../assets/images/Header/LogoPet_vita(Atualizado).png';

// Recebe a nova prop 'onSwitchToRegister'
const ModalUser = ({ onClose, switchToVet, onSwitchToRegister }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      onClose();

      switch(loggedInUser.role) {
        case 'ADMIN': navigate('/admin/dashboard'); break;
        case 'VETERINARY': navigate('/vet/dashboard'); break;
        case 'USER': navigate('/'); break;
        default: navigate('/');
      }

    } catch (err) {
      setError('E-mail ou senha inválidos. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ===== ALTERAÇÃO 1: onClick removido daqui =====
    <div className="modal active">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <div className="button-group">
          <button className="button active">Cliente</button>
          <button className="button" onClick={switchToVet}>Veterinário</button>
        </div>
        <div className="logo-modal">
          <img src={logo} alt="Pet Vita Logo" />
        </div>
        <form className="form" onSubmit={handleLogin}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <label htmlFor="email-user">Email</label>
            <input 
              type="email" 
              id="email-user" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="input-group">
            <label htmlFor="senha-user">Senha</label>
            <input 
              type="password" 
              id="senha-user" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <div className="options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Lembrar minha senha</label>
            </div>
            <div className="forgot-password">
              <a href="#">Esqueci a Senha</a>
            </div>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="links">
          <button type="button" className="link-button" onClick={onClose}>Voltar</button>
          {/* ===== ALTERAÇÃO 2: Botão "Cadastrar-se" agora funcional ===== */}
          <button type="button" className="link-button" onClick={onSwitchToRegister}>
            Cadastrar-se
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUser;