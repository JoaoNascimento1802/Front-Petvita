import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// A importação do HeaderVet foi REMOVIDA daqui
import Footer from '../../../components/Footer';
import api from '../../../services/api';
import mainImage from '../../../assets/images/Vet/image 56.png';
import cardImage1 from '../../../assets/images/Vet/Group 105.png';
import cardImage2 from '../../../assets/images/Vet/Group 106.png';
import '../css/styles.css';

const Dashboard = () => {
    const [vetName, setVetName] = useState("Veterinário(a)");
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await api.get('/users/me');
                setVetName(userResponse.data.username);

                const consultasResponse = await api.get('/consultas/my-consultations');
                const pendingConsultas = consultasResponse.data.filter(c => c.status === 'PENDENTE');
                setPendingCount(pendingConsultas.length);

            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="vet-dashboard-page">
            {/* A renderização <HeaderVet /> foi REMOVIDA daqui */}
            <main className="dashboard-content">
                <section className="welcome-section">
                    <div className="welcome-text">
                        <h1>Seja bem vindo(a) Dr(a). {vetName}!</h1>
                        <Link to="/vet/consultas" className="visualizar-button">
                            VISUALIZAR CONSULTAS
                        </Link>
                    </div>
                </section>

                <section className="cards-container">
                    <Link to="/vet/consultas?tab=pedidos" className="main-card">
                        <img src={mainImage} alt="Novos pedidos de agendamento" className="card-image" />
                        <div className="card-footer">
                            <span>NOVOS PEDIDOS DE AGENDAMENTO</span>
                            {!loading && pendingCount > 0 && (
                                <span className="notification-badge-card">{pendingCount}</span>
                            )}
                        </div>
                    </Link>

                    <div className="bottom-cards">
                        <Link to="/vet/schedule" className="small-card">
                            <img src={cardImage1} alt="Horários de consultas" className="card-image"/>
                            <div className="card-footer">
                                <span>MINHA AGENDA</span>
                            </div>
                        </Link>
                        <Link to="/vet/consultas?tab=agendadas" className="small-card">
                            <img src={cardImage2} alt="Compromissos agendados" className="card-image"/>
                            <div className="card-footer">
                                <span>COMPROMISSOS AGENDADOS</span>
                            </div>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;