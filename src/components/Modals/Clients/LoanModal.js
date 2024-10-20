import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext'; // Importing the loader context

const LoanModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [loanData, setLoanData] = useState({
        clientId: '',
        loanAmount: '',
        loanTermFrequency: '',
        loanTermFrequencyType: '',
        loanProductId: '',
        interestRatePerPeriod: '',
        repaymentFrequencyType: '',
        numberOfRepayments: '',
        amortizationType: '',
        interestType: '',
        interestCalculationPeriodType: '',
        expectedDisbursementDate: '',
        submittedOnDate: '',
    });

    const [clients, setClients] = useState([]);
    const [loanProducts, setLoanProducts] = useState([]);

    useEffect(() => {
        const fetchClientsAndProducts = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                startLoading();
                // Fetch clients
                const clientsResponse = await fetch(`${API_BASE_URL}/clients`, { headers });
                const clientsData = await clientsResponse.json();
                setClients(clientsData);

                // Fetch loan products
                const productsResponse = await fetch(`${API_BASE_URL}/loanproducts`, { headers });
                const productsData = await productsResponse.json();
                setLoanProducts(productsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showNotification('Error fetching data', 'error');
            } finally {
                stopLoading();
            }
        };

        fetchClientsAndProducts();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoanData({ ...loanData, [name]: value });
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
            clientId: loanData.clientId,
            loanProductId: loanData.loanProductId,
            principal: parseFloat(loanData.loanAmount),
            loanTermFrequency: parseInt(loanData.loanTermFrequency),
            loanTermFrequencyType: parseInt(loanData.loanTermFrequencyType),
            numberOfRepayments: parseInt(loanData.numberOfRepayments),
            repaymentEvery: 1,
            repaymentFrequencyType: parseInt(loanData.repaymentFrequencyType),
            interestRatePerPeriod: parseFloat(loanData.interestRatePerPeriod),
            amortizationType: parseInt(loanData.amortizationType),
            interestType: parseInt(loanData.interestType),
            interestCalculationPeriodType: parseInt(loanData.interestCalculationPeriodType),
            expectedDisbursementDate: loanData.expectedDisbursementDate,
            submittedOnDate: loanData.submittedOnDate,
            dateFormat: 'dd MMMM yyyy',
            locale: 'en',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/loans`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Loan created successfully!', 'success');
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
            <h2 className="modal-title">Create Loan</h2>
            <form onSubmit={handleSubmit}>
                <label>Client</label>
                <select
                    name="clientId"
                    value={loanData.clientId}
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

                <label>Loan Product</label>
                <select
                    name="loanProductId"
                    value={loanData.loanProductId}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Loan Product</option>
                    {loanProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>

                <label>Loan Amount</label>
                <input
                    type="number"
                    name="loanAmount"
                    value={loanData.loanAmount}
                    onChange={handleInputChange}
                    placeholder="Loan Amount"
                    required
                />

                <label>Interest Rate</label>
                <input
                    type="number"
                    name="interestRatePerPeriod"
                    value={loanData.interestRatePerPeriod}
                    onChange={handleInputChange}
                    placeholder="Interest Rate (%)"
                    required
                />

                <label>Number of Repayments</label>
                <input
                    type="number"
                    name="numberOfRepayments"
                    value={loanData.numberOfRepayments}
                    onChange={handleInputChange}
                    placeholder="Number of Repayments"
                    required
                />

                <label>Expected Disbursement Date</label>
                <input
                    type="date"
                    name="expectedDisbursementDate"
                    value={loanData.expectedDisbursementDate}
                    onChange={handleInputChange}
                    required
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default LoanModal;
