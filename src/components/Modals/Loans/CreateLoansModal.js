import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext'; // Importing the loader context

const CreateLoansModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [loanData, setLoanData] = useState({
        clientId: '',
        loanProductId: '',
        principal: '',
        numberOfRepayments: '',
        repaymentFrequency: '',
        interestRate: '',
        loanTermFrequency: '',
        loanTermFrequencyType: '',
        submittedOnDate: '',
    });

    const [clients, setClients] = useState([]); // Initialize as an empty array
    const [loanProducts, setLoanProducts] = useState([]); // Initialize as an empty array

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

                // Ensure the response contains an array
                if (Array.isArray(clientsData)) {
                    setClients(clientsData);
                } else {
                    setClients([]); // Default to empty array if not an array
                }

                // Fetch loan products
                const productsResponse = await fetch(`${API_BASE_URL}/loanproducts`, { headers });
                const productsData = await productsResponse.json();

                // Ensure the response contains an array
                if (Array.isArray(productsData)) {
                    setLoanProducts(productsData);
                } else {
                    setLoanProducts([]); // Default to empty array if not an array
                }

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

        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();

        const payload = {
            clientId: loanData.clientId,
            productId: loanData.loanProductId,
            principal: parseFloat(loanData.principal),
            numberOfRepayments: parseInt(loanData.numberOfRepayments),
            interestRatePerPeriod: parseFloat(loanData.interestRate),
            repaymentFrequencyType: loanData.repaymentFrequency,
            loanTermFrequency: loanData.loanTermFrequency,
            loanTermFrequencyType: loanData.loanTermFrequencyType,
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

                <label>Principal</label>
                <input
                    type="number"
                    name="principal"
                    value={loanData.principal}
                    onChange={handleInputChange}
                    placeholder="Principal"
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

                <label>Interest Rate</label>
                <input
                    type="number"
                    name="interestRate"
                    value={loanData.interestRate}
                    onChange={handleInputChange}
                    placeholder="Interest Rate (%)"
                    required
                />

                <label>Repayment Frequency</label>
                <input
                    type="text"
                    name="repaymentFrequency"
                    value={loanData.repaymentFrequency}
                    onChange={handleInputChange}
                    placeholder="Repayment Frequency"
                    required
                />

                <label>Loan Term Frequency</label>
                <input
                    type="number"
                    name="loanTermFrequency"
                    value={loanData.loanTermFrequency}
                    onChange={handleInputChange}
                    placeholder="Loan Term Frequency"
                    required
                />

                <label>Loan Term Frequency Type</label>
                <input
                    type="text"
                    name="loanTermFrequencyType"
                    value={loanData.loanTermFrequencyType}
                    onChange={handleInputChange}
                    placeholder="Loan Term Frequency Type"
                    required
                />

                <label>Submitted On Date</label>
                <input
                    type="date"
                    name="submittedOnDate"
                    value={loanData.submittedOnDate}
                    onChange={handleInputChange}
                    required
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateLoansModal;
