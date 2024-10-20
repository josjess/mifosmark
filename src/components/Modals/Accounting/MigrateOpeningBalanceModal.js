import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';

const MigrateOpeningBalanceModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();

    const [openingBalanceData, setOpeningBalanceData] = useState({
        officeId: '',
        glAccountId: '',
        transactionDate: '',
        amount: '',
        currencyCode: 'USD',
        comments: '',
    });
    const [offices, setOffices] = useState([]);
    const [glAccounts, setGLAccounts] = useState([]);

    useEffect(() => {
        const fetchOfficesAndGLAccounts = async () => {
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

                // Fetching GL Accounts
                const glAccountResponse = await fetch(`${API_BASE_URL}/glaccounts`, { headers });
                const glAccountData = await glAccountResponse.json();
                setGLAccounts(glAccountData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showNotification('Error fetching data', 'error');
            } finally {
                stopLoading();
            }
        };

        fetchOfficesAndGLAccounts();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOpeningBalanceData({ ...openingBalanceData, [name]: value });
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
            officeId: parseInt(openingBalanceData.officeId),
            glAccountId: parseInt(openingBalanceData.glAccountId),
            transactionDate: openingBalanceData.transactionDate,
            amount: parseFloat(openingBalanceData.amount),
            currencyCode: openingBalanceData.currencyCode,
            comments: openingBalanceData.comments || null,
            locale: 'en',
            dateFormat: 'yyyy-MM-dd',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/glaccounts/openingbalance`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Opening balance migrated successfully!', 'success');
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
            <h2 className="modal-title">Migrate Opening Balance</h2>
            <form onSubmit={handleSubmit}>
                <label>Office</label>
                <select
                    name="officeId"
                    value={openingBalanceData.officeId}
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

                <label>GL Account</label>
                <select
                    name="glAccountId"
                    value={openingBalanceData.glAccountId}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select GL Account</option>
                    {glAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name} ({account.glCode})
                        </option>
                    ))}
                </select>

                <label>Transaction Date</label>
                <input
                    type="date"
                    name="transactionDate"
                    value={openingBalanceData.transactionDate}
                    onChange={handleInputChange}
                    required
                />

                <label>Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={openingBalanceData.amount}
                    onChange={handleInputChange}
                    placeholder="Amount"
                    required
                />

                <label>Comments (Optional)</label>
                <input
                    type="text"
                    name="comments"
                    value={openingBalanceData.comments}
                    onChange={handleInputChange}
                    placeholder="Comments"
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default MigrateOpeningBalanceModal;
