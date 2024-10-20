import React, { useState, useContext, useEffect } from 'react';
import Modal from '../../Modal';
import { API_CONFIG } from '../../../config';
import { useLoading } from '../../../context/LoadingContext';
import { AuthContext } from '../../../context/AuthContext';

const SetupUserModal = ({ showModal, closeModal }) => {
    const { startLoading, stopLoading } = useLoading();
    const { user } = useContext(AuthContext);

    const [offices, setOffices] = useState([]);
    const [roles, setRoles] = useState([]);

    const [userData, setUserData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        officeId: '',
        staffId: '',
        roles: [],
        sendPasswordToEmail: true,
    });

    useEffect(() => {
        const fetchOfficesAndRoles = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;
            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                startLoading();
                // Fetching Offices
                const officeResponse = await fetch(`${API_BASE_URL}/offices`, { headers });
                const officeData = await officeResponse.json();
                setOffices(officeData);

                // Fetching Roles
                const rolesResponse = await fetch(`${API_BASE_URL}/roles`, { headers });
                const roleData = await rolesResponse.json();
                setRoles(roleData);

            } catch (error) {
                console.error('Error fetching offices/roles:', error);
            } finally {
                stopLoading();
            }
        };
        fetchOfficesAndRoles();
    }, [user]);

    const handleInputChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (roleId) => {
        const updatedRoles = userData.roles.includes(roleId)
            ? userData.roles.filter((id) => id !== roleId)
            : [...userData.roles, roleId];
        setUserData({ ...userData, roles: updatedRoles });
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
            username: userData.username,
            firstname: userData.firstName,
            lastname: userData.lastName,
            email: userData.email,
            officeId: parseInt(userData.officeId),
            staffId: userData.staffId ? parseInt(userData.staffId) : null,
            roles: userData.roles,
            sendPasswordToEmail: userData.sendPasswordToEmail,
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                alert(`Error: ${errorData.message}`);
            } else {
                alert('User created successfully!');
                closeModal();
            }
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            stopLoading();
        }
    };

    return (
        <Modal showModal={showModal} closeModal={closeModal}>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    required
                />
                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                />
                <label>Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                />
                <label>Office</label>
                <select
                    name="officeId"
                    value={userData.officeId}
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

                <label>Staff ID (Optional)</label>
                <input
                    type="text"
                    name="staffId"
                    value={userData.staffId}
                    onChange={handleInputChange}
                />

                <label>Select Roles</label>
                <div className="role-selection">
                    {roles.map((role) => (
                        <label key={role.id}>
                            <input
                                type="checkbox"
                                value={role.id}
                                checked={userData.roles.includes(role.id)}
                                onChange={() => handleRoleChange(role.id)}
                            />
                            {role.name}
                        </label>
                    ))}
                </div>

                <label>Send Password to Email</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="sendPasswordToEmail"
                            value={true}
                            checked={userData.sendPasswordToEmail === true}
                            onChange={() => setUserData({ ...userData, sendPasswordToEmail: true })}
                        />
                        Yes
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="sendPasswordToEmail"
                            value={false}
                            checked={userData.sendPasswordToEmail === false}
                            onChange={() => setUserData({ ...userData, sendPasswordToEmail: false })}
                        />
                        No
                    </label>
                </div>

                <button type="submit">Create User</button>
            </form>
        </Modal>
    );
};

export default SetupUserModal;
