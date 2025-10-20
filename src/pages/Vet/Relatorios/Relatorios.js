import React, { useState } from 'react';
import HeaderVet from '../../../components/HeaderVet/HeaderVet';
import Footer from '../../../components/Footer';
import api from '../../../services/api';
import { FaChartBar, FaFileMedicalAlt, FaDollarSign } from 'react-icons/fa';
import '../css/styles.css';
import { toast } from 'react-toastify';

const VetRelatorios = () => {
    const today = new Date().toISOString().slice(0, 10);
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

    const [filters, setFilters] = useState({ startDate: firstDayOfMonth, endDate: today });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const fetchReport = async () => {
        if (!filters.startDate || !filters.endDate) {
            toast.warn("Por favor, selecione as datas de início e fim.");
            return;
        }
        setLoading(true);
        setReportData(null);
        try {
            const response = await api.get('/veterinary/me/custom-report', { params: filters });
            setReportData(response.data);
        } catch (error) {
            toast.error("Falha ao gerar o relatório.");
            console.error("Erro ao buscar relatório", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vet-page">
            <HeaderVet />
            <main className="vet-content">
                <div className="vet-page-header">
                    <h1>Meus Relatórios</h1>
                    <p>Analise sua performance em um período específico.</p>
                </div>

                <div className="admin-filters report-filters">
                    <div className="filter-group">
                        <label>Data de Início</label>
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                    </div>
                    <div className="filter-group">
                        <label>Data de Fim</label>
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                    </div>
                    <button className="action-button" onClick={fetchReport} disabled={loading}>
                        {loading ? 'Buscando...' : 'Buscar Relatório'}
                    </button>
                </div>

                {loading ? <p>Carregando dados...</p> : reportData ? (
                    <>
                        <div className="stats-cards-grid">
                            <div className="stat-card">
                                <div className="stat-icon revenue"><FaDollarSign /></div>
                                <div className="stat-info">
                                    <span className="stat-number">R$ {Number(reportData.totalRevenue || 0).toFixed(2)}</span>
                                    <span className="stat-label">Meu Faturamento</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon consultations"><FaFileMedicalAlt /></div>
                                <div className="stat-info">
                                    <span className="stat-number">{reportData.totalConsultations}</span>
                                    <span className="stat-label">Consultas no Período</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon performance"><FaChartBar /></div>
                                <div className="stat-info">
                                    <span className="stat-number">{reportData.consultationsByStatus?.FINALIZADA || 0}</span>
                                    <span className="stat-label">Consultas Finalizadas</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : <p className="no-data-message">Use os filtros e clique em "Buscar Relatório" para ver os dados.</p>}
            </main>
            <Footer />
        </div>
    );
};

export default VetRelatorios;