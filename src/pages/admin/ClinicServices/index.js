import React, { useState, useEffect, useCallback } from 'react';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer';
import api from '../../../services/api';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import './styles.css';
import { toast } from 'react-toastify';

const specialityOptions = [
    "CLINICO_GERAL", "ANESTESIOLOGIA", "CARDIOLOGIA", "DERMATOLOGIA", "ENDOCRINOLOGIA",
    "GASTROENTEROLOGIA", "NEUROLOGIA", "NUTRICAO", "OFTALMOLOGIA", "ONCOLOGIA",
    "ORTOPEDIA", "REPRODUCAO_ANIMAL", "PATOLOGIA", "CIRURGIA_GERAL", "CIRURGIA_ORTOPEDICA",
    "ODONTOLOGIA", "ZOOTECNIA", "EXOTICOS", "ACUPUNTURA", "FISIOTERAPIA", "IMAGINOLOGIA", "ESTETICA"
];

const ClinicServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [editingId, setEditingId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    
    const initialFormData = { name: '', description: '', price: '', isMedicalService: 'false', speciality: 'ESTETICA' };
    const [formData, setFormData] = useState(initialFormData);

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/clinic-services');
            setServices(response.data);
        } catch (err) {
            setError('Falha ao buscar os serviços da clínica.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            isMedicalService: formData.isMedicalService === 'true'
        };

        try {
            if (editingId) {
                await api.put(`/admin/clinic-services/${editingId}`, payload);
                toast.success('Serviço atualizado com sucesso!');
            } else {
                await api.post('/admin/clinic-services', payload);
                toast.success('Serviço criado com sucesso!');
            }
            resetForm();
            fetchServices();
        } catch (err) {
            toast.error('Erro ao salvar o serviço.');
            console.error(err.response?.data || err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
            try {
                await api.delete(`/admin/clinic-services/${id}`);
                toast.success('Serviço excluído com sucesso!');
                fetchServices();
            } catch (err) {
                toast.error('Erro ao excluir o serviço.');
            }
        }
    };

    const handleEditClick = (service) => {
        setEditingId(service.id);
        setIsCreating(false);
        setFormData({ 
            name: service.name, 
            description: service.description, 
            price: service.price,
            isMedicalService: String(service.isMedicalService),
            speciality: service.speciality
        });
    };

    // CORREÇÃO: A função resetForm não deve mais fechar o formulário.
    const resetForm = () => {
        setEditingId(null);
        setIsCreating(false); // Agora é seguro fechar o formulário aqui.
        setFormData(initialFormData);
    };

    // CORREÇÃO: Lógica do botão "Adicionar" simplificada.
    const handleAddNewClick = () => {
        setEditingId(null);
        setFormData(initialFormData);
        setIsCreating(true);
    };

    return (
        <div className="admin-page">
            <HeaderAdmin />
            <main className="admin-content">
                <div className="admin-page-header">
                    <h1>Gerenciar Serviços da Clínica</h1>
                    <button className="add-new-button" onClick={handleAddNewClick}>
                        <FaPlus /> Adicionar Serviço
                    </button>
                </div>

                {(isCreating || editingId) && (
                    <div className="form-container">
                        <h3>{editingId ? 'Editando Serviço' : 'Novo Serviço'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-row">
                                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Nome do Serviço" required />
                                <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Preço (ex: 150.00)" required step="0.01" />
                            </div>
                            <div className="form-row">
                                <select name="isMedicalService" value={formData.isMedicalService} onChange={handleInputChange} required>
                                    <option value="false">Serviço Geral / Estética</option>
                                    <option value="true">Serviço Médico (Consulta)</option>
                                </select>
                                <select name="speciality" value={formData.speciality} onChange={handleInputChange} required>
                                    {specialityOptions.map(spec => (
                                        <option key={spec} value={spec}>{spec.replace(/_/g, " ")}</option>
                                    ))}
                                </select>
                            </div>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Descrição do serviço..." rows="3"></textarea>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={resetForm}><FaTimes /> Cancelar</button>
                                <button type="submit" className="btn-save"><FaSave /> Salvar</button>
                            </div>
                        </form>
                    </div>
                )}
                
                {loading && <p>A carregar...</p>}
                {error && <p className="error-message">{error}</p>}
                
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Nome do Serviço</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Tipo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service.id}>
                                <td>{service.name}</td>
                                <td>{service.description}</td>
                                <td>R$ {Number(service.price).toFixed(2)}</td>
                                <td>
                                    <span className={`service-type-badge ${service.isMedicalService ? 'medical' : 'general'}`}>
                                        {service.isMedicalService ? 'Médico' : 'Geral'}
                                    </span>
                                </td>
                                <td className="action-cell">
                                    <button className="action-button-card edit" onClick={() => handleEditClick(service)}><FaEdit /></button>
                                    <button className="action-button-card delete" onClick={() => handleDelete(service.id)}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            <Footer />
        </div>
    );
};

export default ClinicServices;
