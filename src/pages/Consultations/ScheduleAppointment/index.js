import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderComCadastro from '../../../components/Header_com_cadastro';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import '../css/styles.css';
import { toast } from 'react-toastify';

const ScheduleAppointment = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [appointmentType, setAppointmentType] = useState(null); // 'medical' ou 'service'

    const [pets, setPets] = useState([]);
    const [allVets, setAllVets] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [filteredProfessionals, setFilteredProfessionals] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [clinicServices, setClinicServices] = useState([]);

    const [formData, setFormData] = useState({
        petId: '',
        professionalId: '',
        clinicServiceId: '',
        consultationdate: '',
        consultationtime: '',
        reason: '',
        observations: ''
    });
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                try {
                    const [petsRes, vetsRes, servicesRes, usersRes] = await Promise.all([
                        api.get('/pets/my-pets'),
                        api.get('/veterinary'),
                        api.get('/admin/clinic-services'),
                        api.get('/admin/users', { params: { size: 2000 } })
                    ]);
                    setPets(petsRes.data || []);
                    setAllVets(vetsRes.data || []);
                    setClinicServices(servicesRes.data || []);
                    setAllEmployees(usersRes.data.content.filter(u => u.role === 'EMPLOYEE') || []);
                } catch (error) {
                    toast.error("Erro ao carregar dados. Tente recarregar a página.");
                } finally {
                    setLoading(false);
                }
            } else if (!authLoading) {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, authLoading]);

    const handleTypeSelect = (type) => {
        setAppointmentType(type);
        setFormData({ petId: '', professionalId: '', clinicServiceId: '', consultationdate: '', consultationtime: '', reason: '', observations: '' });
        setFilteredProfessionals([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };

        if (name === 'clinicServiceId') {
            const selectedService = clinicServices.find(s => s.id === parseInt(value));
            if (selectedService) {
                if (appointmentType === 'medical') {
                    const vetsWithSpecialty = allVets.filter(vet => vet.specialityenum === selectedService.speciality);
                    setFilteredProfessionals(vetsWithSpecialty);
                } else {
                    setFilteredProfessionals(allEmployees);
                }
            } else {
                setFilteredProfessionals([]);
            }
            updatedFormData.professionalId = '';
            setAvailableTimes([]);
        }

        if (name === 'professionalId' || name === 'consultationdate') {
            updatedFormData.consultationtime = '';
        }

        setFormData(updatedFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const endpoint = appointmentType === 'medical' ? '/consultas' : '/api/service-schedules';
        const professionalField = appointmentType === 'medical' ? 'veterinarioId' : 'employeeId';

        try {
            const requestData = {
                petId: parseInt(formData.petId),
                [professionalField]: parseInt(formData.professionalId),
                clinicServiceId: parseInt(formData.clinicServiceId),
                consultationdate: formData.consultationdate,
                scheduleDate: formData.consultationdate,
                scheduleTime: formData.consultationtime,
                consultationtime: formData.consultationtime,
                reason: formData.reason,
                observations: formData.observations || 'Nenhuma observação.',
                usuarioId: user.id,
            };

            await api.post(endpoint, requestData);
            toast.success(`Agendamento de ${appointmentType === 'medical' ? 'consulta' : 'serviço'} solicitado com sucesso!`);
            navigate(appointmentType === 'medical' ? '/consultas' : '/');
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Erro ao agendar.";
            toast.error(errorMsg);
        }
    };

    const relevantServices = appointmentType
        ? clinicServices.filter(s => s.isMedicalService === (appointmentType === 'medical'))
        : [];

    if (authLoading || loading) {
        return <p style={{ paddingTop: '150px', textAlign: 'center' }}>A carregar...</p>;
    }

    return (
        <div className="add-pet-page">
            <HeaderComCadastro />
            <div className="welcome-section">
                <h1 className="welcome-title">Novo Agendamento</h1>
                <p>Selecione o tipo de serviço que precisa para o seu pet.</p>
            </div>
            <div className="add-pet-wrapper">
                <div className="add-pet-container">
                    
                    {!appointmentType ? (
                        <div className="type-selection">
                            <button onClick={() => handleTypeSelect('medical')}>
                                <div className="type-icon">🩺</div>
                                <span>Consultas Médicas</span>
                                <small>Para avaliações de saúde, vacinas e emergências.</small>
                            </button>
                            <button onClick={() => handleTypeSelect('service')}>
                                <div className="type-icon">🛁</div>
                                <span>Estética e Outros Serviços</span>
                                <small>Para banho, tosa, corte de unhas e bem-estar.</small>
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="pet-form">
                            <div className="form-header">
                                <h2>{appointmentType === 'medical' ? 'Agendar Consulta Médica' : 'Agendar Serviço de Estética'}</h2>
                                <button type="button" className="link-button" onClick={() => setAppointmentType(null)}>Trocar tipo de serviço</button>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="petId">Selecione o seu Pet</label>
                                    <select id="petId" name="petId" value={formData.petId} onChange={handleChange} required>
                                        <option value="">Selecione um pet</option>
                                        {pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="clinicServiceId">Serviço Desejado</label>
                                    <select id="clinicServiceId" name="clinicServiceId" value={formData.clinicServiceId} onChange={handleChange} required>
                                        <option value="">Selecione um serviço</option>
                                        {relevantServices.map(service => (
                                            <option key={service.id} value={service.id}>
                                                {service.name} - R$ {Number(service.price).toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="professionalId">{appointmentType === 'medical' ? 'Veterinário(a)' : 'Funcionário(a)'}</label>
                                    <select id="professionalId" name="professionalId" value={formData.professionalId} onChange={handleChange} required disabled={!formData.clinicServiceId}>
                                        <option value="">{formData.clinicServiceId ? 'Selecione um profissional' : 'Selecione um serviço primeiro'}</option>
                                        {filteredProfessionals.map(prof => <option key={prof.id} value={prof.id}>{prof.name || prof.username}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="consultationdate">Data</label>
                                    <input type="date" id="consultationdate" name="consultationdate" value={formData.consultationdate} onChange={handleChange} required min={today} disabled={!formData.professionalId} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="consultationtime">Hora</label>
                                    <input type="time" id="consultationtime" name="consultationtime" value={formData.consultationtime} onChange={handleChange} required disabled={!formData.professionalId || !formData.consultationdate} />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="reason">Motivo/Observação (mín. 5 caracteres)</label>
                                <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows="3" required minLength="5"></textarea>
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" className="submit-button" disabled={loading}>Enviar Solicitação</button>
                                <Link to="/" className="cancel-button">Cancelar</Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ScheduleAppointment;

