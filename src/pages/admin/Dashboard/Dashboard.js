import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/Footer';
import api from '../../../services/api'; 
import mainImage from '../../../assets/images/Vet/image 56.png';
import cardImage1 from '../../../assets/images/Vet/Group 105.png';
import cardImage2 from '../../../assets/images/Vet/Group 106.png';
import './Dashboard.css';

const AdminDashboard = ({ isEmployeeView = false }) => {
    const [isTesting, setIsTesting] = useState(false);

    const handleTestEmail = async () => {
        setIsTesting(true);
        try {
            const response = await api.get('/admin/test-email');
            alert('Comando de teste enviado com sucesso! Verifique o console do seu back-end.');
            console.log('Resposta do servidor:', response.data);
        } catch (error) {
            alert('Falha ao acionar o teste. Verifique se você está logado como Admin.');
            console.error('Erro ao testar envio de email:', error);
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="admin-page" style={{ paddingTop: 0, background: 'none' }}>
            {/* O Header e o Footer são controlados pela página pai */}
            <main className="dashboard-content" style={{ paddingTop: 0 }}>
                <section className="welcome-section">
                    <div className="welcome-text">
                        {/* Título muda dependendo da visão */}
                        <h1>{isEmployeeView ? 'Painel de Atendimento' : 'Seja bem vindo, Administrador!'}</h1>
                        <p>{isEmployeeView ? 'Gerencie o fluxo de atendimentos e clientes.' : 'Gerencie a plataforma e todos os usuários a partir deste painel.'}</p>
                        
                        {/* Botão de teste só aparece para o Admin */}
                        {!isEmployeeView && (
                            <button 
                                className="test-email-button" 
                                onClick={handleTestEmail} 
                                disabled={isTesting}
                            >
                                {isTesting ? 'Testando...' : 'Testar Envio de E-mail Automático'}
                            </button>
                        )}
                    </div>
                </section>

                <section className="cards-container">
                    <Link to={isEmployeeView ? "/employee/consultas" : "/admin/veterinarios"} className="main-card">
                        <img src={mainImage} alt="Gerenciar" className="card-image" />
                        <div className="card-footer">
                            <span>{isEmployeeView ? 'VER CONSULTAS' : 'GERENCIAR VETERINÁRIOS'}</span>
                        </div>
                    </Link>

                    <div className="bottom-cards">
                        <Link to={isEmployeeView ? "/employee/schedule" : "/admin/pacientes"} className="small-card">
                            <img src={cardImage1} alt="Gerenciar Pacientes" className="card-image"/>
                            <div className="card-footer">
                                <span>{isEmployeeView ? 'AGENDA GERAL' : 'GERENCIAR PACIENTES'}</span>
                            </div>
                        </Link>
                        <Link to={isEmployeeView ? "/employee/chat" : "/admin/relatorios"} className="small-card">
                            <img src={cardImage2} alt="Visualizar Relatórios" className="card-image"/>
                            <div className="card-footer">
                                <span>{isEmployeeView ? 'CHAT INTERNO' : 'VISUALIZAR RELATÓRIOS'}</span>
                            </div>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;