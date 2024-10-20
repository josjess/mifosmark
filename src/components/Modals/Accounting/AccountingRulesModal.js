import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext'; // Importing the loader context

const AccountingRulesModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [offices, setOffices] = useState([]);
    const [accountingRuleData, setAccountingRuleData] = useState({
        name: '',
        officeId: '',
        description: '',
        debitAccountId: '',
        creditAccountId: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        const fetchOffices = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                startLoading();
                const response = await fetch(`${API_BASE_URL}/offices`, { headers });
                const data = await response.json();
                setOffices(data);
            } catch (error) {
                console.error('Error fetching offices:', error);
                showNotification('Error fetching offices', 'error');
            } finally {
                stopLoading();
            }
        };
        fetchOffices();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccountingRuleData({ ...accountingRuleData, [name]: value });
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

        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();

        const payload = {
            name: accountingRuleData.name,
            officeId: parseInt(accountingRuleData.officeId),
            description: accountingRuleData.description,
            debitAccountId: accountingRuleData.debitAccountId,
            creditAccountId: accountingRuleData.creditAccountId,
            startDate: accountingRuleData.startDate,
            endDate: accountingRuleData.endDate,
            locale: 'en',
            dateFormat: 'dd MMMM yyyy',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/accountingrules`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Accounting rule created successfully!', 'success');
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
            <h2 className="modal-title">Create Accounting Rule</h2>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={accountingRuleData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    required
                />
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={accountingRuleData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                />
                <label>Office</label>
                <select
                    name="officeId"
                    value={accountingRuleData.officeId}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Office</option>
                    {offices.map((office) => (
                        <option key={office.id} value={office.id}>
                            {office.name}
                        </option>
                    ))}
                </select>
                <label>Debit Account ID</label>
                <input
                    type="text"
                    name="debitAccountId"
                    value={accountingRuleData.debitAccountId}
                    onChange={handleInputChange}
                    placeholder="Debit Account ID"
                    required
                />
                <label>Credit Account ID</label>
                <input
                    type="text"
                    name="creditAccountId"
                    value={accountingRuleData.creditAccountId}
                    onChange={handleInputChange}
                    placeholder="Credit Account ID"
                    required
                />
                <label>Start Date</label>
                <input
                    type="date"
                    name="startDate"
                    value={accountingRuleData.startDate}
                    onChange={handleInputChange}
                    required
                />
                <label>End Date</label>
                <input
                    type="date"
                    name="endDate"
                    value={accountingRuleData.endDate}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AccountingRulesModal;
