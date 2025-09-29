import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import HeaderComCadastro from '../../components/Header_com_cadastro';
import Footer from '../../components/Footer';
import ImageCropper from '../../components/ImageCropper/ImageCropper';
import profileIcon from '../../assets/images/Perfil/perfilIcon.png';
import { FaPencilAlt } from 'react-icons/fa';
import './css/styles.css';

const ProfileScreen = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [imageToCrop, setImageToCrop] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(profileIcon);

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                setLoading(true);
                try {
                    const response = await api.get('/users/me');
                    setUserData(response.data);
                    setEditData(response.data);
                    if (response.data.imageurl) {
                        setImagePreview(response.data.imageurl);
                    }
                } catch (err) {
                    setError('Não foi possível carregar os dados do perfil.');
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedFile) => {
        setImageFile(croppedFile);
        setImagePreview(URL.createObjectURL(croppedFile));
        setImageToCrop(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const updateDTO = {
                username: editData.username,
                email: editData.email,
                phone: editData.phone,
                address: editData.address,
                rg: editData.rg,
            };
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
        }
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        setEditData(userData);
        setImagePreview(userData.imageurl || profileIcon);
    };

    const renderProfileContent = () => {
        if (loading) return <p className="loading-message">Carregando perfil...</p>;
        if (error || !userData) return <p className="error-message">{error || 'Usuário não autenticado.'}</p>;

        return (
            <div className="profile-container">
                <div className="profile-header"><h1>Meu Perfil</h1></div>
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
                                {isEditing ? <input type="text" name="username" value={editData.username || ''} onChange={handleInputChange} className="info-field editable" /> : <div className="info-field">{userData.username}</div>}
                            </div>
                            <div className="profile-field">
                                <label>Email</label>
                                {isEditing ? <input type="email" name="email" value={editData.email || ''} onChange={handleInputChange} className="info-field editable" /> : <div className="info-field">{userData.email}</div>}
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Endereço</label>
                                {isEditing ? <input type="text" name="address" value={editData.address || ''} onChange={handleInputChange} className="info-field editable" /> : <div className="info-field">{userData.address || 'Não informado'}</div>}
                            </div>
                            <div className="profile-field">
                                <label>Telefone</label>
                                {isEditing ? <input type="tel" name="phone" value={editData.phone || ''} onChange={handleInputChange} className="info-field editable" /> : <div className="info-field">{userData.phone}</div>}
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
        );
    }

    return (
        <div className="page-wrapper">
            <HeaderComCadastro />
            {imageToCrop && (
                <ImageCropper
                    imageSrc={imageToCrop}
                    onCropComplete={handleCropComplete}
                    onClose={() => setImageToCrop(null)}
                />
            )}
            <main className="page-content">{renderProfileContent()}</main>
            <Footer />
        </div>
    );
};

export default ProfileScreen;