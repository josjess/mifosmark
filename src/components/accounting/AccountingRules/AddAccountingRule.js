import React, { useContext, useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { API_CONFIG } from '../../../config';
import { AuthContext } from "../../../context/AuthContext";
import { useLoading } from '../../../context/LoadingContext';
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

    const [currentStage, setCurrentStage] = useState(0);
    const [completedStages, setCompletedStages] = useState(new Set());
    const [allStagesComplete, setAllStagesComplete] = useState(false);

    const { user } = useContext(AuthContext);
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
    const stages = [
        "Basic Information",
        "Debit Details",
        "Credit Details"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Accounting Rule Data:", accountingRuleData);

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

    const renderStageContent = () => {
        switch (stages[currentStage]) {
            case "Basic Information":
                return (
                    <div className="staged-form-basic-info">
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="name">
                                    Accounting Rule Name <span>*</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    value={accountingRuleData.name}
                                    onChange={handleChange}
                                    className="staged-form-input"
                                    placeholder="Enter Rule Name"
                                    required
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="office">
                                    Office <span>*</span>
                                </label>
                                <select
                                    id="office"
                                    name="office"
                                    value={accountingRuleData.office}
                                    onChange={handleChange}
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">-- Select Office --</option>
                                    {offices.map((office) => (
                                        <option key={office.id} value={office.id}>
                                            {office.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="staged-form-field">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={accountingRuleData.description}
                                onChange={handleChange}
                                className="staged-form-textarea"
                                placeholder="Enter Description"
                            ></textarea>
                        </div>
                    </div>
                );

            case "Debit Details":
                return (
                    <div className="staged-form-debit-details">
                        <div className="staged-form-field">
                            <label>Debit Rule Type</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="debitRuleType"
                                        value="fixedAccount"
                                        checked={accountingRuleData.debitRuleType === "fixedAccount"}
                                        onChange={() =>
                                            setAccountingRuleData({
                                                ...accountingRuleData,
                                                debitRuleType: "fixedAccount",
                                                debitAccount: "",
                                                allowMultipleDebits: false,
                                            })
                                        }
                                    />
                                    Fixed Account
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="debitRuleType"
                                        value="listOfProducts"
                                        checked={accountingRuleData.debitRuleType === "listOfProducts"}
                                        onChange={() =>
                                            setAccountingRuleData({
                                                ...accountingRuleData,
                                                debitRuleType: "listOfProducts",
                                                debitAccount: "",
                                            })
                                        }
                                    />
                                    List of Products
                                </label>
                            </div>
                        </div>
                        {accountingRuleData.debitRuleType === "fixedAccount" && (
                            <div className="staged-form-field">
                                <label htmlFor="debitAccount">Debit Account</label>
                                <select
                                    id="debitAccount"
                                    name="debitAccount"
                                    value={accountingRuleData.debitAccount}
                                    onChange={handleChange}
                                    className="staged-form-select"
                                >
                                    <option value="">-- Select Debit Account --</option>
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {accountingRuleData.debitRuleType === "listOfProducts" && (
                            <>
                                <div className="staged-form-field">
                                    <label>Debit Tags</label>
                                    <div className="checkbox-group-row">
                                        <div className="checkbox-group">
                                            <input
                                                type="checkbox"
                                                name="debitCheckbox"
                                                checked={accountingRuleData.debitCheckbox}
                                                onChange={(e) =>
                                                    setAccountingRuleData({
                                                        ...accountingRuleData,
                                                        debitCheckbox: e.target.checked,
                                                    })
                                                }
                                            />
                                            <label>Debit</label>
                                        </div>
                                        <div className="checkbox-group">
                                            <input
                                                type="checkbox"
                                                name="creditCheckbox"
                                                checked={accountingRuleData.creditCheckbox}
                                                onChange={(e) =>
                                                    setAccountingRuleData({
                                                        ...accountingRuleData,
                                                        creditCheckbox: e.target.checked,
                                                    })
                                                }
                                            />
                                            <label>Credit</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="staged-form-field">
                                    <input
                                        type="checkbox"
                                        name="allowMultipleDebits"
                                        checked={accountingRuleData.allowMultipleDebits}
                                        onChange={handleChange}
                                        className="manual-entries-checkbox"
                                    />
                                    <label>Allow Multiple Debits</label>
                                </div>
                            </>
                        )}
                    </div>
                );

            case "Credit Details":
                return (
                    <div className="staged-form-credit-details">
                        <div className="staged-form-field">
                            <label>Credit Rule Type</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="creditRuleType"
                                        value="fixedAccount"
                                        checked={accountingRuleData.creditRuleType === "fixedAccount"}
                                        onChange={() =>
                                            setAccountingRuleData({
                                                ...accountingRuleData,
                                                creditRuleType: "fixedAccount",
                                                creditAccount: "",
                                                allowMultipleCredits: false,
                                            })
                                        }
                                    />
                                    Fixed Account
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="creditRuleType"
                                        value="listOfAccounts"
                                        checked={accountingRuleData.creditRuleType === "listOfAccounts"}
                                        onChange={() =>
                                            setAccountingRuleData({
                                                ...accountingRuleData,
                                                creditRuleType: "listOfAccounts",
                                                creditAccount: "",
                                            })
                                        }
                                    />
                                    List of Accounts
                                </label>
                            </div>
                        </div>
                        {accountingRuleData.creditRuleType === "fixedAccount" && (
                            <div className="staged-form-field">
                                <label htmlFor="creditAccount">Credit Account</label>
                                <select
                                    id="creditAccount"
                                    name="creditAccount"
                                    value={accountingRuleData.creditAccount}
                                    onChange={handleChange}
                                    className="staged-form-select"
                                >
                                    <option value="">-- Select Credit Account --</option>
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {accountingRuleData.creditRuleType === "listOfAccounts" && (
                            <>
                                <div className="staged-form-field">
                                    <label>Credit Tags</label>
                                    <div className="checkbox-group-row">
                                        <div className="checkbox-group">
                                            <input
                                                type="checkbox"
                                                name="debitTag"
                                                checked={accountingRuleData.debitTag}
                                                onChange={(e) =>
                                                    setAccountingRuleData({
                                                        ...accountingRuleData,
                                                        debitTag: e.target.checked,
                                                    })
                                                }
                                            />
                                            <label>Debit</label>
                                        </div>
                                        <div className="checkbox-group">
                                            <input
                                                type="checkbox"
                                                name="creditTag"
                                                checked={accountingRuleData.creditTag}
                                                onChange={(e) =>
                                                    setAccountingRuleData({
                                                        ...accountingRuleData,
                                                        creditTag: e.target.checked,
                                                    })
                                                }
                                            />
                                            <label>Credit</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="staged-form-field">
                                    <input
                                        type="checkbox"
                                        name="allowMultipleCredits"
                                        checked={accountingRuleData.allowMultipleCredits}
                                        onChange={handleChange}
                                        className="manual-entries-checkbox"
                                    />
                                    <label>Allow Multiple Credits</label>
                                </div>
                            </>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    const renderPreviewSection = () => {
        const getOfficeName = () => {
            const officeObj = offices.find((o) => o.id === parseInt(accountingRuleData.office));
            return officeObj ? officeObj.name : "N/A";
        };

        const getAccountName = (accountId) => {
            const accountObj = accounts.find((a) => a.id === parseInt(accountId));
            return accountObj ? accountObj.name : "N/A";
        };

        const stageData = [
            {
                title: "Basic Info",
                data: {
                    "Accounting Rule Name": accountingRuleData.name || "N/A",
                    Office: getOfficeName(),
                    Description: accountingRuleData.description || "N/A",
                },
            },
            {
                title: "Debit Details",
                data:
                    accountingRuleData.debitRuleType === "fixedAccount"
                        ? {
                            "Debit Rule Type": "Fixed Account",
                            "Debit Account": getAccountName(accountingRuleData.debitAccount),
                            "Allow Multiple Debits": accountingRuleData.allowMultipleDebits ? "Yes" : "No",
                        }
                        : {
                            "Debit Rule Type": "List of Products",
                            "Debit Tags - Debit": accountingRuleData.debitCheckbox ? "Yes" : "No",
                            "Debit Tags - Credit": accountingRuleData.creditCheckbox ? "Yes" : "No",
                            "Allow Multiple Debits": accountingRuleData.allowMultipleDebits ? "Yes" : "No",
                        },
            },
            {
                title: "Credit Details",
                data:
                    accountingRuleData.creditRuleType === "fixedAccount"
                        ? {
                            "Credit Rule Type": "Fixed Account",
                            "Credit Account": getAccountName(accountingRuleData.creditAccount),
                            "Allow Multiple Credits": accountingRuleData.allowMultipleCredits ? "Yes" : "No",
                        }
                        : {
                            "Credit Rule Type": "List of Accounts",
                            "Credit Tags - Debit": accountingRuleData.debitTag ? "Yes" : "No",
                            "Credit Tags - Credit": accountingRuleData.creditTag ? "Yes" : "No",
                            "Allow Multiple Credits": accountingRuleData.allowMultipleCredits ? "Yes" : "No",
                        },
            },
        ];

        return (
            <div className="staged-form-preview-section">
                <h2 className="preview-header">Form Preview</h2>
                {stageData.map(({ title, data }) => (
                    <div key={title} className="staged-form-preview-block">
                        <div className="staged-form-preview-header">
                            <h4 className="preview-stage-title">{title}</h4>
                            <button
                                className="staged-form-edit-button"
                                onClick={() => setCurrentStage(stages.indexOf(title))}
                            >
                                Edit
                            </button>
                        </div>
                        {data && typeof data === "object" && !Array.isArray(data) ? (
                            <div className="staged-form-preview-table-wrapper">
                                <table className="staged-form-preview-table">
                                    <thead>
                                    <tr>
                                        <th>Field</th>
                                        <th>Value</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.entries(data).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{value || "N/A"}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="no-data-message">No data available for this section.</p>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderStageTracker = () => {
        return (
            <div className="staged-form-stage-tracker">
                {stages.map((stage, index) => (
                    <div
                        key={stage}
                        className={`staged-form-stage ${
                            index === currentStage
                                ? "staged-form-active"
                                : completedStages.has(stage)
                                    ? "staged-form-completed"
                                    : "staged-form-unvisited"
                        }`}
                        onClick={() => {
                            if (completedStages.has(stage) || index < currentStage) {
                                setCurrentStage(index);
                            }
                        }}
                    >
                        <span className="staged-form-stage-circle">{index + 1}</span>
                        <span className="staged-form-stage-label">{stage}</span>
                    </div>
                ))}
            </div>
        );
    };

    const handleNextStage = () => {
        if (currentStage < stages.length - 1) {
            setCompletedStages((prev) => {
                const updatedStages = new Set(prev);
                updatedStages.add(stages[currentStage]);
                return updatedStages;
            });
            setCurrentStage((prev) => prev + 1);
        }
    };

    const isStep1Complete = () => {
        return (
            accountingRuleData.name.trim() !== '' &&
            accountingRuleData.office.trim() !== '' &&
            accountingRuleData.description.trim() !== ''
        );
    };

    const isStep2Complete = () => {
        if (accountingRuleData.debitRuleType === 'fixedAccount') {
            return accountingRuleData.debitAccount.trim() !== '';
        }
        if (accountingRuleData.debitRuleType === 'listOfProducts') {
            return (
                accountingRuleData.debitCheckbox ||
                accountingRuleData.creditCheckbox
            );
        }
        return false;
    };

    const isStep3Complete = () => {
        if (accountingRuleData.creditRuleType === 'fixedAccount') {
            return accountingRuleData.creditAccount.trim() !== '';
        }
        if (accountingRuleData.creditRuleType === 'listOfAccounts') {
            return (
                accountingRuleData.debitTag ||
                accountingRuleData.creditTag
            );
        }
        return false;
    };


    return (
        <div className="form-container-accounting-rule">

            <div className="staged-form-add-accounting-rule">
                {renderStageTracker()}
                <div className="staged-form-stage-content">
                    {currentStage === stages.length - 1 ? renderPreviewSection() : renderStageContent()}


                    <div className="staged-form-stage-buttons">
                        <button
                            onClick={() => setCurrentStage((prev) => Math.max(prev - 1, 0))}
                            disabled={currentStage === 0}
                            className="staged-form-button-previous"
                        >
                            Previous
                        </button>
                        {currentStage < stages.length - 1 && (
                            <button
                                onClick={handleNextStage}
                                className="staged-form-button-next"
                                disabled={
                                    (currentStage === 0 && !isStep1Complete) ||
                                    (currentStage === 1 && !isStep2Complete) ||
                                    (currentStage === 2 && !isStep3Complete)
                                }
                            >
                                Next
                            </button>
                        )}
                        {currentStage === stages.length - 1 && (
                            <button onClick={handleSubmit} className="staged-form-button-next">
                                Submit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default AddAccountingRule;
