import React, { useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import './Notification.css';

const Notification = () => {
    const { notification, showNotification } = useContext(NotificationContext);

    if (!notification.message) return null;

    return (
        <div className={`notification ${notification.type}`}>
            <p>{notification.message}</p>
            <button onClick={() => showNotification('', '')}> close</button>
        </div>
    );
};

export default Notification;
