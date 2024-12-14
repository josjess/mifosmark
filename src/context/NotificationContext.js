import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ message: '', type: '' });

    const showNotification = (message, type) => {
        setNotification({ message, type });

        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 50000);
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
