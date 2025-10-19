import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './css/styles.css';
import logo from '../../assets/images/Header/LogoPet_vita(Atualizado).png';
import defaultProfileIcon from '../../assets/images/Header/perfilIcon.png';
import { toast } from 'react-toastify';

const ModalRegisterUser = ({ onClose, switchToVet, onSwitchToLogin }) => {
    const { login, loadUserFromToken } = useAuth(); // Adicionado loadUserFromToken
    
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', phone: '',
        address: '', rg: '', imageurl: '' 
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(defaultProfileIcon);
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
        setLoading(true);
        try {
            // --- FLUXO CORRIGIDO ---

            // 1. Regista o utilizador sem a URL da imagem.
            const registerResponse = await api.post('/users/register', formData);
            const newUser = registerResponse.data;

            // 2. Faz o login IMEDIATAMENTE após o registo para obter o token JWT.
            // O `login` irá guardar o token no storage e configurar o cabeçalho do Axios.
            await login(formData.email, formData.password, true);

            // 3. AGORA, com o token ativo, faz o upload da imagem (se houver uma).
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', imageFile);
                // Esta requisição agora irá com o cabeçalho de autenticação correto.
                await api.post(`/upload/user/${newUser.id}`, uploadFormData);
            }
            
            // 4. Recarrega os dados do utilizador no contexto para garantir que a imagem apareça.
            await loadUserFromToken();

            toast.success(`Bem-vindo(a), ${newUser.username}! Registo concluído com sucesso.`);
            
            onClose();
            // A navegação pode ser desnecessária se a página principal recarregar o estado
            // window.location.href = '/'; 

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro ao registar. Verifique os dados.';
            toast.error(errorMessage);
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
                        {loading ? 'A registar...' : 'Registar'}
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