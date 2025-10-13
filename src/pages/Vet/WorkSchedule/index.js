import React, { useState, useEffect, useCallback } from 'react';
import HeaderVet from '../../../components/HeaderVet/HeaderVet';
import Footer from '../../../components/Footer';
import api from '../../../services/api';
import './styles.css';

const daysOfWeekMap = {
    "MONDAY": "Segunda-feira",
    "TUESDAY": "Terça-feira",
    "WEDNESDAY": "Quarta-feira",
    "THURSDAY": "Quinta-feira",
    "FRIDAY": "Sexta-feira",
    "SATURDAY": "Sábado",
    "SUNDAY": "Domingo"
};

const WorkSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSchedule = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/vet/work-schedule');
            // Ordena os dias da semana
            const sorted = response.data.sort((a, b) => Object.keys(daysOfWeekMap).indexOf(a.dayOfWeek) - Object.keys(daysOfWeekMap).indexOf(b.dayOfWeek));
            setSchedules(sorted);
        } catch (error) {
            console.error("Erro ao buscar agenda", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    const handleScheduleChange = (id, field, value) => {
        setSchedules(prev => 
            prev.map(day => 
                day.id === id ? { ...day, [field]: value } : day
            )
        );
    };

    const handleSave = async (scheduleItem) => {
        try {
            await api.put(`/vet/work-schedule/${scheduleItem.id}`, scheduleItem);
            alert(`Horário de ${daysOfWeekMap[scheduleItem.dayOfWeek]} salvo com sucesso!`);
        } catch (error) {
            alert('Erro ao salvar horário.');
            console.error(error);
        }
    };

    if (loading) return <p className="loading-message">Carregando agenda...</p>;

    return (
        <div className="vet-page">
            <HeaderVet />
            <main className="vet-content-full">
                <div className="vet-page-header">
                    <h1>Meus Horários de Atendimento</h1>
                    <p>Defina sua agenda semanal. O sistema usará esses horários para mostrar sua disponibilidade aos clientes.</p>
                </div>
                <div className="schedule-container">
                    {schedules.map(item => (
                        <div key={item.id} className="schedule-day-row">
                            <label className="day-label">{daysOfWeekMap[item.dayOfWeek]}</label>
                            <div className="time-inputs">
                                <input 
                                    type="time" 
                                    value={item.startTime} 
                                    onChange={(e) => handleScheduleChange(item.id, 'startTime', e.target.value)}
                                    disabled={!item.isWorking}
                                />
                                <span>às</span>
                                <input 
                                    type="time" 
                                    value={item.endTime} 
                                    onChange={(e) => handleScheduleChange(item.id, 'endTime', e.target.value)}
                                    disabled={!item.isWorking}
                                />
                            </div>
                            <div className="working-toggle">
                                <input 
                                    type="checkbox" 
                                    id={`working-${item.id}`}
                                    checked={item.isWorking} 
                                    onChange={(e) => handleScheduleChange(item.id, 'isWorking', e.target.checked)}
                                />
                                <label htmlFor={`working-${item.id}`}>Trabalha neste dia</label>
                            </div>
                            <button className="save-schedule-btn" onClick={() => handleSave(item)}>Salvar</button>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default WorkSchedule;