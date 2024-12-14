import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { API_CONFIG } from '../../../../../config';
import axios from 'axios';
import './RolesForm.css';

const RoleForm = ({ setActiveTab, onRolesUpdate }) => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Role name is required.');
            return;
        }

        try {
            const response = await axios.post(
                `${API_CONFIG.baseURL}/roles`,
                { name, description },
                {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Role Created:', response.data);

            onRolesUpdate();

            setActiveTab('viewRoles');
        } catch (err) {
            console.error('Error creating role:', err);
            setError('Failed to create role. Please try again.');
        }
    };

    const handleCancel = () => {
        setActiveTab('viewRoles');
    };

    return (
        <div className="code-form-container">
            <h3 className="form-title">Add a New Role</h3>
            <form className="code-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="roleName">Role Name <span className="required">*</span></label>
                    <input
                        type="text"
                        id="roleName"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError('');
                        }}
                        placeholder="Enter role name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter role description"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="code-form-buttons">
                    <span onClick={handleCancel} className="cancel-button">Cancel</span>
                    <button type="submit" className="submit-button">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default RoleForm;
