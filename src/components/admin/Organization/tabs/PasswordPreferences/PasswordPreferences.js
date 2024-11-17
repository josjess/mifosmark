import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import './PasswordPreferences.css';

const PasswordPreferences = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [preferences, setPreferences] = useState([]);
    const [selectedPreference, setSelectedPreference] = useState(null);
    const [initialPreference, setInitialPreference] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPasswordPreferences();
    }, []);

    const fetchPasswordPreferences = async () => {
        startLoading();
        try {
            const response = await axios.get(
                `${API_CONFIG.baseURL}/passwordpreferences/template`,
                {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                        'Content-Type': 'application/json',
                    },
                }
            );
            const preferencesData = response.data || [];
            setPreferences(preferencesData);
            const activePreference = preferencesData.find((p) => p.active);
            if (activePreference) {
                setSelectedPreference(activePreference.id);
                setInitialPreference(activePreference.id);
            }
        } catch (error) {
            console.error('Error fetching password preferences:', error);
        } finally {
            stopLoading();
        }
    };

    const handlePreferenceChange = (id) => {
        setSelectedPreference(id);
    };

    const handleCancel = () => {
        navigate('/organization');
    };

    const handleSubmit = async () => {
        startLoading();
        try {
            const payload = { validationPolicyId: selectedPreference };
            await axios.put(`${API_CONFIG.baseURL}/passwordpreferences`, payload, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            alert('Password preference updated successfully!');
            navigate('/organization');
        } catch (error) {
            console.error('Error updating password preference:', error);
        } finally {
            stopLoading();
        }
    };

    return (
        <div className="password-preferences-screen">
            <h2 className="page-heading">
                <a href="/organization" className="breadcrumb-link">Organization</a> . Password Preferences
            </h2>
            <div className="preferences-form-container">
                <fieldset className="preferences-fieldset">
                    <legend>Select a Password Policy</legend>
                    {preferences.map((preference) => (
                        <div key={preference.id} className="preferences-option">
                            <input
                                type="radio"
                                id={`preference-${preference.id}`}
                                name="passwordPreference"
                                value={preference.id}
                                checked={selectedPreference === preference.id}
                                onChange={() => handlePreferenceChange(preference.id)}
                            />
                            <label htmlFor={`preference-${preference.id}`}>
                                {preference.description}
                            </label>
                        </div>
                    ))}
                </fieldset>
                <div className="preferences-actions">
                    <button className="preferences-cancel-btn" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button
                        className="preferences-submit-btn"
                        onClick={handleSubmit}
                        disabled={selectedPreference === initialPreference}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordPreferences;
