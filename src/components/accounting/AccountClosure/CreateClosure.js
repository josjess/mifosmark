import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { useLoading } from '../../../context/LoadingContext';
import { API_CONFIG } from '../../../config';
import './CreateClosure.css';

const CreateClosure = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [office, setOffice] = useState('');
    const [closingDate, setClosingDate] = useState('');
    const [comments, setComments] = useState('');
    const [offices, setOffices] = useState([]);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchOffices();
    }, []);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form fields
        const errors = {};
        if (!office) errors.office = 'Office is required';
        if (!closingDate) errors.closingDate = 'Closing Date is required';
        if (!comments) errors.comments = 'Comments are required';

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            console.log("New closure created:", { office, closingDate, comments });

            // Logic for submitting data, e.g., posting to an API

            // Reset form fields after successful submission
            setOffice('');
            setClosingDate('');
            setComments('');
        }
    };

    return (
        <div className="form-container-closure">
            <h2 className="closure-form-title">Create Account Closure</h2>
            <form onSubmit={handleSubmit} className="closure-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Office <span>*</span></label>
                        <select
                            value={office}
                            onChange={(e) => setOffice(e.target.value)}
                            required
                        >
                            <option value="">Select Office</option>
                            {offices.map((office) => (
                                <option key={office.id} value={office.name}>
                                    {office.name}
                                </option>
                            ))}
                        </select>
                        {formErrors.office && <span className="error-text">{formErrors.office}</span>}
                    </div>
                    <div className="form-group">
                        <label>Closing Date <span>*</span></label>
                        <input
                            type="date"
                            value={closingDate}
                            onChange={(e) => setClosingDate(e.target.value)}
                            required
                        />
                        {formErrors.closingDate && <span className="error-text">{formErrors.closingDate}</span>}
                    </div>
                </div>
                <div className="form-group full-width">
                    <label>Comments <span>*</span></label>
                    <textarea
                        rows="3"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Comments"
                        required
                    ></textarea>
                    {formErrors.comments && <span className="error-text">{formErrors.comments}</span>}
                </div>
                <div className="navigation-buttons">
                    <button type="submit" className="submit-button">Create Closure</button>
                </div>
            </form>
        </div>
    );
};

export default CreateClosure;
