import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { API_CONFIG } from '../../config';
import { NotificationContext } from '../../context/NotificationContext';
import { useLoading } from '../../context/LoadingContext'; // Importing the loader context

const CreateClientModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [offices, setOffices] = useState([]);
    const [clientData, setClientData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        mobileNumber: '',
        email: '',
        gender: '',
        externalId: '',
        officeId: '',
        staffId: '',
        savingsProductId: '',
        address: {
            street: '',
            city: '',
            postalCode: '',
            country: ''
        }
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
        setClientData({ ...clientData, [name]: value });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setClientData({
            ...clientData,
            address: { ...clientData.address, [name]: value },
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
            officeId: parseInt(clientData.officeId),
            firstname: clientData.firstName,
            lastname: clientData.lastName,
            active: true,
            activationDate: [day, month, year],
            dateOfBirth: clientData.dateOfBirth.split('-').reverse().join(' '),
            mobileNo: clientData.mobileNumber,
            genderId: clientData.gender === 'Male' ? 50 : 51,
            locale: 'en',
            dateFormat: 'dd MMMM yyyy',
            externalId: clientData.externalId || null,
            address: clientData.address
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/clients`, {
                method: 'POST',
                mode: 'no-cors',
                headers: headers,
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();
            console.log('Response Text:', responseText);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Client created successfully!', 'success');
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
            <h2 className="modal-title">Create New Client (KYC)</h2>
            <form onSubmit={handleSubmit}>
                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={clientData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                />
                <label>Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={clientData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                />
                <label>Date of Birth</label>
                <input
                    type="date"
                    name="dateOfBirth"
                    value={clientData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                />
                <label>Mobile Number</label>
                <input
                    type="text"
                    name="mobileNumber"
                    value={clientData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Mobile Number"
                    required
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={clientData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                />
                <label>Gender</label>
                <select
                    name="gender"
                    value={clientData.gender}
                    onChange={handleInputChange}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <label>Office</label>
                <select
                    name="officeId"
                    value={clientData.officeId}
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
                    value={clientData.externalId}
                    onChange={handleInputChange}
                    placeholder="External ID (Optional)"
                />
                <h3>Address Details</h3>
                <label>Street</label>
                <input
                    type="text"
                    name="street"
                    value={clientData.address.street}
                    onChange={handleAddressChange}
                    placeholder="Street"
                />
                <label>City</label>
                <input
                    type="text"
                    name="city"
                    value={clientData.address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                />
                <label>Postal Code</label>
                <input
                    type="text"
                    name="postalCode"
                    value={clientData.address.postalCode}
                    onChange={handleAddressChange}
                    placeholder="Postal Code"
                />
                <label>Country</label>
                <input
                    type="text"
                    name="country"
                    value={clientData.address.country}
                    onChange={handleAddressChange}
                    placeholder="Country"
                />
                <input
                    type="text"
                    name="staffId"
                    value={clientData.staffId}
                    onChange={handleInputChange}
                    placeholder="Staff ID (Optional)"
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateClientModal;
