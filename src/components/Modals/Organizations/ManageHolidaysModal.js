import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';

const ManageHolidaysModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();

    const [holidays, setHolidays] = useState([]);
    const [holidayData, setHolidayData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        recurring: false,
    });

    // Fetch existing holidays
    useEffect(() => {
        const fetchHolidays = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                startLoading();
                const response = await fetch(`${API_BASE_URL}/holidays`, { headers });
                const data = await response.json();
                setHolidays(data);
            } catch (error) {
                console.error('Error fetching holidays:', error);
                showNotification('Error fetching holidays', 'error');
            } finally {
                stopLoading();
            }
        };

        fetchHolidays();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setHolidayData({
            ...holidayData,
            [name]: type === 'checkbox' ? checked : value,
        });
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
            name: holidayData.name,
            description: holidayData.description,
            fromDate: holidayData.startDate,
            toDate: holidayData.endDate,
            recurring: holidayData.recurring,
            locale: 'en',
            dateFormat: 'yyyy-MM-dd',
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/holidays`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Holiday created successfully!', 'success');
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
            <h2 className="modal-title">Manage Holidays</h2>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={holidayData.name}
                    onChange={handleInputChange}
                    placeholder="Holiday Name"
                    required
                />
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    value={holidayData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    required
                />
                <label>Start Date</label>
                <input
                    type="date"
                    name="startDate"
                    value={holidayData.startDate}
                    onChange={handleInputChange}
                    required
                />
                <label>End Date</label>
                <input
                    type="date"
                    name="endDate"
                    value={holidayData.endDate}
                    onChange={handleInputChange}
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        name="recurring"
                        checked={holidayData.recurring}
                        onChange={handleInputChange}
                    />
                    Recurring Holiday
                </label>
                <button type="submit">Submit</button>
            </form>

            <h3>Current Holidays</h3>
            <ul>
                {holidays.map((holiday) => (
                    <li key={holiday.id}>
                        {holiday.name} ({holiday.fromDate} - {holiday.toDate}) - Recurring: {holiday.recurring ? 'Yes' : 'No'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageHolidaysModal;
