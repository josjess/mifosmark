import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-title">
                    <span className="glitch" data-text="404">404</span>
                </h1>
                <p className="not-found-message">
                    The page you’re looking for, Exists Not!!.
                </p>
                <Link to="/" className="not-found-link">
                    Return to Safety
                </Link>
            </div>
            <div className="animated-background">
                <div className="glow-ring"></div>
                <div className="glow-ring"></div>
            </div>
        </div>
    );
};

export default NotFound;
