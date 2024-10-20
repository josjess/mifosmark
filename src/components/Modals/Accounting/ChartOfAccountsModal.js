import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';

const ChartOfAccountsModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();

    const [chartData, setChartData] = useState({
        name: '',
        glCode: '',
        parentId: '',
        description: '',
        type: '',
        usage: '',
        manualEntriesAllowed: false,
    });

    const [parentAccounts, setParentAccounts] = useState([]);

    useEffect(() => {
        const fetchParentAccounts = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                startLoading();
                const response = await fetch(`${API_BASE_URL}/glaccounts`, { headers });
                const data = await response.json();
                setParentAccounts(data);
            } catch (error) {
                console.error('Error fetching GL accounts:', error);
                showNotification('Error fetching GL accounts', 'error');
            } finally {
                stopLoading();
            }
        };
        fetchParentAccounts();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setChartData({
            ...chartData,
            [name]: type === 'checkbox' ? checked : value,
        });
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
            name: chartData.name,
            glCode: chartData.glCode,
            parentId: chartData.parentId ? parseInt(chartData.parentId) : null,
            description: chartData.description,
            type: chartData.type,
            usage: chartData.usage,
            manualEntriesAllowed: chartData.manualEntriesAllowed,
            locale: 'en',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/glaccounts`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('GL Account created successfully!', 'success');
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
            <h2 className="modal-title">Create Chart of Account</h2>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={chartData.name}
                    onChange={handleInputChange}
                    placeholder="Account Name"
                    required
                />
                <label>GL Code</label>
                <input
                    type="text"
                    name="glCode"
                    value={chartData.glCode}
                    onChange={handleInputChange}
                    placeholder="GL Code"
                    required
                />
                <label>Parent Account</label>
                <select
                    name="parentId"
                    value={chartData.parentId}
                    onChange={handleInputChange}
                >
                    <option value="">Select Parent Account (Optional)</option>
                    {parentAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name}
                        </option>
                    ))}
                </select>
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={chartData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                />
                <label>Type</label>
                <select
                    name="type"
                    value={chartData.type}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="ASSET">Asset</option>
                    <option value="LIABILITY">Liability</option>
                    <option value="EQUITY">Equity</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>
                <label>Usage</label>
                <select
                    name="usage"
                    value={chartData.usage}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Usage</option>
                    <option value="DETAIL">Detail</option>
                    <option value="HEADER">Header</option>
                </select>
                <label>
                    <input
                        type="checkbox"
                        name="manualEntriesAllowed"
                        checked={chartData.manualEntriesAllowed}
                        onChange={handleInputChange}
                    />
                    Manual Entries Allowed
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ChartOfAccountsModal;
