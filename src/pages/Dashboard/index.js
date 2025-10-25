import React, { useState, useEffect } from 'react';
import HeaderEmployee from '../../../components/HeaderEmployee';
import Footer from '../../../components/Footer';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import './css/styles.css';

// Modal de Check-in (componente interno)
const CheckInModal = ({ consulta, onClose, onCheckInSuccess }) => {
    const [triageData, setTriageData] = useState({
        weightKg: '',
        temperatureCelsius: '',
        mainComplaint: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTriageData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post(`/api/employee/consultations/${consulta.id}/check-in`, triageData);
            toast.success(`Check-in para ${consulta.petName} realizado com sucesso!`);
            onCheckInSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || "Erro ao realizar check-in.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Triagem e Check-in: {consulta.petName}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-modal">
                        <label>Peso (kg)</label>
                        <input type="number" name="weightKg" step="0.1" required onChange={handleChange} />
                    </div>
                    <div className="form-group-modal">
                        <label>Temperatura (°C)</label>
                        <input type="number" name="temperatureCelsius" step="0.1" required onChange={handleChange} />
                    </div>
                    <div className="form-group-modal">
                        <label>Queixa Principal</label>
                        <textarea name="mainComplaint" rows="3" required onChange={handleChange}></textarea>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={isSaving}>Cancelar</button>
                        <button type="submit" className="btn-save" disabled={isSaving}>
                            {isSaving ? 'Salvando...' : 'Confirmar Check-in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const EmployeeDashboard = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConsulta, setSelectedConsulta] = useState(null);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/employee/today-schedules');
            setSchedules(response.data);
        } catch (error) {
            toast.error("Não foi possível carregar os agendamentos do dia.");
            console.error("Erro ao buscar agendamentos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleCheckInSuccess = () => {
        setSelectedConsulta(null);
        fetchSchedules();
    };

    return (
        <div className="employee-page">
            {/* A renderização <HeaderEmployee /> foi REMOVIDA daqui */}
            <main className="employee-content">
                <div className="employee-header">
                    <h1>Painel Operacional do Dia</h1>
                    <p>Aqui estão as consultas agendadas para hoje.</p>
                </div>
                {loading ? (
                    <p className="loading-message">Carregando agendamentos...</p>
                ) : (
                    <div className="schedule-list">
                        {schedules.length > 0 ? schedules.map(item => (
                            <div key={item.id} className="schedule-card">
                                <div className="card-datetime">
                                    {item.consultationtime}
                                </div>
                                <div className="card-pet-info">
                                    <div className="pet-avatar-placeholder">{item.petName.charAt(0)}</div>
                                    <div>
                                        <div className="card-pet-name">{item.petName}</div>
                                        <small>Tutor: {item.clientName || item.userName}</small>
                                    </div>
                                </div>
                                <div className="card-service-name">
                                    {item.serviceName}
                                    <small>Com Dr(a). {item.veterinaryName}</small>
                                </div>
                                <div className="card-actions">
                                    <button className="action-btn complete" onClick={() => setSelectedConsulta(item)}>Check-in</button>
                                </div>
                            </div>
                        )) : (
                            <div className="no-data-message">Nenhuma consulta agendada para hoje.</div>
                        )}
                    </div>
                )}
            </main>
            {selectedConsulta && (
                <CheckInModal
                    consulta={selectedConsulta}
                    onClose={() => setSelectedConsulta(null)}
                    onCheckInSuccess={handleCheckInSuccess}
                />
            )}
            <Footer />
        </div>
    );
};

export default EmployeeDashboard;