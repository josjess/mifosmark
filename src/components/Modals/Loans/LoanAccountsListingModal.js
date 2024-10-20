import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';
import './LoanAccountsListingModal.css';

const LoanAccountsListingModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();

    const [loanAccounts, setLoanAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoanAccounts = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                startLoading();
                const response = await fetch(`${API_BASE_URL}/loans`, { headers });
                if (!response.ok) {
                    throw new Error('Failed to fetch loan accounts');
                }
                const data = await response.json();
                setLoanAccounts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching loan accounts:', error);
                setError('Unable to load loan accounts. Please try again later.');
                showNotification('Error fetching loan accounts', 'error');
                setLoading(false);
            } finally {
                stopLoading();
            }
        };

        fetchLoanAccounts();
    }, [user]);

    return (
        <div>
            <h2 className="modal-title">Loan Accounts Listing</h2>

            {loading && <div className="loading">Loading loan accounts...</div>} {/* Loading spinner */}

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <table className="loan-accounts-table">
                    <thead>
                    <tr>
                        <th>Account ID</th>
                        <th>Client Name</th>
                        <th>Loan Product</th>
                        <th>Principal</th>
                        <th>Interest Rate</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loanAccounts.length > 0 ? (
                        loanAccounts.map((loan) => (
                            <tr key={loan.id}>
                                <td>{loan.accountNo}</td>
                                <td>{loan.clientName}</td>
                                <td>{loan.loanProductName}</td>
                                <td>{loan.principal}</td>
                                <td>{loan.interestRatePerPeriod}%</td>
                                <td>{loan.status.value}</td>
                                <td>
                                    <button onClick={() => alert(`Viewing loan ${loan.accountNo}`)}>View</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-data">No loan accounts available.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}

            <button onClick={closeModal} className="close-modal-btn">Close</button>
        </div>
    );
};

export default LoanAccountsListingModal;
