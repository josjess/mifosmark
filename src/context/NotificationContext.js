import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info', duration = 30000) => {
        const id = Date.now();
        const newNotification = { id, message, type, duration };
        setNotifications(prev => [...prev, newNotification]);

        setTimeout(() => dismissNotification(id), duration);
    }, []);

    const dismissNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, showNotification, dismissNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
