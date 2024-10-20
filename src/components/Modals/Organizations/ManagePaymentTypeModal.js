import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext'; // Importing the loader context

const ManagePaymentTypesModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [paymentTypes, setPaymentTypes] = useState([]);
    const [paymentTypeData, setPaymentTypeData] = useState({
        name: '',
        description: '',
        position: '',
    });

    useEffect(() => {
        const fetchPaymentTypes = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                startLoading();
                const response = await fetch(`${API_BASE_URL}/paymenttypes`, { headers });
                const data = await response.json();
                setPaymentTypes(data);
            } catch (error) {
                console.error('Error fetching payment types:', error);
                showNotification('Error fetching payment types', 'error');
            } finally {
                stopLoading();
            }
        };

        fetchPaymentTypes();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentTypeData({ ...paymentTypeData, [name]: value });
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
            name: paymentTypeData.name,
            description: paymentTypeData.description,
            position: parseInt(paymentTypeData.position),
            locale: 'en',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/paymenttypes`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Payment type created successfully!', 'success');
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
            <h2 className="modal-title">Manage Payment Types</h2>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={paymentTypeData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    required
                />
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={paymentTypeData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                />
                <label>Position</label>
                <input
                    type="number"
                    name="position"
                    value={paymentTypeData.position}
                    onChange={handleInputChange}
                    placeholder="Position"
                    required
                />
                <button type="submit">Submit</button>
            </form>

            <h3>Existing Payment Types</h3>
            <table className="funds-table">
                <thead>
                <tr>
                    <th>Payment Type Name</th>
                    <th>Description</th>
                    <th>Position</th>
                </tr>
                </thead>
                <tbody>
                {paymentTypes.length > 0 ? (
                    paymentTypes.map((paymentType) => (
                        <tr key={paymentType.id}>
                            <td>{paymentType.name}</td>
                            <td>{paymentType.description}</td>
                            <td>{paymentType.position}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">No payment types available.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ManagePaymentTypesModal;
