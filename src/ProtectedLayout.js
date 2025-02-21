import React, { useContext, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { NotificationContext } from './context/NotificationContext';

const ProtectedLayout = () => {
    const navigate = useNavigate();
    const { isAuthenticated, authInitialized } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (authInitialized && !isAuthenticated) {
            showNotification('Kindly login to access our services!', 'info');
            navigate('/login');
        }
    }, [isAuthenticated, authInitialized, navigate, showNotification]);

    return authInitialized && isAuthenticated ? <Outlet /> : null;
};

export default ProtectedLayout;
