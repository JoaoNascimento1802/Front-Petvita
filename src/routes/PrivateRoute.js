import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Pode adicionar um spinner de carregamento aqui
        return <div>Carregando...</div>;
    }

    if (!user) {
        // Se não estiver logado, redireciona para a home
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // Se o usuário não tiver a role necessária, redireciona para a home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;