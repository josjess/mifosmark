import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';

const ManageOfficesModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();

    const [offices, setOffices] = useState([]);
    const [officeData, setOfficeData] = useState({
        name: '',
        openingDate: '',
        parentId: '',
        externalId: '',
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
        setOfficeData({ ...officeData, [name]: value });
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
            name: officeData.name,
            openingDate: officeData.openingDate,
            parentId: officeData.parentId ? parseInt(officeData.parentId) : null,
            externalId: officeData.externalId,
            locale: 'en',
            dateFormat: 'yyyy-MM-dd',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/offices`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Office created successfully!', 'success');
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
            <h2 className="modal-title">Manage Offices</h2>
            <form onSubmit={handleSubmit}>
                <label>Office Name</label>
                <input
                    type="text"
                    name="name"
                    value={officeData.name}
                    onChange={handleInputChange}
                    placeholder="Office Name"
                    required
                />
                <label>Opening Date</label>
                <input
                    type="date"
                    name="openingDate"
                    value={officeData.openingDate}
                    onChange={handleInputChange}
                    required
                />
                <label>Parent Office (Optional)</label>
                <select
                    name="parentId"
                    value={officeData.parentId}
                    onChange={handleInputChange}
                >
                    <option value="">Select Parent Office</option>
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
                    value={officeData.externalId}
                    onChange={handleInputChange}
                    placeholder="External ID"
                />
                <button type="submit">Submit</button>
            </form>

            <h3>Existing Offices</h3>
            <table className="offices-table">
                <thead>
                <tr>
                    <th>Office Name</th>
                    <th>Opening Date</th>
                    <th>Parent Office</th>
                </tr>
                </thead>
                <tbody>
                {offices.length > 0 ? (
                    offices.map((office) => (
                        <tr key={office.id}>
                            <td>{office.name}</td>
                            <td>{office.openingDate}</td>
                            <td>{office.parentName ? office.parentName : 'None'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">No offices available.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ManageOfficesModal;
