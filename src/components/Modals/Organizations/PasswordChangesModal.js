import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';

const PasswordChangesModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();

    const [passwordData, setPasswordData] = useState({
        userId: '',
        newPassword: '',
        repeatPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const API_BASE_URL = API_CONFIG.baseURL;
        const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

        const headers = {
            'Authorization': `Basic ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
            'Fineract-Platform-TenantId': 'default',
        };

        if (passwordData.newPassword !== passwordData.repeatPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        const payload = {
            userId: parseInt(passwordData.userId),
            password: passwordData.newPassword,
            repeatPassword: passwordData.repeatPassword,
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/users/${passwordData.userId}/password`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Password changed successfully!', 'success');
                closeModal();
            }
        } catch (error) {
            showNotification('Error connecting to API', 'error');
            console.error('Error:', error);
        } finally {
            stopLoading();
        }
    };

    return (
        <div>
            <h2 className="modal-title">Change Password</h2>
            <form onSubmit={handleSubmit}>
                <label>User ID</label>
                <input
                    type="text"
                    name="userId"
                    value={passwordData.userId}
                    onChange={handleInputChange}
                    placeholder="Enter User ID"
                    required
                />
                <label>New Password</label>
                <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handleInputChange}
                    placeholder="New Password"
                    required
                />
                <label>Repeat Password</label>
                <input
                    type="password"
                    name="repeatPassword"
                    value={passwordData.repeatPassword}
                    onChange={handleInputChange}
                    placeholder="Repeat Password"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default PasswordChangesModal;
