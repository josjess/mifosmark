import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ id, message, type, duration, onDismiss }) => {
    const [progress, setProgress] = useState(0);

    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const interval = 50;
        const increment = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    onDismiss(id);
                    return 100;
                }
                return prev + increment;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [duration, id, onDismiss]);

    return (
        <div className={`notification ${type} ${dismissed ? 'fade-out' : ''}`}>
            <div className="notification-content">
                <span className="notification-message">{message}</span>
                <button onClick={() => onDismiss(id)} className="close-btn">dismiss</button>
            </div>
        </div>
    );
};

export default Notification;
