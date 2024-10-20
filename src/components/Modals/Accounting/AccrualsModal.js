import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';

const AccrualsModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [offices, setOffices] = useState([]);
    const [accrualData, setAccrualData] = useState({
        officeId: '',
        description: '',
        expenseAmount: '',
        liabilityAmount: '',
        accrualDate: '',
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
        setAccrualData({ ...accrualData, [name]: value });
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
            officeId: parseInt(accrualData.officeId),
            description: accrualData.description,
            expenseAmount: parseFloat(accrualData.expenseAmount),
            liabilityAmount: parseFloat(accrualData.liabilityAmount),
            accrualDate: accrualData.accrualDate,
            locale: 'en',
            dateFormat: 'dd MMMM yyyy',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/accruals`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Accrual created successfully!', 'success');
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
            <h2 className="modal-title">Create Accrual</h2>
            <form onSubmit={handleSubmit}>
                <label>Office</label>
                <select
                    name="officeId"
                    value={accrualData.officeId}
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
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={accrualData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                />
                <label>Expense Amount</label>
                <input
                    type="number"
                    name="expenseAmount"
                    value={accrualData.expenseAmount}
                    onChange={handleInputChange}
                    placeholder="Expense Amount"
                    required
                />
                <label>Liability Amount</label>
                <input
                    type="number"
                    name="liabilityAmount"
                    value={accrualData.liabilityAmount}
                    onChange={handleInputChange}
                    placeholder="Liability Amount"
                    required
                />
                <label>Accrual Date</label>
                <input
                    type="date"
                    name="accrualDate"
                    value={accrualData.accrualDate}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AccrualsModal;
