import React, { useState, useEffect, useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import './BulkLoanReassignment.css';

const BulkLoanReassignment = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    const [offices, setOffices] = useState([]);
    const [loanOfficers, setLoanOfficers] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [selectedLoanOfficer, setSelectedLoanOfficer] = useState('');
    const [assignmentDate, setAssignmentDate] = useState(getDefaultDate());
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        fetchOffices();
    }, []);

    useEffect(() => {
        setIsFormValid(selectedOffice && selectedLoanOfficer && assignmentDate);
    }, [selectedOffice, selectedLoanOfficer, assignmentDate]);

    const fetchOffices = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/offices`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setOffices(response.data || []);
        } catch (error) {
            console.error('Error fetching offices:', error);
        } finally {
            stopLoading();
        }
    };

    const fetchLoanOfficers = async (officeId) => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/staff?officeId=${officeId}`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setLoanOfficers(response.data || []);
        } catch (error) {
            console.error('Error fetching loan officers:', error);
        } finally {
            stopLoading();
        }
    };

    const handleOfficeChange = (e) => {
        const selectedOfficeId = e.target.value;
        setSelectedOffice(selectedOfficeId);
        setLoanOfficers([]);
        setSelectedLoanOfficer('');
        if (selectedOfficeId) {
            fetchLoanOfficers(selectedOfficeId);
        }
    };

    const handleDateChange = (e) => {
        const inputDate = new Date(e.target.value);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (inputDate > yesterday) {
            setAssignmentDate(getDefaultDate());
            alert('No future dates unfortunately! Yesterday and backwards!');
        } else {
            setAssignmentDate(e.target.value);
        }
    };


    const handleCancel = () => {
        navigate('/organization');
    };

    const handleSubmit = async () => {
        startLoading();
        try {
            const payload = {
                officeId: selectedOffice,
                loanOfficerId: selectedLoanOfficer,
                assignmentDate,
                locale: 'en',
            };
            await axios.post(`${API_CONFIG.baseURL}/loans/loanreassignment`, payload, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            alert('Bulk loan reassignment successful!');
            navigate('/organization');
        } catch (error) {
            console.error('Error submitting loan reassignment:', error);
        } finally {
            stopLoading();
        }
    };

    function getDefaultDate() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }

    return (
        <div className="bulk-loan-reassignment-page">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Bulk Loan Reassignment
            </h2>
            <div className="bulk-loan-reassignment-form-container">
                <div className="bulk-loan-reassignment-field">
                    <label htmlFor="officeSelect" className="bulk-loan-reassignment-label">Office</label>
                    <select
                        id="officeSelect"
                        value={selectedOffice}
                        onChange={handleOfficeChange}
                        className="bulk-loan-reassignment-select"
                    >
                        <option value="">Select Office</option>
                        {offices.map((office) => (
                            <option key={office.id} value={office.id}>
                                {office.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="bulk-loan-reassignment-field">
                    <label htmlFor="assignmentDate" className="bulk-loan-reassignment-label">Assignment Date</label>
                    <input
                        type="date"
                        id="assignmentDate"
                        value={assignmentDate}
                        onChange={handleDateChange}
                        max={getDefaultDate()}
                        className="bulk-loan-reassignment-input"
                    />
                </div>
                <div className="bulk-loan-reassignment-field">
                    <label htmlFor="loanOfficerSelect" className="bulk-loan-reassignment-label">To Loan Officer</label>
                    <select
                        id="loanOfficerSelect"
                        value={selectedLoanOfficer}
                        onChange={(e) => setSelectedLoanOfficer(e.target.value)}
                        className="bulk-loan-reassignment-select"
                        disabled={!loanOfficers.length}
                    >
                        <option value="">Select Loan Officer</option>
                        {loanOfficers.map((officer) => (
                            <option key={officer.id} value={officer.id}>
                                {officer.displayName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="bulk-loan-reassignment-actions">
                    <button
                        className="bulk-loan-reassignment-cancel-btn"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="bulk-loan-reassignment-submit-btn"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkLoanReassignment;
