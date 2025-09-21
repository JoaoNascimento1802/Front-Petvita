import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './css/styles.css';
import logo from '../../assets/images/Header/LogoPet_vita(Atualizado).png';

// O prop 'openLogin' agora será chamado de 'onSwitchToLogin' pelo Header, mas podemos manter o nome aqui
const ModalRegisterUser = ({ onClose, switchToVet, openLogin }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '', email: '', password: '', phone: '',
    address: '', rg: '', imageurl: 'https://i.pravatar.cc/150'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/users/register', formData);
      await login(formData.email, formData.password);
      onClose();
      window.location.href = '/';
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao cadastrar. Verifique os dados.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ===== ALTERAÇÃO: onClick removido daqui =====
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
        <form className="form" onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group"><label htmlFor="username">Nome</label><input type="text" id="username" placeholder="Digite o seu nome" required onChange={handleChange} /></div>
          <div className="input-group"><label htmlFor="email">Email</label><input type="email" id="email" placeholder="Digite o seu email" required onChange={handleChange} /></div>
          <div className="input-group"><label htmlFor="password">Senha</label><input type="password" id="password" placeholder="Digite a sua senha" required onChange={handleChange} /></div>
          <div className="input-group"><label htmlFor="phone">Telefone (Ex: 11987654321)</label><input type="tel" id="phone" placeholder="Digite o seu telefone" required onChange={handleChange} /></div>
          <div className="input-group"><label htmlFor="address">Endereço</label><input type="text" id="address" placeholder="Digite o seu endereço" required onChange={handleChange} /></div>
          <div className="input-group"><label htmlFor="rg">RG (somente números)</label><input type="text" id="rg" placeholder="Digite o seu RG" required onChange={handleChange} /></div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <div className="links">
          <button type="button" className="link-button" onClick={onClose}>Voltar</button>
          <button type="button" className="link-button" onClick={openLogin}>Já tenho conta</button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegisterUser;