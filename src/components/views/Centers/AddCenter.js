import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './AddCenter.css';
import { useLoading } from '../../../context/LoadingContext';
import axios from 'axios';
import { API_CONFIG } from '../../../config';
import {AuthContext} from "../../../context/AuthContext";


const AddCenterForm = () => {
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [externalId, setExternalId] = useState('');
    const [submittedOn, setSubmittedOn] = useState(new Date().toISOString().split('T')[0]);
    const [groupSearch, setGroupSearch] = useState('');
    const [addedGroups, setAddedGroups] = useState([]);
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

    const handleAddGroup = () => {
        if (groupSearch && !addedGroups.includes(groupSearch)) {
            setAddedGroups([...addedGroups, groupSearch]);
            setGroupSearch('');
        }
    };

    const handleRemoveGroup = (group) => {
        setAddedGroups(addedGroups.filter((g) => g !== group));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            name,
            office,
            staff,
            isActive,
            externalId,
            submittedOn,
            addedGroups,
        });
        navigate('/centers');
    };

    const handleCancel = () => {
        navigate('/centers');
    };

    return (
        <div className="form-container-client add-center-form">
            <div className="with-indicator">
                <form className="client-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Name <span>*</span></label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Center Name"
                                required
                            />
                        </div>

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
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Staff <span>*</span></label>
                            <select value={staff} onChange={(e) => setStaff(e.target.value)} required>
                                <option value="">-- Select Staff --</option>
                                {staffs.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                        {staff.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group client-search-group">
                            <label>Groups</label>
                            <div className="client-search-container">
                                <input
                                    type="text"
                                    value={groupSearch}
                                    onChange={(e) => setGroupSearch(e.target.value)}
                                    placeholder="Search Groups by Name or ID"
                                    className="client-search-input"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddGroup}
                                    className="add-client-button"
                                >
                                    Add Group
                                </button>
                            </div>

                            <div className="added-clients">
                                <ul>
                                    {addedGroups.map((group, index) => (
                                        <li key={index}>
                                            {group}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveGroup(group)}
                                                className="remove-client-button"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>External ID</label>
                            <input
                                type="text"
                                value={externalId}
                                onChange={(e) => setExternalId(e.target.value)}
                                placeholder="Enter External ID"
                            />
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
                    <div className="form-group checkbox-group">
                        <div className="checkbox">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                            <label>Active</label>
                        </div>
                    </div>

                    <div className="navigation-buttons">
                        <button type="button" onClick={handleCancel} className="back-button">Cancel</button>
                        <button type="submit" className="next-button">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCenterForm;
