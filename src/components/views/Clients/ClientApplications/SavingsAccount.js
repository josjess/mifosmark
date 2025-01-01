import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import { useLoading } from '../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../config';
import DatePicker from 'react-datepicker';

const SavingsAccount = () => {
    const { clientId } = useParams();
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();

    const stages = ["Details", "Terms", "Charges"];
    const [currentStage, setCurrentStage] = useState(1);
    const [completedStages, setCompletedStages] = useState(new Set());
    const [clientData, setClientData] = useState(null);
    const [savingsTemplate, setSavingsTemplate] = useState(null);
    const [chargeOptions, setChargeOptions] = useState([]);
    const [addedCharges, setAddedCharges] = useState([]);
    const [selectedCharge, setSelectedCharge] = useState("");
    const [submittedOn, setSubmittedOn] = useState("");
    const [nominalAnnualInterestRate, setNominalAnnualInterestRate] = useState("");
    const [interestCompoundingPeriod, setInterestCompoundingPeriod] = useState("");
    const [interestPostingPeriod, setInterestPostingPeriod] = useState("");
    const [interestCalculatedUsing, setInterestCalculatedUsing] = useState("");
    const [daysInYear, setDaysInYear] = useState("");
    const [minimumOpeningBalance, setMinimumOpeningBalance] = useState("");
    const [applyWithdrawalFee, setApplyWithdrawalFee] = useState(false);
    const [lockInFrequency, setLockInFrequency] = useState("");
    const [lockInType, setLockInType] = useState("");
    const [isOverdraftAllowed, setIsOverdraftAllowed] = useState(false);
    const [enforceMinimumBalance, setEnforceMinimumBalance] = useState(false);
    const [minimumBalance, setMinimumBalance] = useState("");
    const [fieldOfficer, setFieldOfficer] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [allStagesComplete, setAllStagesComplete] = useState(false);

    const fetchData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            const [
                clientResponse,
                savingsTemplateResponse,
                chargesResponse,
            ] = await Promise.all([
                axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers }),
                axios.get(`${API_CONFIG.baseURL}/savingsaccounts/template?clientId=${clientId}`, { headers }),
                axios.get(`${API_CONFIG.baseURL}/clients/${clientId}/charges?pendingPayment=true`, { headers }),
            ]);

            setClientData(clientResponse.data);
            setSavingsTemplate(savingsTemplateResponse.data);
            setChargeOptions(chargesResponse.data.pageItems);
        } catch (error) {
            console.error('Error fetching savings account data:', error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleNext = () => {
        const currentIndex = stages.indexOf(currentStage);
        if (currentIndex < stages.length - 1) {
            setCurrentStage(stages[currentIndex + 1]);
        }
    };

    const handlePrevious = () => {
        const currentIndex = stages.indexOf(currentStage);
        if (currentIndex > 0) {
            setCurrentStage(stages[currentIndex - 1]);
        }
    };

    const handleAddCharge = () => {
        const chargeData = chargeOptions.find((charge) => charge.id === selectedCharge);
        if (chargeData) {
            setAddedCharges((prev) => [...prev, chargeData]);
            setSelectedCharge('');
        }
    };

    const handleRemoveCharge = (index) => {
        setAddedCharges((prev) => prev.filter((_, i) => i !== index));
    };

    const renderStageContent = () => {
        switch (currentStage) {
            case 'Details':
                return (
                    <div className="stage-details">
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="productName">Product Name <span>*</span></label>
                                <select
                                    id="productName"
                                    value={selectedProduct}
                                    onChange={(e) => {
                                        setSelectedProduct(e.target.value);
                                    }}
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">-- Select Savings Product --</option>
                                    {savingsTemplate?.productOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedProduct && (
                            <>
                                <div className="staged-form-field">
                                    <label htmlFor="submittedOn">Submitted On <span>*</span></label>
                                    <DatePicker
                                        id="submittedOn"
                                        selected={submittedOn ? new Date(submittedOn) : null}
                                        onChange={(date) => setSubmittedOn(date.toISOString().split('T')[0])}
                                        className="staged-form-input"
                                        placeholderText="Select Submission Date"
                                        dateFormat="MMMM d, yyyy"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        showPopperArrow={false}
                                    />
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="fieldOfficer">Field Officer</label>
                                        <select
                                            id="fieldOfficer"
                                            className="staged-form-select"
                                            value={fieldOfficer}
                                            onChange={(e) => setFieldOfficer(e.target.value)}
                                        >
                                            <option value="">-- Select Field Officer --</option>
                                            {savingsTemplate?.fieldOfficerOptions?.map((officer) => (
                                                <option key={officer.id} value={officer.id}>
                                                    {officer.displayName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="externalId">External ID</label>
                                        <input
                                            type="text"
                                            id="externalId"
                                            value={clientData?.externalId || ''}
                                            readOnly
                                            className="staged-form-input"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            case 'Terms':
                return (
                    <div className="stage-terms">
                        {/* Currency and Decimal Places */}
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="currency">Currency</label>
                                <input
                                    type="text"
                                    id="currency"
                                    value={savingsTemplate?.currency?.name || ''}
                                    readOnly
                                    className="staged-form-input muted"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="decimalPlaces">Decimal Places</label>
                                <input
                                    type="number"
                                    id="decimalPlaces"
                                    value={savingsTemplate?.currency?.decimalPlaces || ''}
                                    readOnly
                                    className="staged-form-input muted"
                                />
                            </div>
                        </div>

                        {/* Nominal Annual Interest and Interest Compounding Period */}
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="nominalAnnualInterestRate">Nominal Annual Interest Rate (%) <span>*</span></label>
                                <input
                                    type="number"
                                    id="nominalAnnualInterestRate"
                                    value={nominalAnnualInterestRate}
                                    onChange={(e) => setNominalAnnualInterestRate(e.target.value)}
                                    required
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="interestCompoundingPeriod">Interest Compounding Period <span>*</span></label>
                                <select
                                    id="interestCompoundingPeriod"
                                    value={interestCompoundingPeriod}
                                    onChange={(e) => setInterestCompoundingPeriod(e.target.value)}
                                    required
                                    className="staged-form-select"
                                >
                                    <option value="">-- Select Period --</option>
                                    {savingsTemplate?.interestCompoundingPeriodTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Interest Posting Period and Interest Calculated Using */}
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="interestPostingPeriod">Interest Posting Period <span>*</span></label>
                                <select
                                    id="interestPostingPeriod"
                                    value={interestPostingPeriod}
                                    onChange={(e) => setInterestPostingPeriod(e.target.value)}
                                    required
                                    className="staged-form-select"
                                >
                                    <option value="">-- Select Posting Period --</option>
                                    {savingsTemplate?.interestPostingPeriodTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="interestCalculatedUsing">Interest Calculated Using <span>*</span></label>
                                <select
                                    id="interestCalculatedUsing"
                                    value={interestCalculatedUsing}
                                    onChange={(e) => setInterestCalculatedUsing(e.target.value)}
                                    required
                                    className="staged-form-select"
                                >
                                    <option value="">-- Select Calculation Method --</option>
                                    {savingsTemplate?.interestCalculationTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Days in Year and Minimum Opening Balance */}
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="daysInYear">Days in Year <span>*</span></label>
                                <select
                                    id="daysInYear"
                                    value={daysInYear}
                                    onChange={(e) => setDaysInYear(e.target.value)}
                                    required
                                    className="staged-form-select"
                                >
                                    <option value="">-- Select Days --</option>
                                    {savingsTemplate?.daysInYearTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="minimumOpeningBalance">Minimum Opening Balance</label>
                                <input
                                    type="number"
                                    id="minimumOpeningBalance"
                                    value={minimumOpeningBalance}
                                    onChange={(e) => setMinimumOpeningBalance(e.target.value)}
                                    className="staged-form-input"
                                />
                            </div>
                        </div>

                        {/* Apply Withdrawal Fee for Transfers */}
                        <div className="staged-form-row">
                            <label htmlFor="applyWithdrawalFee">
                                <input
                                    type="checkbox"
                                    id="applyWithdrawalFee"
                                    checked={applyWithdrawalFee}
                                    onChange={(e) => setApplyWithdrawalFee(e.target.checked)}
                                />{' '}
                                Apply Withdrawal Fee for Transfers
                            </label>
                        </div>

                        {/* Lock-in Period */}
                        <h4>Lock-in Period</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="lockInFrequency">Frequency</label>
                                <input
                                    type="number"
                                    id="lockInFrequency"
                                    value={lockInFrequency}
                                    onChange={(e) => setLockInFrequency(e.target.value)}
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="lockInType">Type</label>
                                <select
                                    id="lockInType"
                                    value={lockInType}
                                    onChange={(e) => setLockInType(e.target.value)}
                                    className="staged-form-select"
                                >
                                    <option value="">-- Select Type --</option>
                                    {savingsTemplate?.lockinPeriodFrequencyTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Overdraft Section */}
                        <h4>Overdraft</h4>
                        <div className="staged-form-row">
                            <label htmlFor="isOverdraftAllowed">
                                <input
                                    type="checkbox"
                                    id="isOverdraftAllowed"
                                    checked={isOverdraftAllowed}
                                    onChange={(e) => setIsOverdraftAllowed(e.target.checked)}
                                />{' '}
                                Is Overdraft Allowed
                            </label>
                        </div>

                        {/* Enforce Minimum Balance */}
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="enforceMinimumBalance">
                                    <input
                                        type="checkbox"
                                        id="enforceMinimumBalance"
                                        checked={enforceMinimumBalance}
                                        onChange={(e) => setEnforceMinimumBalance(e.target.checked)}
                                    />{' '}
                                    Enforce Minimum Balance
                                </label>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="minimumBalance">Minimum Balance</label>
                                <input
                                    type="number"
                                    id="minimumBalance"
                                    value={minimumBalance}
                                    onChange={(e) => setMinimumBalance(e.target.value)}
                                    className="staged-form-input"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'Charges':
                return (
                    <div className="stage-charges">
                        {/* Charge Selection */}
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="chargeSelect">Charge</label>
                                <select
                                    id="chargeSelect"
                                    value={selectedCharge}
                                    onChange={(e) => setSelectedCharge(e.target.value)}
                                    className="staged-form-select"
                                >
                                    <option value="">-- Select a Charge --</option>
                                    {chargeOptions?.map((charge) => (
                                        <option key={charge.id} value={charge.id}>
                                            {charge.name} - {charge.amount}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleAddCharge}
                                className="add-charge-button"
                                disabled={!selectedCharge}
                            >
                                Add
                            </button>
                        </div>

                        {/* Table for Added Charges */}
                        {addedCharges.length > 0 && (
                            <div className="charges-table-section">
                                <h4>Added Charges</h4>
                                <table className="staged-form-table">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Collected On</th>
                                        <th>Date</th>
                                        <th>Repayments Every</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {addedCharges.map((charge, index) => (
                                        <tr key={index}>
                                            <td>{charge.name}</td>
                                            <td>{charge.type}</td>
                                            <td>{charge.amount}</td>
                                            <td>{charge.collectedOn}</td>
                                            <td>{charge.date}</td>
                                            <td>{charge.repaymentsEvery}</td>
                                            <td>
                                                <button
                                                    className="delete-charge-button"
                                                    onClick={() => handleRemoveCharge(index)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* No Charges Placeholder */}
                        {addedCharges.length === 0 && (
                            <p>No charges added yet. Select a charge and click 'Add' to include it.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const renderPreviewSection = () => {
        const transformCharges = () =>
            addedCharges.length > 0
                ? addedCharges.map((charge) => ({
                    Name: charge.name || "N/A",
                    Type: charge.type || "N/A",
                    Amount: charge.amount || "N/A",
                    "Collected On": charge.collectedOn || "N/A",
                    Date: charge.date || "N/A",
                    "Repayments Every": charge.repaymentsEvery || "N/A",
                }))
                : null;

        const previewData = [
            {
                title: "Details",
                data: {
                    "Product Name": savingsTemplate?.productOptions?.find(
                        (option) => option.id === parseInt(selectedProduct)
                    )?.name || "N/A",
                    "Submitted On": submittedOn || "N/A",
                    "Field Officer": savingsTemplate?.fieldOfficerOptions?.find(
                        (officer) => officer.id === parseInt(fieldOfficer)
                    )?.displayName || "N/A",
                    "External ID": clientData?.externalId || "N/A",
                },
            },
            {
                title: "Terms",
                data: {
                    "Currency": savingsTemplate?.currency?.name || "N/A",
                    "Decimal Places": savingsTemplate?.currency?.decimalPlaces || "N/A",
                    "Nominal Annual Interest Rate": nominalAnnualInterestRate || "N/A",
                    "Interest Compounding Period": savingsTemplate?.interestCompoundingPeriodTypeOptions?.find(
                        (option) => option.id === parseInt(interestCompoundingPeriod)
                    )?.value || "N/A",
                    "Interest Posting Period": savingsTemplate?.interestPostingPeriodTypeOptions?.find(
                        (option) => option.id === parseInt(interestPostingPeriod)
                    )?.value || "N/A",
                    "Interest Calculated Using": savingsTemplate?.interestCalculationTypeOptions?.find(
                        (option) => option.id === parseInt(interestCalculatedUsing)
                    )?.value || "N/A",
                    "Days in Year": savingsTemplate?.daysInYearTypeOptions?.find(
                        (option) => option.id === parseInt(daysInYear)
                    )?.value || "N/A",
                    "Minimum Opening Balance": minimumOpeningBalance || "N/A",
                    "Apply Withdrawal Fee for Transfers": applyWithdrawalFee ? "Yes" : "No",
                    "Lock-in Period Frequency": lockInFrequency || "N/A",
                    "Lock-in Period Type": savingsTemplate?.lockinPeriodFrequencyTypeOptions?.find(
                        (option) => option.id === parseInt(lockInType)
                    )?.value || "N/A",
                    "Is Overdraft Allowed": isOverdraftAllowed ? "Yes" : "No",
                    "Enforce Minimum Balance": enforceMinimumBalance ? "Yes" : "No",
                    "Minimum Balance": minimumBalance || "N/A",
                },
            },
            {
                title: "Charges",
                data: transformCharges(),
            },
        ];

        return (
            <div className="staged-form-preview-section">
                {previewData.map(({ title, data }, index) => (
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
                        ) : Array.isArray(data) && data.length > 0 ? (
                            <table className="staged-form-preview-table">
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
                            index === stages.indexOf(currentStage)
                                ? "staged-form-active"
                                : index < stages.indexOf(currentStage)
                                    ? "staged-form-completed"
                                    : "staged-form-unvisited"
                        }`}
                        onClick={() => {
                            if (index <= stages.indexOf(currentStage)) {
                                setCurrentStage(stage);
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
    const handleSubmit = () => {
        const submissionData = {
            details: {
                productName: savingsTemplate?.productOptions?.find(
                    (option) => option.id === parseInt(selectedProduct)
                )?.name || "N/A",
                submittedOn,
                fieldOfficer: savingsTemplate?.fieldOfficerOptions?.find(
                    (officer) => officer.id === parseInt(fieldOfficer)
                )?.displayName || "N/A",
                externalId: clientData?.externalId || "N/A",
            },
            terms: {
                currency: savingsTemplate?.currency?.name || "N/A",
                decimalPlaces: savingsTemplate?.currency?.decimalPlaces || "N/A",
                nominalAnnualInterestRate,
                interestCompoundingPeriod: savingsTemplate?.interestCompoundingPeriodTypeOptions?.find(
                    (option) => option.id === parseInt(interestCompoundingPeriod)
                )?.value || "N/A",
                interestPostingPeriod: savingsTemplate?.interestPostingPeriodTypeOptions?.find(
                    (option) => option.id === parseInt(interestPostingPeriod)
                )?.value || "N/A",
                interestCalculatedUsing: savingsTemplate?.interestCalculationTypeOptions?.find(
                    (option) => option.id === parseInt(interestCalculatedUsing)
                )?.value || "N/A",
                daysInYear: savingsTemplate?.daysInYearTypeOptions?.find(
                    (option) => option.id === parseInt(daysInYear)
                )?.value || "N/A",
                minimumOpeningBalance,
                applyWithdrawalFee,
                lockInFrequency,
                lockInType: savingsTemplate?.lockinPeriodFrequencyTypeOptions?.find(
                    (option) => option.id === parseInt(lockInType)
                )?.value || "N/A",
                isOverdraftAllowed,
                enforceMinimumBalance,
                minimumBalance,
            },
            charges: addedCharges.map((charge) => ({
                name: charge.name || "N/A",
                type: charge.type || "N/A",
                amount: charge.amount || "N/A",
                collectedOn: charge.collectedOn || "N/A",
                date: charge.date || "N/A",
                repaymentsEvery: charge.repaymentsEvery || "N/A",
            })),
        };

        console.log("Submission Data:", submissionData);
    };


    return (
        <div className="staged-form-container">

            <div className="staged-form-add-client">
                {renderStageTracker()}
                <div className="staged-form-stage-content">
                    {allStagesComplete && currentStage === stages.length
                        ? renderPreviewSection()
                        : renderStageContent()}

                    <div className="staged-form-stage-buttons">
                        <button
                            onClick={handlePrevious}
                            className="staged-form-button-previous"
                            disabled={currentStage === 1}
                        >
                            Previous
                        </button>
                        {currentStage === stages.length - 1 ? (
                            <button onClick={handleSubmit} disabled={!allStagesComplete} className="staged-form-button-next">
                                Submit
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="staged-form-button-next"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SavingsAccount;
