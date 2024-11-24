import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import './Accruals.css';
import {useNavigate} from "react-router-dom";

const AccrualForm = ({ onSubmitSuccess }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [accrueUntil, setAccrueUntil] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${API_CONFIG.baseURL}/runaccruals`,
                { accrueUntil },
                {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Accrual submitted successfully:', response.data);
            onSubmitSuccess(response.data);
            navigate('/accounting');
        } catch (error) {
            console.error('Error submitting accrual:', error);
        }
    };

    return (
        <form className="accrual-form-container" onSubmit={handleSubmit}>
            <div className="accrual-form-group">
                <label className="accrual-form-label">Accrue Until:</label>
                <input
                    type="date"
                    value={accrueUntil}
                    onChange={(e) => setAccrueUntil(e.target.value)}
                    className="accrual-form-date-input"
                />
            </div>
            <div className="accrual-form-actions">
                <div className="accrual-form-button accrual-form-submit" onClick={handleSubmit}>Run Periodic Accruals
                </div>
                <div
                    className="accrual-form-button accrual-form-cancel"
                    onClick={() => navigate('/accounting')}
                >
                    Cancel
                </div>
            </div>
        </form>
    );
};

export default AccrualForm;
