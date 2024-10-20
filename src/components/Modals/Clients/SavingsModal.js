import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';

const SavingsModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();

    const [savingsData, setSavingsData] = useState({
        clientId: '',
        productId: '',
        submittedOnDate: '',
        savingsAmount: '',
        interestRate: '',
        depositFrequency: '',
        minRequiredOpeningBalance: '',
    });

    const [clients, setClients] = useState([]);
    const [savingsProducts, setSavingsProducts] = useState([]);
    const [loading, setLoading] = useState(true);  // Loading state

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
                setClients(clientsData && Array.isArray(clientsData) ? clientsData : []); // Ensure it's an array

                // Fetch savings products
                const productsResponse = await fetch(`${API_BASE_URL}/savingsproducts`, { headers });
                const productsData = await productsResponse.json();
                setSavingsProducts(productsData && Array.isArray(productsData) ? productsData : []); // Ensure it's an array
            } catch (error) {
                console.error('Error fetching data:', error);
                showNotification('Error fetching data', 'error');
            } finally {
                stopLoading();
                setLoading(false);  // Stop the loading once the data is fetched
            }
        };

        fetchClientsAndProducts();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSavingsData({ ...savingsData, [name]: value });
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
            clientId: savingsData.clientId,
            productId: savingsData.productId,
            nominalAnnualInterestRate: parseFloat(savingsData.interestRate),
            minRequiredOpeningBalance: parseFloat(savingsData.minRequiredOpeningBalance),
            savingsAmount: parseFloat(savingsData.savingsAmount),
            submittedOnDate: savingsData.submittedOnDate,
            dateFormat: 'dd MMMM yyyy',
            locale: 'en',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/savingsaccounts`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Savings account created successfully!', 'success');
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
            <h2 className="modal-title">Create Savings Account</h2>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>Client</label>
                    <select
                        name="clientId"
                        value={savingsData.clientId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Client</option>
                        {clients.length > 0 ? (
                            clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.displayName}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No clients available</option>
                        )}
                    </select>

                    <label>Savings Product</label>
                    <select
                        name="productId"
                        value={savingsData.productId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Savings Product</option>
                        {savingsProducts.length > 0 ? (
                            savingsProducts.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No savings products available</option>
                        )}
                    </select>

                    <label>Savings Amount</label>
                    <input
                        type="number"
                        name="savingsAmount"
                        value={savingsData.savingsAmount}
                        onChange={handleInputChange}
                        placeholder="Savings Amount"
                        required
                    />

                    <label>Interest Rate</label>
                    <input
                        type="number"
                        name="interestRate"
                        value={savingsData.interestRate}
                        onChange={handleInputChange}
                        placeholder="Interest Rate (%)"
                        required
                    />

                    <label>Minimum Required Opening Balance</label>
                    <input
                        type="number"
                        name="minRequiredOpeningBalance"
                        value={savingsData.minRequiredOpeningBalance}
                        onChange={handleInputChange}
                        placeholder="Min Opening Balance"
                        required
                    />

                    <label>Submitted On Date</label>
                    <input
                        type="date"
                        name="submittedOnDate"
                        value={savingsData.submittedOnDate}
                        onChange={handleInputChange}
                        required
                    />

                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default SavingsModal;
