import React, { useContext, useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { API_CONFIG } from '../../config';
import { AuthContext } from "../../context/AuthContext";
import { useLoading } from '../../context/LoadingContext';
import './AddAccountingRule.css';

const AddAccountingRule = () => {
    const [step, setStep] = useState(1);
    const [offices, setOffices] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [accountingRuleData, setAccountingRuleData] = useState({
        name: '',
        office: '',
        description: '',
        debitAccount: '',
        creditAccount: '',
        allowMultipleDebits: false,
        allowMultipleCredits: false,
        debitRuleType: 'fixedAccount',
        creditRuleType: 'fixedAccount',
        debitCheckbox: false,
        creditCheckbox: false,
        debitTag: false,
        creditTag: false,
    });

    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            startLoading();
            try {
                const headers = {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                };
                const [officesResponse, accountsResponse] = await Promise.all([
                    axios.get(`${API_CONFIG.baseURL}/offices`, { headers }),
                    axios.get(`${API_CONFIG.baseURL}/glaccounts`, { headers })
                ]);
                setOffices(officesResponse.data);
                setAccounts(accountsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                stopLoading();
            }
        };
        fetchData();
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAccountingRuleData({
            ...accountingRuleData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const goNext = () => setStep(step + 1);
    const goBack = () => setStep(step - 1);
    const handleCancel = () => navigate('/accounting');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Accounting Rule Data:", accountingRuleData);

        // Reset form fields and go back to the first step
        setAccountingRuleData({
            name: '',
            office: '',
            description: '',
            debitAccount: '',
            creditAccount: '',
            allowMultipleDebits: false,
            allowMultipleCredits: false,
            debitRuleType: 'fixedAccount',
            creditRuleType: 'fixedAccount',
            debitCheckbox: false,
            creditCheckbox: false,
            debitTag: false,
            creditTag: false,
        });
        setStep(1);
    };

    return (
        <div className=".form-container-accounting-rule">
            <div className="with-indicator">
                <div className="stage-indicator">
                    <div className={`stage ${step === 1 ? 'current' : step > 1 ? 'completed' : ''}`}
                         onClick={() => setStep(1)}>
                        <div className="circle"></div>
                        <span>Basic Info</span>
                    </div>
                    <div className={`stage ${step === 2 ? 'current' : step > 2 ? 'completed' : ''}`}
                         onClick={() => setStep(2)}>
                        <div className="circle"></div>
                        <span>Debit Details</span>
                    </div>
                    <div className={`stage ${step === 3 ? 'current' : step > 3 ? 'completed' : ''}`}
                         onClick={() => setStep(3)}>
                        <div className="circle"></div>
                        <span>Credit Details</span>
                    </div>
                    <div className={`stage ${step === 4 ? 'current' : ''}`}
                         onClick={() => setStep(4)}>
                        <div className="circle"></div>
                        <span>Review & Submit</span>
                    </div>
                </div>

                <form className="client-form">
                    {step === 1 && (
                        <>
                            <div className="form-row">
                                <div className="account-form-group">
                                    <label>Accounting Rule Name <span className="required-asterisk">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={accountingRuleData.name}
                                        onChange={handleChange}
                                        placeholder="Enter Rule Name"
                                    />
                                </div>
                                <div className="account-form-group">
                                    <label>Office <span className="required-asterisk">*</span></label>
                                    <select
                                        name="office"
                                        value={accountingRuleData.office}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Select Office --</option>
                                        {offices.map((office) => (
                                            <option key={office.id} value={office.id}>{office.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="account-form-group full-width">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={accountingRuleData.description}
                                    onChange={handleChange}
                                    className="description-textarea"
                                    placeholder="Enter Description"
                                />
                            </div>
                            <div className="navigation-buttons">
                                <button onClick={handleCancel} className="back-button">Cancel</button>
                                <button onClick={goNext} className="next-button">Next</button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="account-form-group">
                                <label>Debit Rule Type</label>
                                <div className="radio-group">
                                    <input
                                        type="radio"
                                        name="debitRuleType"
                                        value="fixedAccount"
                                        checked={accountingRuleData.debitRuleType === 'fixedAccount'}
                                        onChange={() => setAccountingRuleData({
                                            ...accountingRuleData,
                                            debitRuleType: 'fixedAccount',
                                            debitAccount: '',
                                            allowMultipleDebits: false,
                                        })}
                                    />
                                    <label>Fixed Account</label>
                                    <input
                                        type="radio"
                                        name="debitRuleType"
                                        value="listOfProducts"
                                        checked={accountingRuleData.debitRuleType === 'listOfProducts'}
                                        onChange={() => setAccountingRuleData({
                                            ...accountingRuleData,
                                            debitRuleType: 'listOfProducts',
                                            debitAccount: '',
                                        })}
                                    />
                                    <label>List of Products</label>
                                </div>
                            </div>

                            {accountingRuleData.debitRuleType === 'fixedAccount' && (
                                <div className="account-form-group">
                                    <label>Debit Account</label>
                                    <select
                                        name="debitAccount"
                                        value={accountingRuleData.debitAccount}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Select Debit Account --</option>
                                        {accounts.map((account) => (
                                            <option key={account.id} value={account.id}>{account.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {accountingRuleData.debitRuleType === 'listOfProducts' && (
                                <>
                                    <div className="account-form-checkbox">
                                        <label>Debit Tags</label>
                                        <div className="checkbox-group-row">
                                            <div className="checkbox-group">
                                                <input
                                                    type="checkbox"
                                                    name="debitCheckbox"
                                                    checked={accountingRuleData.debitCheckbox}
                                                    onChange={(e) => setAccountingRuleData({
                                                        ...accountingRuleData,
                                                        debitCheckbox: e.target.checked
                                                    })}
                                                />
                                                <label>Debit</label>
                                            </div>
                                            <div className="checkbox-group">
                                                <input
                                                    type="checkbox"
                                                    name="creditCheckbox"
                                                    checked={accountingRuleData.creditCheckbox}
                                                    onChange={(e) => setAccountingRuleData({
                                                        ...accountingRuleData,
                                                        creditCheckbox: e.target.checked
                                                    })}
                                                />
                                                <label>Credit</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="account-form-checkbox">
                                        <div className="checkbox-group">
                                            <input
                                                type="checkbox"
                                                name="allowMultipleDebits"
                                                checked={accountingRuleData.allowMultipleDebits}
                                                onChange={handleChange}
                                                className="manual-entries-checkbox"
                                            />
                                            <label className="manual-entries-label">Allow Multiple Debits</label>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="navigation-buttons">
                                <button onClick={goBack} className="back-button">Back</button>
                                <button onClick={goNext} className="next-button">Next</button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="account-form-group">
                                <label>Credit Rule Type</label>
                                <div className="radio-group">
                                    <input
                                        type="radio"
                                        name="creditRuleType"
                                        value="fixedAccount"
                                        checked={accountingRuleData.creditRuleType === 'fixedAccount'}
                                        onChange={() => setAccountingRuleData({
                                            ...accountingRuleData,
                                            creditRuleType: 'fixedAccount',
                                            creditAccount: '',
                                            allowMultipleCredits: false,
                                        })}
                                    />
                                    <label>Fixed Account</label>
                                    <input
                                        type="radio"
                                        name="creditRuleType"
                                        value="listOfAccounts"
                                        checked={accountingRuleData.creditRuleType === 'listOfAccounts'}
                                        onChange={() => setAccountingRuleData({
                                            ...accountingRuleData,
                                            creditRuleType: 'listOfAccounts',
                                            creditAccount: '',
                                        })}
                                    />
                                    <label>List of Accounts</label>
                                </div>
                            </div>

                            {accountingRuleData.creditRuleType === 'fixedAccount' && (
                                <div className="account-form-group">
                                    <label>Credit Account</label>
                                    <select
                                        name="creditAccount"
                                        value={accountingRuleData.creditAccount}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Select Credit Account --</option>
                                        {accounts.map((account) => (
                                            <option key={account.id} value={account.id}>{account.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {accountingRuleData.creditRuleType === 'listOfAccounts' && (
                                <>
                                    <div className="account-form-checkbox">
                                        <label>Credit Tags</label>
                                        <div className="checkbox-group-row">
                                            <div className="checkbox-group">
                                                <input
                                                    type="checkbox"
                                                    name="debitTag"
                                                    checked={accountingRuleData.debitTag}
                                                    onChange={(e) => setAccountingRuleData({
                                                        ...accountingRuleData,
                                                        debitTag: e.target.checked
                                                    })}
                                                />
                                                <label>Debit</label>
                                            </div>
                                            <div className="checkbox-group">
                                                <input
                                                    type="checkbox"
                                                    name="creditTag"
                                                    checked={accountingRuleData.creditTag}
                                                    onChange={(e) => setAccountingRuleData({
                                                        ...accountingRuleData,
                                                        creditTag: e.target.checked
                                                    })}
                                                />
                                                <label>Credit</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="account-form-checkbox">
                                        <div className="checkbox-group">
                                            <input
                                                type="checkbox"
                                                name="allowMultipleCredits"
                                                checked={accountingRuleData.allowMultipleCredits}
                                                onChange={handleChange}
                                                className="manual-entries-checkbox"
                                            />
                                            <label className="manual-entries-label">Allow Multiple Credits</label>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="navigation-buttons">
                            <button onClick={goBack} className="back-button">Back</button>
                                <button onClick={goNext} className="next-button">Next</button>
                            </div>
                        </>
                    )}

                    {step === 4 && (
                        <>

                            <h3 className="review-title">Review & Submit</h3>
                            <div className="review-section">
                                <div className="review-row">
                                    <p><strong>Rule Name:</strong> {accountingRuleData.name}</p>
                                    <p><strong>Office:</strong> {offices.find(o => o.id === parseInt(accountingRuleData.office))?.name || 'N/A'}</p>
                                    <p><strong>Description:</strong> {accountingRuleData.description}</p>
                                </div>
                                <div className="review-row">
                                    <p><strong>Debit Rule Type:</strong> {accountingRuleData.debitRuleType}</p>
                                    <p><strong>Debit Account:</strong> {accounts.find(a => a.id === parseInt(accountingRuleData.debitAccount))?.name || 'N/A'}</p>
                                    <p><strong>Allow Multiple Debits:</strong> {accountingRuleData.allowMultipleDebits ? 'Yes' : 'No'}</p>
                                    <p><strong>Debit Checkbox:</strong> {accountingRuleData.debitCheckbox ? 'Yes' : 'No'}</p>
                                    <p><strong>Credit Checkbox:</strong> {accountingRuleData.creditCheckbox ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="review-row">
                                    <p><strong>Credit Rule Type:</strong> {accountingRuleData.creditRuleType}</p>
                                    <p><strong>Credit Account:</strong> {accounts.find(a => a.id === parseInt(accountingRuleData.creditAccount))?.name || 'N/A'}</p>
                                    <p><strong>Allow Multiple Credits:</strong> {accountingRuleData.allowMultipleCredits ? 'Yes' : 'No'}</p>
                                    <p><strong>Debit Tag:</strong> {accountingRuleData.debitTag ? 'Yes' : 'No'}</p>
                                    <p><strong>Credit Tag:</strong> {accountingRuleData.creditTag ? 'Yes' : 'No'}</p>
                                </div>
                            </div>

                            <div className="navigation-buttons">
                                <button onClick={goBack} className="back-button">Back</button>
                                <button type="button" onClick={handleSubmit} className="submit-button">Submit</button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddAccountingRule;
