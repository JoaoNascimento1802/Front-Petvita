import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HeaderVet from '../../../components/HeaderVet/HeaderVet';
import Footer from '../../../components/Footer';
import api from '../../../services/api';
import '../css/styles.css';
import { toast } from 'react-toastify';

const DetalhesConsulta = () => {
    const { consultaId } = useParams();
    const navigate = useNavigate();
    const [consulta, setConsulta] = useState(null);
    const [report, setReport] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estados para Prescrição
    const [prescription, setPrescription] = useState({ medication: '', dosage: '', instructions: '' });
    const [templates, setTemplates] = useState([]);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [saveAsTemplate, setSaveAsTemplate] = useState(false);
    const [templateTitle, setTemplateTitle] = useState('');

    useEffect(() => {
        const fetchConsultaDetails = async () => {
            if (!consultaId) return;
            setLoading(true);
            try {
                const [consultaRes, templatesRes] = await Promise.all([
                    api.get(`/consultas/${consultaId}`),
                    api.get('/veterinary/prescription-templates')
                ]);
                setConsulta(consultaRes.data);
                setReport(consultaRes.data.doctorReport || '');
                setTemplates(templatesRes.data || []);
            } catch (err) {
                setError('Não foi possível carregar os detalhes da consulta.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchConsultaDetails();
    }, [consultaId]);

    const handlePrescriptionChange = (e) => {
        const { name, value } = e.target;
        setPrescription(prev => ({ ...prev, [name]: value }));
    };

    const handleTemplateSelect = (e) => {
        const templateId = e.target.value;
        if (!templateId) {
            setPrescription({ medication: '', dosage: '', instructions: '' });
            return;
        }
        const selectedTemplate = templates.find(t => t.id.toString() === templateId);
        if (selectedTemplate) {
            setPrescription({
                medication: selectedTemplate.medication,
                dosage: selectedTemplate.dosage,
                instructions: selectedTemplate.instructions
            });
        }
    };

    const handleSavePrescription = async (e) => {
        e.preventDefault();
        try {
            // 1. Salva a prescrição associada à consulta
            await api.post(`/veterinary/consultations/${consultaId}/prescriptions`, prescription);

            // 2. Se o checkbox estiver marcado, salva também como template
            if (saveAsTemplate && templateTitle) {
                await api.post('/veterinary/prescription-templates', {
                    title: templateTitle,
                    ...prescription
                });
            }
            toast.success("Prescrição salva com sucesso!");
            setShowPrescriptionModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Erro ao salvar prescrição.");
        }
    };

    const handleFinalizeConsultation = async () => {
        if (window.confirm('Tem certeza que deseja finalizar esta consulta? Esta ação não pode ser desfeita.')) {
            try {
                // Antes de finalizar, salva o relatório (prontuário)
                await api.put(`/consultas/${consultaId}/report`, report, {
                    headers: { 'Content-Type': 'text/plain' }
                });
                await api.post(`/consultas/${consultaId}/finalize`);
                toast.success('Consulta finalizada e relatório salvo!');
                navigate('/vet/consultas?tab=historico');
            } catch (err) {
                toast.error('Erro ao finalizar a consulta.');
            }
        }
    };

    if (loading) return <div style={{paddingTop: '150px', textAlign: 'center'}}>Carregando...</div>;
    if (error) return <div style={{paddingTop: '150px', textAlign: 'center'}}>{error}</div>;
    if (!consulta) return null;

    return (
        <div className="pets-details-page">
            <HeaderVet />

            {/* Modal de Prescrição */}
            {showPrescriptionModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Criar Prescrição Digital</h2>
                        <form onSubmit={handleSavePrescription}>
                            <div className="form-group-modal">
                                <label>Carregar Template</label>
                                <select onChange={handleTemplateSelect}>
                                    <option value="">-- Selecione um template --</option>
                                    {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                                </select>
                            </div>
                            <div className="form-group-modal">
                                <label>Medicação</label>
                                <textarea name="medication" rows="4" required value={prescription.medication} onChange={handlePrescriptionChange}></textarea>
                            </div>
                            <div className="form-group-modal">
                                <label>Dosagem</label>
                                <textarea name="dosage" rows="3" required value={prescription.dosage} onChange={handlePrescriptionChange}></textarea>
                            </div>
                            <div className="form-group-modal">
                                <label>Instruções</label>
                                <textarea name="instructions" rows="3" value={prescription.instructions} onChange={handlePrescriptionChange}></textarea>
                            </div>
                            <div className="form-group-modal-checkbox">
                                <input type="checkbox" id="saveAsTemplate" checked={saveAsTemplate} onChange={(e) => setSaveAsTemplate(e.target.checked)} />
                                <label htmlFor="saveAsTemplate">Salvar como novo template</label>
                            </div>
                            {saveAsTemplate && (
                                <div className="form-group-modal">
                                    <label>Título do Template</label>
                                    <input type="text" required value={templateTitle} onChange={(e) => setTemplateTitle(e.target.value)} />
                                </div>
                            )}
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowPrescriptionModal(false)}>Cancelar</button>
                                <button type="submit" className="btn-save">Salvar Prescrição</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="welcome-section">
                <h1 className="welcome-title">Detalhes da Consulta</h1>
            </div>
            <div className="pet-details-wrapper">
                <div className="pet-details-container">
                    <div className="avatar-display">
                        <div className="card-avatar-placeholder">{consulta.petName?.charAt(0)}</div>
                    </div>
                    <form className="details-form">
                        <div className="form-row">
                            <div className="form-group"><label>Paciente (Pet)</label><div className="detail-value">{consulta.petName}</div></div>
                            <div className="form-group"><label>Tutor</label><div className="detail-value">{consulta.userName}</div></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Serviço</label><div className="detail-value">{consulta.speciality}</div></div>
                            <div className="form-group"><label>Data</label><div className="detail-value">{new Date(consulta.consultationdate + 'T' + consulta.consultationtime).toLocaleString('pt-BR')}</div></div>
                        </div>
                        <div className="form-group full-width">
                            <label>Motivo da Consulta (informado pelo tutor)</label>
                            <div className="detail-value long-text">{consulta.reason}</div>
                        </div>
                        <div className="form-group full-width">
                            <label>Anotações / Relatório Médico</label>
                            <textarea
                                className="report-textarea"
                                placeholder="Digite as observações, diagnóstico e tratamento..."
                                value={report}
                                onChange={(e) => setReport(e.target.value)}
                                disabled={consulta.status !== 'AGENDADA'}
                            ></textarea>
                        </div>

                        <div className="details-actions">
                            <Link to="/vet/consultas" className="back-button">Voltar</Link>
                            {consulta.status === 'AGENDADA' && (
                                <>
                                    <button type="button" className="action-button-vet prescription" onClick={() => setShowPrescriptionModal(true)}>Criar Prescrição</button>
                                    <button type="button" className="decline-button" onClick={handleFinalizeConsultation}>Finalizar Consulta</button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DetalhesConsulta;