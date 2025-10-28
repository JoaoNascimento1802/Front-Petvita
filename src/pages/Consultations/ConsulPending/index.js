import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import HeaderComCadastro from '../../../components/Header_com_cadastro';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import '../css/styles.css';

const ConsulPending = () => {
    // Estado para armazenar a lista unificada
    const [allAppointments, setAllAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'pendentes';
    
    const [dataAtual] = useState(new Date());

    useEffect(() => {
        if (!user) { 
            setLoading(false); 
            return; 
        };
        
        const fetchAllAppointments = async () => {
            setLoading(true);
            setError('');
            try {
                // Faz as duas chamadas à API em paralelo
                const [consultasRes, servicosRes] = await Promise.all([
                    api.get('/consultas/my-consultations'),
                    api.get('/api/service-schedules/my-schedules')
                ]);

                // Transforma os dados de consultas para um formato unificado
                const unifiedConsultas = consultasRes.data.map(c => ({
                    id: `consulta-${c.id}`,
                    type: 'Consulta Médica',
                    link: c.status === 'FINALIZADA' ? `/detalhes-consulta-concluida/${c.id}` : `/detalhes-consulta/${c.id}`,
                    petName: c.petName,
                    serviceName: c.serviceName,
                    professionalName: c.veterinaryName,
                    price: c.servicePrice,
                    dateTime: new Date(`${c.consultationdate}T${c.consultationtime}`),
                    status: c.status,
                    rawDate: c.consultationdate // para o calendário
                }));

                // Transforma os dados de serviços para o mesmo formato unificado
                const unifiedServicos = servicosRes.data.map(s => ({
                    id: `servico-${s.id}`,
                    type: 'Serviço de Estética',
                    link: `/detalhes-servico/${s.id}`, // Rota a ser criada se necessário
                    petName: s.petName,
                    serviceName: s.serviceName,
                    professionalName: s.employeeName,
                    price: s.servicePrice,
                    dateTime: new Date(`${s.scheduleDate}T${s.scheduleTime}`),
                    status: s.status,
                    rawDate: s.scheduleDate // para o calendário
                }));

                // Junta e ordena todos os agendamentos pela data, dos mais recentes para os mais antigos
                const allData = [...unifiedConsultas, ...unifiedServicos].sort((a, b) => b.dateTime - a.dateTime);
                
                setAllAppointments(allData);

            } catch (err) {
                console.error("Erro ao buscar agendamentos:", err);
                setError('Falha ao buscar os seus agendamentos.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllAppointments();
    }, [user]);

    const renderContent = () => {
        if (loading) return <p style={{textAlign: 'center', padding: '20px'}}>Carregando...</p>;
        if (error) return <p className="error-message">{error}</p>;

        if (activeTab === 'calendario') {
            // Lógica do calendário continua funcionando com a lista unificada
            const renderizarDias = () => {
                const dias = [];
                const ano = dataAtual.getFullYear();
                const mes = dataAtual.getMonth();
                const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
                const diasNoMes = new Date(ano, mes + 1, 0).getDate();
                const offsetPrimeiroDia = (primeiroDiaDoMes === 0) ? 6 : primeiroDiaDoMes - 1;

                for (let i = 0; i < offsetPrimeiroDia; i++) { dias.push(<div key={`vazio-${i}`} className="dia-celula vazio"></div>); }

                for (let dia = 1; dia <= diasNoMes; dia++) {
                    const appointmentsDoDia = allAppointments.filter(a => new Date(a.rawDate).getUTCDate() === dia && new Date(a.rawDate).getUTCMonth() === mes);
                    dias.push(
                        <div key={dia} className="dia-celula">
                            <span className="numero-dia">{dia}</span>
                            {appointmentsDoDia.length > 0 && (
                                <div className="marcadores-container">
                                    {appointmentsDoDia.map((app) => (
                                        <div key={app.id} className="marcador-consulta" title={`${app.petName} - ${app.serviceName}`}></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }
                return dias;
            };
            return (
                <div className="calendario-container">
                    <div className="calendario-grid">{renderizarDias()}</div>
                </div>
            );
        }
        
        const dataMap = {
            pendentes: allAppointments.filter(a => a.status === 'PENDENTE'),
            agendadas: allAppointments.filter(a => a.status === 'AGENDADA'),
            historico: allAppointments.filter(a => ['FINALIZADA', 'CANCELADA', 'RECUSADA'].includes(a.status)),
        };
        
        const dataToRender = dataMap[activeTab] || [];

        if (dataToRender.length === 0) return <p style={{textAlign: 'center', padding: '20px'}}>Nenhum agendamento encontrado nesta aba.</p>;
        
        return dataToRender.map(item => (
            <Link to={item.link} key={item.id} className="pet-card-link">
                <div className="pet-card">
                    <div className="pet-info">
                        <h3 className="pet-name">{item.petName}</h3>
                        <span className="card-subtitle">{item.serviceName} ({item.type})</span>
                        <span className="card-subtitle-small">
                            Com {item.professionalName} - R$ {item.price ? Number(item.price).toFixed(2) : '0.00'}
                        </span>
                        <span className="card-subtitle-small">
                            {item.dateTime.toLocaleString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
            </Link>
        ));
    };

    return (
        <div className="pet-profile-page">
            <HeaderComCadastro />
            <main className="main-content-consultation">
                <h1>Meus Agendamentos</h1>
                <div className="pet-profile-container">
                    <div className="status-section">
                        <div className="status-buttons">
                            <button className={`status-button ${activeTab === 'pendentes' ? 'active' : ''}`} onClick={() => setSearchParams({tab: 'pendentes'})}>Pendentes</button>
                            <button className={`status-button ${activeTab === 'agendadas' ? 'active' : ''}`} onClick={() => setSearchParams({tab: 'agendadas'})}>Agendados</button>
                            <button className={`status-button ${activeTab === 'historico' ? 'active' : ''}`} onClick={() => setSearchParams({tab: 'historico'})}>Histórico</button>
                            <button className={`status-button ${activeTab === 'calendario' ? 'active' : ''}`} onClick={() => setSearchParams({tab: 'calendario'})}>Calendário</button>
                        </div>
                    </div>
                    <div className="consultas-list-container">{renderContent()}</div>
                    <div className="add-consulta-container">
                        <Link to="/agendar-consulta" className="action-button-primary">Agendar Novo Serviço</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ConsulPending;