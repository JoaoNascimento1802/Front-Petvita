import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './css/styles.css';
import logo from '../../assets/images/Header/LogoPet_vita(Atualizado).png';

const ModalVet = ({ onClose, switchToUser, onSwitchToRegister }) => {
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
      if (loggedInUser.role === 'VETERINARY') {
        navigate('/vet/dashboard');
      } else {
        // Se um não-vet tentar logar aqui, redireciona para a home
        navigate('/');
      }
    } catch (err) {
      setError('Credenciais inválidas. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal active">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <div className="button-group">
          <button className="button" onClick={switchToUser}>Cliente</button>
          <button className="button active">Veterinário</button>
        </div>
        <div className="logo-modal">
          <img src={logo} alt="Pet Vita Logo" />
        </div>
        <form className="form" onSubmit={handleLogin}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <label htmlFor="email-vet">Email</label>
            <input type="email" id="email-vet" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="senha-vet">Senha</label>
            <input type="password" id="senha-vet" required value={password} onChange={(e) => setPassword(e.target.value)} />
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

export default ModalVet;