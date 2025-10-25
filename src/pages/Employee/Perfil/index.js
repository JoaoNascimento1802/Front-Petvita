import React from 'react';
import Footer from '../../../components/Footer';
import ProfileScreen from '../../Perfil'; // Componente de perfil é genérico e funciona para qualquer usuário logado

const EmployeePerfil = () => {
    return (
        <div className="employee-page">
            <main className="employee-content">
                <ProfileScreen />
            </main>
            <Footer />
        </div>
    );
};

export default EmployeePerfil;