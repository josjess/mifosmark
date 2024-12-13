import React from 'react';
import './LoadingOverlay.css';
import { useLoading } from '../../context/LoadingContext';

const LoadingOverlay = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="loading-overlay">
            <div className="loader"></div>
        </div>
    );
};

export default LoadingOverlay;
