import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './css/styles.css';
import logo from '../../assets/images/Header/LogoPet_vita(Atualizado).png';

const specialityOptions = ["CLINICO_GERAL", "CARDIOLOGIA", "DERMATOLOGIA", "OFTALMOLOGIA", "ORTOPEDIA", "CIRURGIA_GERAL"];

const ModalRegisterVet = ({ onClose, switchToUser, onSwitchToLogin }) => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', crmv: '', rg: '', specialityenum: '',
        phone: '', imageurl: 'https://i.pravatar.cc/150'
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
            const response = await api.post('/veterinary', { ...formData, imageurl: imagePreview });
            const newVet = response.data;

            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', imageFile);
                await api.post(`/upload/veterinary/${newVet.id}`, uploadFormData);
            }
            
            await login(formData.email, formData.password);
            onClose();
            navigate('/vet/dashboard');
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
                    <button className="button" onClick={switchToUser}>Cliente</button>
                    <button className="button active">Veterinário</button>
                </div>
                <div className="logo-modal"><img src={logo} alt="Pet Vita Logo" /></div>
                <form className="form" onSubmit={handleRegister}>
                    {error && <p className="error-message">{error}</p>}
                    <div className="avatar-upload">
                        <label htmlFor="avatar-input-register-vet" className="avatar-label">
                            <img src={imagePreview} alt="Preview" className="avatar-preview" />
                        </label>
                        <input id="avatar-input-register-vet" type="file" accept="image/*" onChange={handleImageChange} className="avatar-input" />
                    </div>
                    <div className="input-group"><label htmlFor="name">Nome Completo</label><input type="text" id="name" required onChange={handleChange} /></div>
                    <div className="input-group"><label htmlFor="email">Email</label><input type="email" id="email" required onChange={handleChange} /></div>
                    <div className="input-group"><label htmlFor="password">Senha</label><input type="password" id="password" required onChange={handleChange} /></div>
                    <div className="input-group"><label htmlFor="crmv">CRMV</label><input type="text" id="crmv" required onChange={handleChange} /></div>
                    <div className="input-group"><label htmlFor="rg">RG</label><input type="text" id="rg" required onChange={handleChange} /></div>
                    <div className="input-group"><label htmlFor="phone">Telefone</label><input type="tel" id="phone" required onChange={handleChange} /></div>
                    <div className="input-group">
                        <label htmlFor="specialityenum">Especialidade</label>
                        <select id="specialityenum" name="specialityenum" required onChange={handleChange} value={formData.specialityenum}>
                            <option value="">Selecione...</option>
                            {specialityOptions.map(spec => (<option key={spec} value={spec}>{spec.replace(/_/g, ' ')}</option>))}
                        </select>
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
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

export default ModalRegisterVet;