import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import './CreateUser.css';

const CreateUserForm = () => {
    const { user } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [autoGeneratePassword, setAutoGeneratePassword] = useState(false);
    const [overridePasswordExpiry, setOverridePasswordExpiry] = useState(false);
    const [offices, setOffices] = useState([]);
    const [office, setOffice] = useState('');
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [step, setStep] = useState(1);
    const [formIsValid, setFormIsValid] = useState(false);

    const validateForm = () => {
        const isValid = username.length >= 5 && firstName && lastName && email && office && selectedRoles.length > 0;
        setFormIsValid(isValid);
    };

    useEffect(() => {
        validateForm();
    }, [username, firstName, lastName, email, office, selectedRoles]);

    useEffect(() => {
        fetchTemplateData();
    }, []);

    const fetchTemplateData = async () => {
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/users/template`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setRoles(response.data.availableRoles);

            const officesResponse = await axios.get(`${API_CONFIG.baseURL}/offices`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setOffices(officesResponse.data || []);
        } catch (error) {
            console.error('Error fetching template data:', error);
        }
    };

    const goNext = () => setStep((prev) => prev + 1);
    const goBack = () => setStep((prev) => prev - 1);

    const handleSubmit = () => {
        const newUser = {
            username,
            firstname: firstName,
            lastname: lastName,
            email,
            autoGeneratePassword,
            overridePasswordExpiryPolicy: overridePasswordExpiry,
            roles: selectedRoles,
            officeId: office,
        };
        console.log('Submitting new user:', newUser);
    };

    return (
        <div className="form-container-user">
            <div className="with-indicator">
                <div className="stage-indicator">
                    <div className={`stage ${step === 1 ? 'current' : step > 1 ? 'completed' : ''}`} onClick={() => setStep(1)}>
                        <div className="circle"></div>
                        <span>Basic Info</span>
                    </div>
                    <div className={`stage ${step === 2 ? 'current' : step > 2 ? 'completed' : ''}`} onClick={() => setStep(2)}>
                        <div className="circle"></div>
                        <span>Settings</span>
                    </div>
                    <div className={`stage ${step === 3 ? 'current' : step > 3 ? 'completed' : ''}`} onClick={() => setStep(3)}>
                        <div className="circle"></div>
                        <span>Roles</span>
                    </div>
                    <div className={`stage ${step === 4 ? 'current' : ''}`} onClick={() => setStep(4)}>
                        <div className="circle"></div>
                        <span>Review & Submit</span>
                    </div>
                </div>

                <form className="user-form">
                    {step === 1 && (
                        <div className="form-section">
                            <label>
                                Username <span className="asterisk">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter username (min 5 characters)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                minLength="5"
                                required
                                className="form-input"
                            />
                            {username.length > 0 && username.length < 5 && (
                                <p className="error-message">Username must be at least 5 characters long</p>
                            )}

                            <label>
                                First Name <span className="asterisk">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="form-input"
                            />

                            <label>
                                Last Name <span className="asterisk">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="form-input"
                            />

                            <label>
                                Email <span className="asterisk">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-input"
                            />

                            <div className="navigation-buttons">
                                <button
                                    className="cancel-button"
                                    onClick={() => window.location.href = '/admin'}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={goNext}
                                    className="next-button"
                                    disabled={username.length < 5}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="form-section">
                            <label>
                                Office <span className="asterisk">*</span>
                            </label>
                            <select
                                value={office}
                                onChange={(e) => setOffice(e.target.value)}
                                required
                                className="form-input select-input office-select"
                            >
                                <option value="">-- Select Office --</option>
                                {offices.map((officeOption) => (
                                    <option key={officeOption.id} value={officeOption.id}>
                                        {officeOption.name}
                                    </option>
                                ))}
                            </select>

                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={autoGeneratePassword}
                                    onChange={() => setAutoGeneratePassword(!autoGeneratePassword)}
                                    className="checkbox-input"
                                />
                                <label>Auto Generate Password</label>
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={overridePasswordExpiry}
                                    onChange={() => setOverridePasswordExpiry(!overridePasswordExpiry)}
                                    className="checkbox-input"
                                />
                                <label>Override Password Expiry</label>
                            </div>

                            <div className="navigation-buttons">
                                <button onClick={goBack} className="cancel-button">Back</button>
                                <button onClick={goNext} className="next-button">Next</button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="form-section">
                            <label className="roles-label">Assign Roles</label>
                            <div className="roles-container">
                                {roles.map((role) => (
                                    <div key={role.id} className="checkbox-group role-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedRoles.includes(role.id)}
                                            onChange={() =>
                                                setSelectedRoles((prev) =>
                                                    prev.includes(role.id)
                                                        ? prev.filter((id) => id !== role.id)
                                                        : [...prev, role.id]
                                                )
                                            }
                                        />
                                        <span>{role.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="navigation-buttons">
                                <button onClick={goBack} className="back-button">Back</button>
                                <button onClick={goNext} className="next-button">Next</button>
                            </div>
                        </div>
                    )}
                    {step === 4 && (
                        <>
                            <h3>Review & Submit</h3>
                            <div className="form-section review-section">
                                <p><strong>Username:</strong> {username}</p>
                                <p><strong>First Name:</strong> {firstName}</p>
                                <p><strong>Last Name:</strong> {lastName}</p>
                                <p><strong>Email:</strong> {email}</p>
                                <p>
                                    <strong>Office:</strong> {offices.find((o) => o.id === parseInt(office))?.name || "N/A"}
                                </p>
                                <p><strong>Auto Generate Password:</strong> {autoGeneratePassword ? "Yes" : "No"}</p>
                                <p><strong>Override Password Expiry:</strong> {overridePasswordExpiry ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Roles:</strong> {selectedRoles.map(id => roles.find(role => role.id === id)?.name).join(', ') || "N/A"}
                                </p>

                            </div>
                            <div className="navigation-buttons">
                                <button onClick={goBack} className="back-button">Back</button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="submit-button"
                                    disabled={!formIsValid}
                                >
                                    Submit
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateUserForm;
