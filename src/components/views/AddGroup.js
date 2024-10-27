import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './AddGroup.css';
import { useLoading } from '../../context/LoadingContext';
import axios from 'axios';
import { API_CONFIG } from '../../config';
import {AuthContext} from "../../context/AuthContext";


const AddGroupForm = () => {
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(false);
    // const [clients, setClients] = useState([]);
    const [clientSearch, setClientSearch] = useState('');
    const [addedClients, setAddedClients] = useState([]);
    const [externalId, setExternalId] = useState('');
    const [submittedOn, setSubmittedOn] = useState(new Date().toISOString().split('T')[0]);
    const [offices, setOffices] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [office, setOffice] = useState('');
    const [staff, setStaff] = useState('');
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();
    const { startLoading, stopLoading } = useLoading();

    useEffect(() => {
        const fetchData = async () => {
            startLoading();

            try {
                const headers = {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                };

                const officeResponse = await axios.get(`${API_CONFIG.baseURL}/offices`, { headers });
                setOffices(officeResponse.data);

                const staffResponse = await axios.get(`${API_CONFIG.baseURL}/staff`, { headers });
                setStaffs(staffResponse.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                stopLoading();
            }
        };

        fetchData().then();
        // eslint-disable-next-line
    }, []);

    const isFormComplete = office && name && staff;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            office,
            name,
            staff,
            isActive,
            clients: addedClients,
            externalId,
            submittedOn,
        });
        navigate('/groups');
    };

    const handleCancel = () => {
        navigate('/groups');
    };

    const handleAddClient = () => {
        if (clientSearch && !addedClients.includes(clientSearch)) {
            setAddedClients([...addedClients, clientSearch]);
            setClientSearch('');
        }
    };

    const handleRemoveClient = (index) => {
        setAddedClients(addedClients.filter((_, i) => i !== index));
    };

    return (
        <div className="form-container-client add-group-form">
            <h2>Add Group</h2>

            <div className="with-indicator">
                <form className="client-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Office <span>*</span></label>
                            <select value={office} onChange={(e) => setOffice(e.target.value)} required>
                                <option value="">-- Select Office --</option>
                                {offices.map((office) => (
                                    <option key={office.id} value={office.id}>
                                        {office.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Staff <span>*</span></label>
                            <select value={staff} onChange={(e) => setStaff(e.target.value)} required>
                                <option value="">-- Select Staff --</option>
                                {staffs && staffs.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                        {staff.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Name <span>*</span></label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Group Name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>External ID</label>
                            <input
                                type="text"
                                value={externalId}
                                onChange={(e) => setExternalId(e.target.value)}
                                placeholder="Enter External ID"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group client-search-group">
                            <label>Clients</label>
                            <div className="client-search-container">
                                <input
                                    type="text"
                                    value={clientSearch}
                                    onChange={(e) => setClientSearch(e.target.value)}
                                    placeholder="Search clients by Name or ID"
                                    className="client-search-input"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddClient}
                                    className="add-client-button"
                                >
                                    Add Client
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Submitted On</label>
                            <input
                                type="date"
                                value={submittedOn}
                                onChange={(e) => setSubmittedOn(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="checkbox">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="checkbox-input"
                            />
                            <label>Activate</label>
                        </div>
                    </div>

                    {addedClients.length > 0 && (
                        <div className="added-clients">
                            <h4>Added Clients</h4>
                            <ul>
                                {addedClients.map((client, index) => (
                                    <li key={index}>
                                        {client}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveClient(index)}
                                            className="remove-client-button"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="navigation-buttons">
                        <button
                            type="submit"
                            className="submit-button"
                            onClick={handleSubmit}
                            disabled={!isFormComplete}
                        >
                            Submit
                        </button>
                        <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGroupForm;
