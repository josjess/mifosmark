import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext';

const BranchSetupModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();

    const [branchData, setBranchData] = useState({
        name: '',
        externalId: '',
        openingDate: '',
        address: {
            street: '',
            city: '',
            postalCode: '',
            country: ''
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBranchData({ ...branchData, [name]: value });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setBranchData({
            ...branchData,
            address: { ...branchData.address, [name]: value },
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

        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();

        const payload = {
            name: branchData.name,
            externalId: branchData.externalId || null,
            openingDate: [day, month, year],
            address: branchData.address,
            locale: 'en',
            dateFormat: 'dd MMMM yyyy',
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
                showNotification('Branch created successfully!', 'success');
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
            <h2 className="modal-title">Branch Setup</h2>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={branchData.name}
                    onChange={handleInputChange}
                    placeholder="Branch Name"
                    required
                />
                <label>External ID</label>
                <input
                    type="text"
                    name="externalId"
                    value={branchData.externalId}
                    onChange={handleInputChange}
                    placeholder="External ID (Optional)"
                />
                <label>Opening Date</label>
                <input
                    type="date"
                    name="openingDate"
                    value={branchData.openingDate}
                    onChange={handleInputChange}
                    required
                />
                <h3>Address Details</h3>
                <label>Street</label>
                <input
                    type="text"
                    name="street"
                    value={branchData.address.street}
                    onChange={handleAddressChange}
                    placeholder="Street"
                    required
                />
                <label>City</label>
                <input
                    type="text"
                    name="city"
                    value={branchData.address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    required
                />
                <label>Postal Code</label>
                <input
                    type="text"
                    name="postalCode"
                    value={branchData.address.postalCode}
                    onChange={handleAddressChange}
                    placeholder="Postal Code"
                    required
                />
                <label>Country</label>
                <input
                    type="text"
                    name="country"
                    value={branchData.address.country}
                    onChange={handleAddressChange}
                    placeholder="Country"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default BranchSetupModal;
