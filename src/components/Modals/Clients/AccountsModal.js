import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext'; // Importing the loader context

const AccountsModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [clients, setClients] = useState([]);
    const [accountData, setAccountData] = useState({
        clientId: '',
        accountNumber: '',
        accountType: '',
        balance: '',
        status: '',
    });

    useEffect(() => {
        const fetchClients = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                startLoading();
                const response = await fetch(`${API_BASE_URL}/clients`, { headers });
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error('Error fetching clients:', error);
                showNotification('Error fetching clients', 'error');
            } finally {
                stopLoading();
            }
        };
        fetchClients();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccountData({ ...accountData, [name]: value });
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
            clientId: accountData.clientId,
            accountNumber: accountData.accountNumber,
            accountType: accountData.accountType,
            balance: parseFloat(accountData.balance),
            status: accountData.status,
            locale: 'en',
            dateFormat: 'dd MMMM yyyy',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/accounts`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Account created successfully!', 'success');
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
            <h2 className="modal-title">Create New Account</h2>
            <form onSubmit={handleSubmit}>
                <label>Client</label>
                <select
                    name="clientId"
                    value={accountData.clientId}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.displayName}
                        </option>
                    ))}
                </select>

                <label>Account Number</label>
                <input
                    type="text"
                    name="accountNumber"
                    value={accountData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Account Number"
                    required
                />

                <label>Account Type</label>
                <select
                    name="accountType"
                    value={accountData.accountType}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Account Type</option>
                    <option value="savings">Savings</option>
                    <option value="checking">Checking</option>
                </select>

                <label>Balance</label>
                <input
                    type="number"
                    name="balance"
                    value={accountData.balance}
                    onChange={handleInputChange}
                    placeholder="Balance"
                    required
                />

                <label>Status</label>
                <select
                    name="status"
                    value={accountData.status}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AccountsModal;
