import React, { useContext } from 'react';
import { NotificationContext } from './NotificationContext';
import Notification from './Notification';
import './Notification.css';

const NotificationContainer = () => {
    const { notifications, dismissNotification } = useContext(NotificationContext);

    return (
        <div className="notification-context-container">
            {notifications.map(({ id, message, type, duration }) => (
                <Notification
                    key={id}
                    id={id}
                    message={message}
                    type={type}
                    duration={duration}
                    onDismiss={dismissNotification}
                />
            ))}
        </div>
    );
};

export default NotificationContainer;
