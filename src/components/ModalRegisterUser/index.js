import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './css/styles.css';
import logo from '../../assets/images/Header/LogoPet_vita(Atualizado).png';

const ModalRegisterUser = ({ onClose, switchToVet, onSwitchToLogin }) => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', phone: '',
        address: '', rg: '', imageurl: 'https://i.pravatar.cc/150'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('https://i.pravatar.cc/150');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Etapa 1: Registra o usuário com a URL de preview
            const response = await api.post('/users/register', { ...formData, imageurl: imagePreview });
            const newUser = response.data;

            // Etapa 2: Faz o upload da imagem se um arquivo foi selecionado
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', imageFile);
                await api.post(`/upload/user/${newUser.id}`, uploadFormData);
            }
            
            // Etapa 3: Faz o login
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
        <div className="modal active">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>
                <div className="button-group">
                    <button className="button active">Cliente</button>
                    <button className="button" onClick={switchToVet}>Veterinário</button>
                </div>
                <div className="logo-modal"><img src={logo} alt="Pet Vita Logo" /></div>
                <form className="form" onSubmit={handleRegister}>
                    {error && <p className="error-message">{error}</p>}
                    <div className="avatar-upload">
                        <label htmlFor="avatar-input-register-user" className="avatar-label">
                            <img src={imagePreview} alt="Preview" className="avatar-preview" />
                        </label>
                        <input id="avatar-input-register-user" type="file" accept="image/*" onChange={handleImageChange} className="avatar-input" />
                    </div>
                    <div className="input-group"><label htmlFor="username">Nome</label><input type="text" id="username" required onChange={handleChange} /></div>
                    <div className="input-group"><label htmlFor="email">Email</label><input type="email" id="email" required onChange={handleChange} /></div>
                    <div className="input-group"><label htmlFor="password">Senha</label><input type="password" id="password" required onChange={handleChange} /></div>
                    <div className="input-group"><label htmlFor="phone">Telefone</label><input type="tel" id="phone" required onChange={handleChange} /></div>
                    <div className="input-group"><label htmlFor="address">Endereço</label><input type="text" id="address" required onChange={handleChange} /></div>
                    <div className="input-group"><label htmlFor="rg">RG</label><input type="text" id="rg" required onChange={handleChange} /></div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>
                <div className="links">
                    <button type="button" className="link-button" onClick={onClose}>Voltar</button>
                    <button type="button" className="link-button" onClick={onSwitchToLogin}>Já tenho conta</button>
                </div>
            </div>
        </div>
    );
};

export default ModalRegisterUser;