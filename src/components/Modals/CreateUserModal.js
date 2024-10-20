import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { API_CONFIG } from '../../config';
import { NotificationContext } from '../../context/NotificationContext';
import './CreateUserModal.css';

const CreateUserModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const [roles, setRoles] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        officeId: '',
        roles: [],
    });

    useEffect(() => {
        const fetchRoles = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user?.base64EncodedAuthenticationKey;

            if (!AUTH_TOKEN) {
                showNotification('Authorization token is missing', 'error');
                return;
            }

            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                const response = await fetch(`${API_BASE_URL}/roles`, {
                    method: 'GET',
                    headers: headers,
                });

                if (!response.ok) {
                    console.error(`Error fetching roles: ${response.statusText}`);
                }

                const data = await response.json();
                if (!data) {
                    showNotification('No roles found', 'warning');
                    return;
                }
                setRoles(data);
            } catch (error) {
                showNotification('Error fetching roles', 'error');
                console.error('Error fetching roles:', error);
            }
        };
        fetchRoles();
    }, [user, showNotification]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleRoleSelection = (roleId) => {
        setUserData((prevState) => {
            const selectedRoles = [...prevState.roles];
            if (selectedRoles.includes(roleId)) {
                return { ...prevState, roles: selectedRoles.filter((id) => id !== roleId) };
            } else {
                return { ...prevState, roles: [...selectedRoles, roleId] };
            }
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

        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                showNotification('User created successfully!', 'success');
                closeModal();
            } else {
                const errorData = await response.json();
                showNotification(`Error: ${errorData.message}`, 'error');
            }
        } catch (error) {
            showNotification('Error connecting to API', 'error');
        }
    };

    return (
        <div>
            <h2 className="modal-title">Create New User</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                />
                <input
                    type="text"
                    name="officeId"
                    value={userData.officeId}
                    onChange={handleInputChange}
                    placeholder="Office ID"
                    required
                />
                <h4>Select Roles</h4>
                <div className="role-container">
                    <div className="role-grid">
                        {roles.length > 0 ? (
                            roles.map((role) => (
                                <div key={role.id} className="role-item">
                                    <input
                                        type="checkbox"
                                        id={`role-${role.id}`}
                                        value={role.id}
                                        checked={userData.roles.includes(role.id)}
                                        onChange={() => handleRoleSelection(role.id)}
                                    />
                                    <label htmlFor={`role-${role.id}`}>{role.name}</label>
                                </div>
                            ))
                        ) : (
                            <p>Loading roles...</p>
                        )}
                    </div>
                </div>

                <button type="submit">Create User</button>
            </form>
        </div>
    );
};

export default CreateUserModal;
