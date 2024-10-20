import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';

const ProvisioningEntriesModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();

    const [provisioningData, setProvisioningData] = useState({
        officeId: '',
        provisioningDate: '',
        provisioningAmount: '',
        accountId: '',
        notes: ''
    });

    const [offices, setOffices] = useState([]);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchOfficesAndAccounts = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                startLoading();
                // Fetching Offices
                const officeResponse = await fetch(`${API_BASE_URL}/offices`, { headers });
                const officeData = await officeResponse.json();
                setOffices(officeData);

                // Fetching Accounts
                const accountResponse = await fetch(`${API_BASE_URL}/glaccounts`, { headers });
                const accountData = await accountResponse.json();
                setAccounts(accountData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showNotification('Error fetching data', 'error');
            } finally {
                stopLoading();
            }
        };

        fetchOfficesAndAccounts();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProvisioningData({ ...provisioningData, [name]: value });
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
            officeId: parseInt(provisioningData.officeId),
            provisioningDate: provisioningData.provisioningDate,
            provisioningAmount: parseFloat(provisioningData.provisioningAmount),
            accountId: parseInt(provisioningData.accountId),
            notes: provisioningData.notes || null,
            locale: 'en',
            dateFormat: 'yyyy-MM-dd',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/provisioningentries`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Provisioning entry created successfully!', 'success');
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
            <h2 className="modal-title">Create Provisioning Entry</h2>
            <form onSubmit={handleSubmit}>
                <label>Office</label>
                <select
                    name="officeId"
                    value={provisioningData.officeId}
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

                <label>Provisioning Date</label>
                <input
                    type="date"
                    name="provisioningDate"
                    value={provisioningData.provisioningDate}
                    onChange={handleInputChange}
                    required
                />

                <label>Provisioning Amount</label>
                <input
                    type="number"
                    name="provisioningAmount"
                    value={provisioningData.provisioningAmount}
                    onChange={handleInputChange}
                    placeholder="Provisioning Amount"
                    required
                />

                <label>Account</label>
                <select
                    name="accountId"
                    value={provisioningData.accountId}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name} ({account.glCode})
                        </option>
                    ))}
                </select>

                <label>Notes (Optional)</label>
                <input
                    type="text"
                    name="notes"
                    value={provisioningData.notes}
                    onChange={handleInputChange}
                    placeholder="Notes"
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ProvisioningEntriesModal;
