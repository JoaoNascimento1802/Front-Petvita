import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import HeaderVet from '../../../components/HeaderVet/HeaderVet';
import Footer from '../../../components/Footer';
import profileIcon from '../../../assets/images/Perfil/perfilIcon.png';
import { FaPencilAlt } from 'react-icons/fa';
import '../css/styles.css';

const specialityOptions = [
    "CLINICO_GERAL", "ANESTESIOLOGIA", "CARDIOLOGIA", "DERMATOLOGIA", "ENDOCRINOLOGIA",
    "GASTROENTEROLOGIA", "NEUROLOGIA", "NUTRICAO", "OFTALMOLOGIA", "ONCOLOGIA",
    "ORTOPEDIA", "REPRODUCAO_ANIMAL", "PATOLOGIA", "CIRURGIA_GERAL", "CIRURGIA_ORTOPEDICA",
    "ODONTOLOGIA", "ZOOTECNIA", "EXOTICOS", "ACUPUNTURA", "FISIOTERAPIA", "IMAGINOLOGIA"
];

const VetPerfil = () => {
    const { user } = useAuth();
    const [vetData, setVetData] = useState(null);
    const [editData, setEditData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(profileIcon);

    useEffect(() => {
        const fetchVetData = async () => {
            if (user) {
                setLoading(true);
                try {
                    const vetResponse = await api.get('/veterinary/me');
                    const userResponse = await api.get('/users/me');
                    
                    const combinedData = { 
                        ...userResponse.data, 
                        ...vetResponse.data, 
                        id: vetResponse.data.id 
                    };

                    setVetData(combinedData);
                    setEditData(combinedData);
                    setImagePreview(combinedData.imageurl || profileIcon);
                } catch (error) {
                    console.error("Erro ao buscar dados do veterinário", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchVetData();
    }, [user]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const updateDTO = {
                name: editData.name,
                email: editData.email,
                crmv: editData.crmv,
                specialityenum: editData.specialityenum,
                phone: editData.phone,
                rg: editData.rg,
                imageurl: imagePreview
            };
            await api.put(`/admin/veterinarians/${vetData.id}`, updateDTO);

            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', imageFile);
                await api.post(`/upload/veterinary/${vetData.id}`, uploadFormData);
            }
            alert('Perfil atualizado com sucesso!');
            setIsEditing(false);
            
            // Re-busca os dados para garantir que a UI esteja sincronizada
            const vetResponse = await api.get('/veterinary/me');
            const userResponse = await api.get('/users/me');
            const combinedData = { ...userResponse.data, ...vetResponse.data, id: vetResponse.data.id };
            setVetData(combinedData);
            setEditData(combinedData);
            setImagePreview(combinedData.imageurl || profileIcon);
        } catch (err) {
            alert('Erro ao salvar as alterações.');
            console.error(err.response?.data || err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(vetData);
        setImagePreview(vetData.imageurl || profileIcon);
    };

    if (loading) return <div className="loading-container">Carregando perfil...</div>;
    if (!vetData) return <div className="error-message">Não foi possível carregar os dados do perfil.</div>;

    return (
        <div className="profile-page-vet">
            <HeaderVet />
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Perfil Profissional</h1>
                </div>
                
                <form className="profile-content" onSubmit={handleSaveChanges}>
                    <div className="profile-picture-section">
                        <div className="profile-picture-container">
                            <img src={imagePreview} alt="Foto de perfil" className="profile-picture" />
                            {isEditing && (
                                <div className="profile-picture-edit">
                                    <label htmlFor="vet-image-input"><FaPencilAlt className="edit-icon" /></label>
                                    <input id="vet-image-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="profile-info-section">
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Nome Completo</label>
                                {isEditing ? <input type="text" name="name" value={editData.name || ''} onChange={handleInputChange} className="info-field editable" /> : <div className="info-field">{vetData.name}</div>}
                            </div>
                            <div className="profile-field">
                                <label>CRMV</label>
                                {isEditing ? <input type="text" name="crmv" value={editData.crmv || ''} onChange={handleInputChange} className="info-field editable" /> : <div className="info-field">{vetData.crmv}</div>}
                            </div>
                        </div>
                        
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Especialidade</label>
                                {isEditing ? (
                                    <select name="specialityenum" value={editData.specialityenum || ''} onChange={handleInputChange} className="info-field editable">
                                        {specialityOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                    </select>
                                ) : <div className="info-field">{vetData.specialityenum?.replace(/_/g, ' ')}</div>}
                            </div>
                             <div className="profile-field">
                                <label>RG</label>
                                {isEditing ? <input type="text" name="rg" value={editData.rg || ''} onChange={handleInputChange} className="info-field editable" /> : <div className="info-field">{editData.rg}</div>}
                            </div>
                        </div>

                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Email</label>
                                {isEditing ? <input type="email" name="email" value={editData.email || ''} onChange={handleInputChange} className="info-field editable" /> : <div className="info-field">{vetData.email}</div>}
                            </div>
                            <div className="profile-field">
                                <label>Telefone</label>
                                {isEditing ? <input type="tel" name="phone" value={editData.phone || ''} onChange={handleInputChange} className="info-field editable" /> : <div className="info-field">{vetData.phone}</div>}
                            </div>
                        </div>

                        <div className="profile-actions">
                             {isEditing ? (
                                <>
                                    <button type="submit" className="save-button">Salvar Alterações</button>
                                    <button type="button" className="cancel-button" onClick={handleCancel}>Cancelar</button>
                                </>
                            ) : (
                                <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>Editar Perfil</button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default VetPerfil;