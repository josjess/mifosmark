import React, { useContext, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { NotificationContext } from './context/NotificationContext';

const ProtectedLayout = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (!isAuthenticated) {
            showNotification('Kindly login to access our services!', 'error');
            navigate('/login');
        }
    }, [isAuthenticated, navigate, showNotification]);

    return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedLayout;
