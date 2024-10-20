import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';

const FrequentPostingModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [glAccounts, setGLAccounts] = useState([]);
    const [frequentPostingData, setFrequentPostingData] = useState({
        glAccountDebitId: '',
        glAccountCreditId: '',
        amount: '',
        transactionDate: '',
        comments: '',
    });

    useEffect(() => {
        const fetchGLAccounts = async () => {
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
                setGLAccounts(data);
            } catch (error) {
                console.error('Error fetching GL accounts:', error);
                showNotification('Error fetching GL accounts', 'error');
            } finally {
                stopLoading();
            }
        };
        fetchGLAccounts();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFrequentPostingData({ ...frequentPostingData, [name]: value });
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
            glAccountDebitId: frequentPostingData.glAccountDebitId,
            glAccountCreditId: frequentPostingData.glAccountCreditId,
            amount: frequentPostingData.amount,
            transactionDate: frequentPostingData.transactionDate,
            comments: frequentPostingData.comments,
            locale: 'en',
            dateFormat: 'yyyy-MM-dd',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/frequentpostings`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Frequent posting created successfully!', 'success');
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
            <h2 className="modal-title">Create Frequent Posting</h2>
            <form onSubmit={handleSubmit}>
                <label>Debit GL Account</label>
                <select
                    name="glAccountDebitId"
                    value={frequentPostingData.glAccountDebitId}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Debit Account</option>
                    {glAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name} ({account.glCode})
                        </option>
                    ))}
                </select>

                <label>Credit GL Account</label>
                <select
                    name="glAccountCreditId"
                    value={frequentPostingData.glAccountCreditId}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Credit Account</option>
                    {glAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name} ({account.glCode})
                        </option>
                    ))}
                </select>

                <label>Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={frequentPostingData.amount}
                    onChange={handleInputChange}
                    placeholder="Amount"
                    required
                />

                <label>Transaction Date</label>
                <input
                    type="date"
                    name="transactionDate"
                    value={frequentPostingData.transactionDate}
                    onChange={handleInputChange}
                    required
                />

                <label>Comments</label>
                <input
                    type="text"
                    name="comments"
                    value={frequentPostingData.comments}
                    onChange={handleInputChange}
                    placeholder="Comments (Optional)"
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default FrequentPostingModal;
