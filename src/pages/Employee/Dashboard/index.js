import React, { useState, useEffect } from 'react';
import HeaderEmployee from '../../../components/HeaderEmployee';
import Footer from '../../../components/Footer';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import './css/styles.css';

const EmployeeDashboard = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                // Chamada real para a API
                const response = await api.get('/api/employee/my-schedules');
                setSchedules(response.data);
            } catch (error) {
                toast.error("Não foi possível carregar seus agendamentos.");
                console.error("Erro ao buscar agendamentos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []);

    return (
        <div className="employee-page">
            <HeaderEmployee />
            <main className="employee-content">
                <div className="employee-header">
                    <h1>Meus Agendamentos de Serviço</h1>
                    <p>Aqui estão os próximos serviços agendados para você.</p>
                </div>
                {loading ? (
                    <p>Carregando agendamentos...</p>
                ) : (
                    <div className="schedule-list">
                        {schedules.length > 0 ? schedules.map(item => (
                            <div key={item.id} className="schedule-card">
                                <div className="card-pet-info">
                                    <div className="pet-avatar-placeholder">{item.petName.charAt(0)}</div>
                                    <div>
                                        <div className="card-pet-name">{item.petName}</div>
                                        <small>Tutor: {item.clientName}</small>
                                    </div>
                                </div>
                                <div className="card-service-name">{item.serviceName}</div>
                                <div className="card-datetime">
                                    {new Date(item.scheduleDate + 'T' + item.scheduleTime).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                                </div>
                                <div className="card-actions">
                                    <button className="action-btn complete">Finalizar</button>
                                    <button className="action-btn cancel">Cancelar</button>
                                </div>
                            </div>
                        )) : (
                            <div className="no-data-message">Nenhum serviço agendado para você no momento.</div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default EmployeeDashboard;
