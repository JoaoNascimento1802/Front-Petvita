import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import HeaderAdmin from '../../../components/HeaderAdmin/HeaderAdmin';
import Footer from '../../../components/Footer';
import profileIcon from '../../../assets/images/Perfil/perfilIcon.png';
import { FaPencilAlt } from 'react-icons/fa';
import './Perfil.css';

const AdminPerfil = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [editData, setEditData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(profileIcon);

    useEffect(() => {
        if (user) {
            setLoading(true);
            api.get('/users/me').then(response => {
                setUserData(response.data);
                setEditData(response.data);
                if (response.data.imageurl) {
                    setImagePreview(response.data.imageurl);
                }
            }).catch(err => {
                console.error("Erro ao buscar dados do admin", err);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const updateDTO = { username: editData.username, email: editData.email, phone: editData.phone, address: editData.address };
            const response = await api.put(`/users/${user.id}`, updateDTO);
            setUserData(response.data);

            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', imageFile);
                const imageResponse = await api.post(`/upload/user/${user.id}`, uploadFormData);
                setUserData(prev => ({ ...prev, imageurl: imageResponse.data.url }));
                setImagePreview(imageResponse.data.url);
            }

            setIsEditing(false);
            alert('Perfil atualizado com sucesso!');
        } catch (err) {
            alert('Erro ao salvar as alterações.');
            console.error(err.response || err);
        }
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        setEditData(userData);
        setImagePreview(userData.imageurl || profileIcon);
    };

    if (loading) return <div>Carregando...</div>;
    if (!userData) return <div>Não foi possível carregar os dados do perfil.</div>;

    return (
        <div className="profile-page-admin">
            <HeaderAdmin />
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Perfil do Administrador</h1>
                </div>
                
                <form className="profile-content" onSubmit={handleSaveChanges}>
                    <div className="profile-picture-section">
                        <div className="profile-picture-container">
                            <img src={imagePreview} alt="Foto de perfil" className="profile-picture" />
                            {isEditing && (
                                <div className="profile-picture-edit">
                                    <label htmlFor="profile-image-input"><FaPencilAlt className="edit-icon" /></label>
                                    <input id="profile-image-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="profile-info-section">
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Nome</label>
                                {isEditing ? (
                                    <input type="text" name="username" value={editData.username} onChange={handleInputChange} className="info-field editable" />
                                ) : (
                                    <div className="info-field">{userData.username}</div>
                                )}
                            </div>
                            <div className="profile-field">
                                <label>Cargo</label>
                                <div className="info-field">{userData.role}</div>
                            </div>
                        </div>
                        
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Email</label>
                                {isEditing ? (
                                    <input type="email" name="email" value={editData.email} onChange={handleInputChange} className="info-field editable" />
                                ) : (
                                    <div className="info-field">{userData.email}</div>
                                )}
                            </div>
                            <div className="profile-field">
                                <label>Telefone</label>
                                {isEditing ? (
                                    <input type="tel" name="phone" value={editData.phone} onChange={handleInputChange} className="info-field editable" />
                                ) : (
                                    <div className="info-field">{userData.phone}</div>
                                )}
                            </div>
                        </div>

                        <div className="profile-actions">
                            {isEditing ? (
                                <>
                                    <button type="submit" className="save-button">Salvar</button>
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

export default AdminPerfil;