import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { useLoading } from '../../../context/LoadingContext';
import { API_CONFIG } from '../../../config';
import './AddGLAccountForm.css';

const AddAccountForm = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [accountType, setAccountType] = useState('');
    const [parent, setParent] = useState('');
    const [glCode, setGlCode] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountUsage, setAccountUsage] = useState('');
    const [tag, setTag] = useState('');
    const [manualEntriesAllowed, setManualEntriesAllowed] = useState(true);
    const [description, setDescription] = useState('');

    const [accountTypes, setAccountTypes] = useState([]);
    const [parents, setParents] = useState([]);
    const [usageOptions, setUsageOptions] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchTemplateData = async () => {
            startLoading();
            try {
                const response = await axios.get(`${API_CONFIG.baseURL}/glaccounts/template?type=0`, {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                        'Content-Type': 'application/json',
                    },
                });
                // console.log('Template Data:', response.data);

                setAccountTypes(response.data.accountTypeOptions || []);
                setParents(
                    (response.data.assetHeaderAccountOptions || [])
                        .concat(response.data.liabilityHeaderAccountOptions || [])
                        .concat(response.data.equityHeaderAccountOptions || [])
                        .concat(response.data.incomeHeaderAccountOptions || [])
                );
                setUsageOptions(response.data.usageOptions || []);
                setTags(response.data.allowedIncomeTagOptions || []);
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

        const newAccountData = {
            type: accountType,
            parentId: parent,
            glCode: glCode,
            name: accountName,
            usage: accountUsage,
            tagId: tag,
            manualEntriesAllowed: manualEntriesAllowed,
            description: description,
        };

        try {
            const response = await axios.post(`${API_CONFIG.baseURL}/glaccounts`, newAccountData, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            // console.log('New Account Created:', response.data);

            setAccountType('');
            setParent('');
            setGlCode('');
            setAccountName('');
            setAccountUsage('');
            setTag('');
            setManualEntriesAllowed(true);
            setDescription('');
        } catch (error) {
            console.error('Error creating account:', error);
        } finally {
            stopLoading();
        }
    };

    return (
        <div className="form-container-account">
            <form onSubmit={handleSubmit} className="account-form">
                <div className="account-form-row">
                    <div className="account-form-group">
                        <label>Account Type <span className="required-asterisk">*</span></label>
                        <select value={accountType} onChange={(e) => setAccountType(e.target.value)} required>
                            <option value="">Select Account Type</option>
                            {accountTypes?.length > 0
                                ? accountTypes.map((type) => (
                                    <option key={type.id} value={type.value}>{type.value}</option>
                                ))
                                : <option value="" disabled>No options available</option>
                            }
                        </select>
                    </div>
                    <div className="account-form-group">
                        <label>Parent</label>
                        <select value={parent} onChange={(e) => setParent(e.target.value)}>
                            <option value="">Select Parent</option>
                            {parents?.length > 0
                                ? parents.map((parentOption) => (
                                    <option key={parentOption.id} value={parentOption.id}>
                                        {parentOption.name}
                                    </option>
                                ))
                                : <option value="" disabled>No options available</option>
                            }
                        </select>
                    </div>
                </div>
                <div className="account-form-row">
                    <div className="account-form-group">
                        <label>GL Code <span className="required-asterisk">*</span></label>
                        <input type="text" value={glCode} onChange={(e) => setGlCode(e.target.value)} required/>
                    </div>
                    <div className="account-form-group">
                        <label>Account Name <span className="required-asterisk">*</span></label>
                        <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
                    </div>
                </div>
                <div className="account-form-row">
                    <div className="account-form-group">
                        <label>Account Usage <span className="required-asterisk">*</span></label>
                        <select value={accountUsage} onChange={(e) => setAccountUsage(e.target.value)} required>
                            <option value="">Select Usage</option>
                            {usageOptions.map((usage) => (
                                <option key={usage.id} value={usage.value}>{usage.value}</option>
                            ))}
                        </select>
                    </div>
                    <div className="account-form-group">
                        <label>Tag</label>
                        <select value={tag} onChange={(e) => setTag(e.target.value)}>
                            <option value="">Select Tag</option>
                            {tags.map((tagOption) => (
                                <option key={tagOption.id} value={tagOption.id}>{tagOption.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="account-form-checkbox">
                    <div className="checkbox-group">
                        <label className="manual-entries-label"><input
                            type="checkbox"
                            checked={manualEntriesAllowed}
                            onChange={(e) => setManualEntriesAllowed(e.target.checked)}
                            className="manual-entries-checkbox"
                        />
                            Manual Entries Allowed</label>
                    </div>
                </div>
                <div className="account-form-group full-width">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="description-textarea"
                        placeholder="Enter account description here..."
                    ></textarea>
                </div>
                <button type="submit" className="submit-button-account">Create Account</button>
            </form>
        </div>
    );
};

export default AddAccountForm;
