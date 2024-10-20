import React, { useContext, useEffect } from 'react';
import './Modal.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Modal = ({ showModal, closeModal, children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!showModal || !isAuthenticated) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="close-button">
                    <span className="modal-close" onClick={closeModal}>Close</span>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
