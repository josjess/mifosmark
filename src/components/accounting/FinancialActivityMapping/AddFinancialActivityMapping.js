import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { useLoading } from '../../../context/LoadingContext';
import { API_CONFIG } from '../../../config';
import './AddFinancialActivityMapping.css';

const AddFinancialActivityMappingForm = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [financialActivity, setFinancialActivity] = useState('');
    const [account, setAccount] = useState('');
    const [financialActivities, setFinancialActivities] = useState([]);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchTemplateData = async () => {
            startLoading();
            try {
                const response = await axios.get(`${API_CONFIG.baseURL}/financialactivityaccounts/template`, {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                        'Content-Type': 'application/json',
                    },
                });
                // console.log('Template Data:', response.data);

                setFinancialActivities(response.data.financialActivityOptions || []);

                const allAccounts = [
                    ...(response.data.glAccountOptions.assetAccountOptions || []),
                    ...(response.data.glAccountOptions.liabilityAccountOptions || []),
                    ...(response.data.glAccountOptions.equityAccountOptions || []),
                    ...(response.data.glAccountOptions.incomeAccountOptions || []),
                    ...(response.data.glAccountOptions.expenseAccountOptions || []),
                ];

                setAccounts(allAccounts);
            } catch (error) {
                console.error('Error fetching template data:', error);
            } finally {
                stopLoading();
            }
        };
        fetchTemplateData();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        startLoading();

        const newMappingData = {
            financialActivityId: financialActivity,
            glAccountId: account,
        };

        try {
            const response = await axios.post(`${API_CONFIG.baseURL}/financialactivityaccounts`, newMappingData, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            console.log('New Mapping Created:', response.data);
            setFinancialActivity('');
            setAccount('');
        } catch (error) {
            console.error('Error creating financial activity mapping:', error);
        } finally {
            stopLoading();
        }
    };

    return (
        <div className="form-container-mapping">
            <h2 className="mapping-form-title">Add Financial Activity Mapping</h2>
            <form onSubmit={handleSubmit} className="mapping-form">
                <div className="mapping-form-group">
                    <label>Financial Activity <span className="required-asterisk">*</span></label>
                    <select
                        value={financialActivity}
                        onChange={(e) => setFinancialActivity(e.target.value)}
                        required
                    >
                        <option value="">Select Financial Activity</option>
                        {financialActivities.map((activity) => (
                            <option key={activity.id} value={activity.id}>
                                {activity.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mapping-form-group">
                    <label>Account <span className="required-asterisk">*</span></label>
                    <select
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        required
                    >
                        <option value="">Select Account</option>
                        {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                                {acc.name} - {acc.glCode}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="submit-button-mapping">Create Mapping</button>
            </form>
        </div>
    );
};

export default AddFinancialActivityMappingForm;
