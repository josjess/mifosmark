import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext'; // Importing the loader context

const JournalEntriesModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [glAccounts, setGLAccounts] = useState([]);
    const [journalEntryData, setJournalEntryData] = useState({
        glAccountDebitId: '',
        glAccountCreditId: '',
        amount: '',
        transactionDate: '',
        comments: '',
        currencyCode: 'USD',
        officeId: '',
    });

    const [offices, setOffices] = useState([]);

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

        fetchGLAccounts();
        fetchOffices();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJournalEntryData({ ...journalEntryData, [name]: value });
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
            glAccountDebitId: journalEntryData.glAccountDebitId,
            glAccountCreditId: journalEntryData.glAccountCreditId,
            amount: journalEntryData.amount,
            transactionDate: journalEntryData.transactionDate,
            comments: journalEntryData.comments,
            currencyCode: journalEntryData.currencyCode,
            officeId: journalEntryData.officeId,
            locale: 'en',
            dateFormat: 'yyyy-MM-dd',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/journalentries`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Journal entry created successfully!', 'success');
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
            <h2 className="modal-title">Create Journal Entry</h2>
            <form onSubmit={handleSubmit}>
                <label>Office</label>
                <select
                    name="officeId"
                    value={journalEntryData.officeId}
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

                <label>Debit GL Account</label>
                <select
                    name="glAccountDebitId"
                    value={journalEntryData.glAccountDebitId}
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
                    value={journalEntryData.glAccountCreditId}
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
                    value={journalEntryData.amount}
                    onChange={handleInputChange}
                    placeholder="Amount"
                    required
                />

                <label>Transaction Date</label>
                <input
                    type="date"
                    name="transactionDate"
                    value={journalEntryData.transactionDate}
                    onChange={handleInputChange}
                    required
                />

                <label>Comments</label>
                <input
                    type="text"
                    name="comments"
                    value={journalEntryData.comments}
                    onChange={handleInputChange}
                    placeholder="Comments (Optional)"
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default JournalEntriesModal;
