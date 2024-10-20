import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext'; // Importing the loader context

const ManageFundsModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [funds, setFunds] = useState([]);
    const [newFundData, setNewFundData] = useState({
        name: '',
        externalId: ''
    });

    useEffect(() => {
        const fetchFunds = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                startLoading();
                const response = await fetch(`${API_BASE_URL}/funds`, { headers });
                const data = await response.json();
                setFunds(data);
            } catch (error) {
                console.error('Error fetching funds:', error);
                showNotification('Error fetching funds', 'error');
            } finally {
                stopLoading();
            }
        };

        fetchFunds();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFundData({ ...newFundData, [name]: value });
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

        const payload = {
            name: newFundData.name,
            externalId: newFundData.externalId || null,
            locale: 'en',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/funds`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Fund created successfully!', 'success');
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
            <h2 className="modal-title">Manage Funds</h2>
            <form onSubmit={handleSubmit}>
                <label>Fund Name</label>
                <input
                    type="text"
                    name="name"
                    value={newFundData.name}
                    onChange={handleInputChange}
                    placeholder="Fund Name"
                    required
                />
                <label>External ID</label>
                <input
                    type="text"
                    name="externalId"
                    value={newFundData.externalId}
                    onChange={handleInputChange}
                    placeholder="External ID (Optional)"
                />
                <button type="submit">Submit</button>
            </form>

            <h3>Existing Funds</h3>
            <table className="funds-table">
                <thead>
                <tr>
                    <th>Fund Name</th>
                    <th>External ID</th>
                </tr>
                </thead>
                <tbody>
                {funds.length > 0 ? (
                    funds.map((fund) => (
                        <tr key={fund.id}>
                            <td>{fund.name}</td>
                            <td>{fund.externalId ? fund.externalId : 'N/A'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="2">No funds available.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ManageFundsModal;
