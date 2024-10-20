import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';

const CentersModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();

    const [offices, setOffices] = useState([]);
    const [centerData, setCenterData] = useState({
        name: '',
        officeId: '',
        externalId: '',
        staffId: '',
        activationDate: '',
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
        setCenterData({ ...centerData, [name]: value });
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
            officeId: parseInt(centerData.officeId),
            name: centerData.name,
            externalId: centerData.externalId || null,
            staffId: centerData.staffId || null,
            activationDate: `${day} ${month} ${year}`,
            locale: 'en',
            dateFormat: 'dd MMMM yyyy',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/centers`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Center created successfully!', 'success');
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
            <h2 className="modal-title">Create New Center</h2>
            <form onSubmit={handleSubmit}>
                <label>Center Name</label>
                <input
                    type="text"
                    name="name"
                    value={centerData.name}
                    onChange={handleInputChange}
                    placeholder="Center Name"
                    required
                />
                <label>Office</label>
                <select
                    name="officeId"
                    value={centerData.officeId}
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

                <label>External ID</label>
                <input
                    type="text"
                    name="externalId"
                    value={centerData.externalId}
                    onChange={handleInputChange}
                    placeholder="External ID (Optional)"
                />

                <label>Staff ID</label>
                <input
                    type="text"
                    name="staffId"
                    value={centerData.staffId}
                    onChange={handleInputChange}
                    placeholder="Staff ID (Optional)"
                />

                <label>Activation Date</label>
                <input
                    type="date"
                    name="activationDate"
                    value={centerData.activationDate}
                    onChange={handleInputChange}
                    required
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CentersModal;
