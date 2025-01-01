import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLoading } from "../../../context/LoadingContext";
import axios from "axios";
import { API_CONFIG } from "../../../config";
import { AuthContext } from "../../../context/AuthContext";
import DatePicker from "react-datepicker";

const AddJournalEntries = () => {
    const { user } = useContext(AuthContext);

    const [currentStage, setCurrentStage] = useState(0);
    const [completedStages, setCompletedStages] = useState(new Set(["Preview"]));
    const [allStagesComplete, setAllStagesComplete] = useState(false);

    const [offices, setOffices] = useState([]);
    const [office, setOffice] = useState("");
    const [routingCode, setRoutingCode] = useState("");
    const [receiptNumber, setReceiptNumber] = useState("");
    const [stages] = useState([
        "Basic Information",
        "Affected GL Entries",
        "Payment Details",
        "Preview",
    ]);

    const [currencies, setCurrencies] = useState([]);
    const [currency, setCurrency] = useState("");
    const [referenceNumber, setReferenceNumber] = useState("");

    const [transactionDate, setTransactionDate] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [chequeNumber, setChequeNumber] = useState("");
    const [bankNumber, setBankNumber] = useState("");
    const [comments, setComments] = useState("");

    const [debits, setDebits] = useState([{ type: "", amount: "" }]);
    const [credits, setCredits] = useState([{ type: "", amount: "" }]);
    const [accountingRules, setAccountingRules] = useState([]);

    const { startLoading, stopLoading } = useLoading();

    const isStep1Complete = office && currency && transactionDate;
    const isStep2Complete = debits[0].type && debits[0].amount && credits[0].type && credits[0].amount;

    useEffect(() => {
        const fetchData = async () => {
            startLoading();
            try {
                const headers = {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    "Fineract-Platform-TenantId": "default",
                    "Content-Type": "application/json",
                };

                const [officesResponse, currenciesResponse] = await Promise.all([
                    axios.get(`${API_CONFIG.baseURL}/offices`, { headers }),
                    axios.get(`${API_CONFIG.baseURL}/currencies`, { headers }),
                ]);

                setOffices(officesResponse.data);
                setCurrencies(currenciesResponse.data.selectedCurrencyOptions);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                stopLoading();
            }
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        const fetchAccountingRules = async () => {
            startLoading();
            try {
                const headers = {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    "Fineract-Platform-TenantId": "default",
                    "Content-Type": "application/json",
                };

                const response = await axios.get(
                    `${API_CONFIG.baseURL}/accountingrules?associations=all`,
                    { headers }
                );
                setAccountingRules(response.data);
            } catch (error) {
                console.error("Error fetching accounting rules:", error);
            } finally {
                stopLoading();
            }
        };

        fetchAccountingRules();
    }, [user]);


    useEffect(() => {
        setAllStagesComplete(completedStages.size === stages.length - 1);
    }, [completedStages, stages.length]);

    const handleNextStage = () => {
        if (currentStage < stages.length - 1) {
            setCompletedStages((prev) => {
                const updatedStages = new Set(prev);
                updatedStages.add(stages[currentStage]);
                updatedStages.add("Preview");
                return updatedStages;
            });
            setCurrentStage((prev) => prev + 1);
        }
    };

    const handleSubmit = () => {
        console.log("Form Submitted!");
        console.log({
            office,
            currency,
            referenceNumber,
            transactionDate,
            debits,
            credits,
            paymentType,
            accountNumber,
            chequeNumber,
            routingCode,
            receiptNumber,
            bankNumber,
            comments,
        });
    };

    const handleAddDebit = () => {
        if (debits.length < 4) {
            setDebits([...debits, { type: '', amount: '' }]);
        }
    };

    const handleDebitChange = (index, field, value) => {
        const updatedDebits = [...debits];
        updatedDebits[index][field] = value;
        setDebits(updatedDebits);
    };

    const handleAddCredit = () => {
        if (credits.length < 4) {
            setCredits([...credits, { type: '', amount: '' }]);
        }
    };

    const handleRemoveDebit = (index) => {
        setDebits(debits.filter((_, i) => i !== index));
    };

    const handleRemoveCredit = (index) => {
        setCredits(credits.filter((_, i) => i !== index));
    };

    const handleCreditChange = (index, field, value) => {
        const updatedCredits = [...credits];
        updatedCredits[index][field] = value;
        setCredits(updatedCredits);
    };

    const renderStageTracker = () => {
        const trackerStages = stages;

        return (
            <div className="staged-form-stage-tracker">
                {trackerStages.map((stage, index) => (
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
                            if (completedStages.has(stage)) {
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

    const renderStageContent = () => {
        switch (stages[currentStage]) {
            case "Basic Information":
                return (
                    <div className="staged-form-basic-info">
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="office">
                                    Office <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="office"
                                    value={office}
                                    onChange={(e) => setOffice(e.target.value)}
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">-- Select Office --</option>
                                    {offices.map((o) => (
                                        <option key={o.id} value={o.id}>
                                            {o.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="currency">
                                    Currency <span>*</span>
                                </label>
                                <select
                                    id="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">-- Select Currency --</option>
                                    {currencies.map((currency) => (
                                        <option key={currency.code} value={currency.code}>
                                            {currency.name} ({currency.displaySymbol})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="referenceNumber">Reference Number</label>
                                <input
                                    id="referenceNumber"
                                    type="text"
                                    value={referenceNumber}
                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                    className="staged-form-input"
                                    placeholder="Enter Reference Number"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="transactionDate">
                                    Transaction Date <span>*</span>
                                </label>
                                <DatePicker
                                    id="transactionDate"
                                    selected={transactionDate ? new Date(transactionDate) : null}
                                    onChange={(date) => setTransactionDate(date.toISOString().split("T")[0])}
                                    className="staged-form-input"
                                    placeholderText="Select Transaction Date"
                                    dateFormat="MMMM d, yyyy"
                                    showPopperArrow={false}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                />
                            </div>
                        </div>
                    </div>
                );

            case "Affected GL Entries":
                return (
                    <div className="staged-form-affected-entries">
                        <div className="staged-form-add-button">
                            <button
                                type="button"
                                className="add-entry-button"
                                onClick={handleAddDebit}
                                disabled={debits.length >= 4}
                            >
                                Add Debit
                            </button>
                        </div>
                        {debits.map((debit, index) => (
                            <div key={`debit-${index}`} className="staged-form-row">
                                <div className="staged-form-field">
                                    <label>Debit Type</label>
                                    <select
                                        value={debit.type}
                                        onChange={(e) => handleDebitChange(index, "type", e.target.value)}
                                        className="staged-form-select"
                                    >
                                        <option value="">-- Select Debit Type --</option>
                                        {accountingRules.map((rule) => (
                                            <option key={rule.id} value={rule.name}>
                                                {rule.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="staged-form-field">
                                    <label>Debit Amount</label>
                                    <input
                                        type="number"
                                        value={debit.amount}
                                        onChange={(e) => handleDebitChange(index, "amount", e.target.value)}
                                        className="staged-form-input"
                                    />
                                </div>
                                {debits.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-entry-button"
                                        onClick={() => handleRemoveDebit(index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}

                        <div className="staged-form-add-button">
                            <button
                                type="button"
                                className="add-entry-button"
                                onClick={handleAddCredit}
                                disabled={credits.length >= 4}
                            >
                                Add Credit
                            </button>
                        </div>
                        {credits.map((credit, index) => (
                            <div key={`credit-${index}`} className="staged-form-row">
                                <div className="staged-form-field">
                                    <label>Credit Type</label>
                                    <select
                                        value={credit.type}
                                        onChange={(e) => handleCreditChange(index, "type", e.target.value)}
                                        className="staged-form-select"
                                    >
                                        <option value="">-- Select Credit Type --</option>
                                        {accountingRules.map((rule) => (
                                            <option key={rule.id} value={rule.name}>
                                                {rule.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="staged-form-field">
                                    <label>Credit Amount</label>
                                    <input
                                        type="number"
                                        value={credit.amount}
                                        onChange={(e) => handleCreditChange(index, "amount", e.target.value)}
                                        className="staged-form-input"
                                    />
                                </div>
                                {credits.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-entry-button"
                                        onClick={() => handleRemoveCredit(index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                );

            case "Payment Details":
                return (
                    <div className="staged-form-payment-details">
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="paymentType">Payment Type</label>
                                <input
                                    id="paymentType"
                                    type="text"
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    className="staged-form-input"
                                />
                            </div>
                        </div>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="accountNumber">Account Number</label>
                                <input
                                    id="accountNumber"
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="bankNumber">Bank Number</label>
                                <input
                                    id="bankNumber"
                                    type="text"
                                    value={bankNumber}
                                    onChange={(e) => setBankNumber(e.target.value)}
                                    className="staged-form-input"
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderPreviewSection = () => {
        const getOfficeName = () => {
            const officeObj = offices.find((o) => o.id === parseInt(office));
            return officeObj ? officeObj.name : "N/A";
        };

        const stageData = [
            {
                title: "Basic Information",
                data: {
                    Office: getOfficeName(),
                    Currency: currency || "N/A",
                    "Reference Number": referenceNumber || "N/A",
                    "Transaction Date": transactionDate || "N/A",
                },
            },
            {
                title: "Payment Details",
                data: {
                    "Payment Type": paymentType || "N/A",
                    "Account Number": accountNumber || "N/A",
                    "Cheque Number": chequeNumber || "N/A",
                    "Routing Code": routingCode || "N/A",
                    "Receipt Number": receiptNumber || "N/A",
                    "Bank Number": bankNumber || "N/A",
                    Comments: comments || "N/A",
                },
            },
            {
                title: "Affected GL Entries",
                data: [
                    ...debits.map((debit, idx) => ({
                        "Debit Type": debit.type || "N/A",
                        "Debit Amount": debit.amount || "N/A",
                    })),
                    ...credits.map((credit, idx) => ({
                        "Credit Type": credit.type || "N/A",
                        "Credit Amount": credit.amount || "N/A",
                    })),
                ],
            },
        ];

        return (
            <div className="staged-form-preview-section">
                <h2 className="preview-header">Form Preview</h2>
                {stageData.map(({ title, data }, index) => (
                    <div key={title} className="staged-form-preview-block">
                        <div className="staged-form-preview-header">
                            <h4 className="preview-stage-title">{title}</h4>
                            <button
                                className="staged-form-edit-button"
                                onClick={() => setCurrentStage(index)}
                            >
                                Edit
                            </button>
                        </div>
                        {Array.isArray(data) && data.length > 0 ? (
                            <table style={{color: '#333'}} className="staged-form-preview-table">
                                <thead>
                                <tr>
                                    {Object.keys(data[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, idx) => (
                                    <tr key={idx}>
                                        {Object.values(item).map((value, i) => (
                                            <td key={i}>{value || "N/A"}</td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="staged-form-preview-table-wrapper">
                                <table style={{color: '#333'}} className="staged-form-preview-table">
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
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="form-container-client">
            <h2>
                <Link to="/accounting" className="breadcrumb-link">
                    Accounting
                </Link>{" "}
                . Add Journal Entries
            </h2>

            <div className="staged-form-add-client">
                {renderStageTracker()}
                <div className="staged-form-stage-content">
                    {currentStage === stages.length - 1 ? (
                        renderPreviewSection()
                    ) : (
                        renderStageContent()
                    )}
                </div>
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
                                (currentStage === 1 && !isStep2Complete)
                            }
                        >
                            Next
                        </button>
                    )}
                    {currentStage === stages.length - 1 && (
                        <button
                            onClick={handleSubmit}
                            className="staged-form-button-next"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddJournalEntries;
