import React, { useState } from 'react';
import api from '../../../services/api';
import './VetList.css'; // Reutilizaremos o CSS

const specialityOptions = [
    "CLINICO_GERAL", "ANESTESIOLOGIA", "CARDIOLOGIA", "DERMATOLOGIA", "ENDOCRINOLOGIA",
    "GASTROENTEROLOGIA", "NEUROLOGIA", "NUTRICAO", "OFTALMOLOGIA", "ONCOLOGIA",
    "ORTOPEDIA", "REPRODUCAO_ANIMAL", "PATOLOGIA", "CIRURGIA_GERAL", "CIRURGIA_ORTOPEDICA",
    "ODONTOLOGIA", "ZOOTECNIA", "EXOTICOS", "ACUPUNTURA", "FISIOTERAPIA", "IMAGINOLOGIA"
];

const AddVetModal = ({ onClose, onVetAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        crmv: '',
        rg: '',
        specialityenum: '',
        phone: '',
        imageurl: 'https://i.pravatar.cc/150',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/veterinary', formData);
            alert('Veterinário cadastrado com sucesso!');
            onVetAdded(); // Chama a função para atualizar a lista na página principal
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Erro ao cadastrar veterinário.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Adicionar Novo Veterinário</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group-modal">
                        <label>Nome Completo</label>
                        <input type="text" name="name" required onChange={handleChange} />
                    </div>
                    <div className="form-group-modal">
                        <label>Email</label>
                        <input type="email" name="email" required onChange={handleChange} />
                    </div>
                    <div className="form-group-modal">
                        <label>Senha Provisória</label>
                        <input type="password" name="password" required onChange={handleChange} />
                    </div>
                     <div className="form-group-modal">
                        <label>CRMV</label>
                        <input type="text" name="crmv" required onChange={handleChange} />
                    </div>
                    <div className="form-group-modal">
                        <label>RG</label>
                        <input type="text" name="rg" required onChange={handleChange} />
                    </div>
                    <div className="form-group-modal">
                        <label>Telefone</label>
                        <input type="tel" name="phone" required onChange={handleChange} />
                    </div>
                    <div className="form-group-modal">
                        <label>Especialidade</label>
                        <select name="specialityenum" required onChange={handleChange}>
                            <option value="">Selecione...</option>
                            {specialityOptions.map(spec => (
                                <option key={spec} value={spec}>{spec.replace(/_/g, " ")}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVetModal;