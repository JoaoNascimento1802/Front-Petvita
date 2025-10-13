import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './css/styles.css';
import logo from '../../assets/images/Header/LogoPet_vita(Atualizado).png';
import { toast } from 'react-toastify';

const ModalUser = ({ onClose, switchToVet, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ADICIONADO: Estado para o checkbox "Lembrar-me"
  const [rememberMe, setRememberMe] = useState(true); 
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ALTERADO: Passando o estado de rememberMe para a função de login
      const loggedInUser = await login(email, password, rememberMe);
      onClose();
      
      toast.success(`Bem-vindo(a) de volta, ${loggedInUser.username}!`);

      switch(loggedInUser.role) {
        case 'ADMIN': navigate('/admin/dashboard'); break;
        case 'VETERINARY': navigate('/vet/dashboard'); break;
        case 'USER': navigate('/'); break;
        default: navigate('/');
      }
    } catch (err) {
      toast.error('E-mail ou senha inválidos. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
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
              {/* ALTERADO: Checkbox funcional */}
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <div className="forgot-password">
              <button type="button" className="link-button" onClick={onSwitchToForgotPassword}>
                Esqueci a Senha
              </button>
            </div>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="links">
          <button type="button" className="link-button" onClick={onClose}>Voltar</button>
          <button type="button" className="link-button" onClick={onSwitchToRegister}>
            Cadastrar-se
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUser;