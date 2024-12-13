import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../context/AuthContext";
import { useLoading } from "../../../../../context/LoadingContext";
import { API_CONFIG } from "../../../../../config";
import { FaTrash} from "react-icons/fa";

const stages = [
    "Details",
    "Currency",
    "Terms",
    "Settings",
    "Charges",
    "Accounting",
];

const CreateSavingsProducts = () => {
    const [currentStage, setCurrentStage] = useState(0);
    const [formData, setFormData] = useState({});
    const [completedStages, setCompletedStages] = useState(new Set());
    const [errors, setErrors] = useState({});
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();

    useEffect(() => {
        const fetchData = async () => {
            try {
                startLoading();

                const savingsProductTemplateResponse = await axios.get(
                    `${API_CONFIG.baseURL}/savingsproducts/template`,
                    {
                        headers: {
                            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                            "Fineract-Platform-TenantId": "default",
                            "Content-Type": "application/json",
                        },
                    }
                );

                setFormData((prevData) => ({
                    ...prevData,
                    savingsProductTemplate: savingsProductTemplateResponse.data,
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                stopLoading();
            }
        };

        fetchData();
    }, []);

    const handleFieldChange = (stage, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [stage]: {
                ...prev[stage],
                [field]: value,
            },
        }));

        if (errors[stage]?.[field]) {
            setErrors((prev) => ({
                ...prev,
                [stage]: {
                    ...prev[stage],
                    [field]: false,
                },
            }));
        }
    };

    const handleAddAdvancedRule = (type) => {
        console.log('Add Advanced Rule')
    };

    const handleNext = () => {
        setCompletedStages((prev) => new Set([...prev, stages[currentStage]]));
        setCurrentStage((prev) => prev + 1);
    };

    const handlePrevious = () => {
        setCurrentStage((prev) => prev - 1);
    };

    const handlePreview = () => {
        console.log("Preview Data:", formData);
    };

    const allStagesComplete = stages.every((stage) => completedStages.has(stage));

    const renderStageContent = () => {
        switch (stages[currentStage]) {
            case "Details":
                return (
                    <div className="staged-form-details">
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="productName">
                                    Product Name <span className="staged-form-required">*</span>
                                </label>
                                <input
                                    id="productName"
                                    type="text"
                                    value={formData.Details?.productName || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Details", "productName", e.target.value)
                                    }
                                    className={`staged-form-input ${
                                        errors.Details?.productName ? "staged-form-error" : ""
                                    }`}
                                    required
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="shortName">
                                    Short Name <span className="staged-form-required">*</span>
                                </label>
                                <input
                                    id="shortName"
                                    type="text"
                                    value={formData.Details?.shortName || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Details", "shortName", e.target.value)
                                    }
                                    className={`staged-form-input ${
                                        errors.Details?.shortName ? "staged-form-error" : ""
                                    }`}
                                    required
                                />
                            </div>
                        </div>
                        <div className="staged-form-field">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                value={formData.Details?.description || ""}
                                onChange={(e) =>
                                    handleFieldChange("Details", "description", e.target.value)
                                }
                                className="staged-form-textarea"
                            ></textarea>
                        </div>
                    </div>
                );
            case "Currency":
                return (
                    <div className="staged-form-currency">
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="currency">
                                    Currency <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="currency"
                                    name="currency"
                                    value={formData.Currency?.currency || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Currency", "currency", e.target.value)
                                    }
                                    className={`staged-form-select ${
                                        errors.Currency?.currency ? "staged-form-error" : ""
                                    }`}
                                    required
                                >
                                    <option value="">Select Currency</option>
                                    {formData.savingsProductTemplate?.currencyOptions?.map((option) => (
                                        <option key={option.code} value={option.code}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="decimalPlaces">
                                    Decimal Places <span className="staged-form-required">*</span>
                                </label>
                                <input
                                    id="decimalPlaces"
                                    name="decimalPlaces"
                                    type="number"
                                    min="0"
                                    max="5"
                                    value={formData.Currency?.decimalPlaces || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Currency", "decimalPlaces", e.target.value)
                                    }
                                    className={`staged-form-input ${
                                        errors.Currency?.decimalPlaces ? "staged-form-error" : ""
                                    }`}
                                    required
                                />
                            </div>
                        </div>

                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="currencyMultiples">
                                    Currency in Multiples Of
                                </label>
                                <input
                                    id="currencyMultiples"
                                    name="currencyMultiples"
                                    type="number"
                                    min="0"
                                    value={formData.Currency?.currencyMultiples || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Currency", "currencyMultiples", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>
                    </div>
                );
            case "Terms":
                return (
                    <div className="staged-form-terms">
                        <div className="staged-form-row">
                            {/* Nominal Annual Interest */}
                            <div className="staged-form-field">
                                <label htmlFor="nominalAnnualInterest">
                                    Nominal Annual Interest <span className="staged-form-required">*</span>
                                </label>
                                <input
                                    id="nominalAnnualInterest"
                                    type="number"
                                    value={formData.Terms?.nominalAnnualInterest || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "nominalAnnualInterest", e.target.value)
                                    }
                                    className={`staged-form-input ${
                                        errors.Terms?.nominalAnnualInterest ? "staged-form-error" : ""
                                    }`}
                                    required
                                />
                            </div>
                        </div>

                        <div className="staged-form-row">
                            {/* Interest Compounding Period */}
                            <div className="staged-form-field">
                                <label htmlFor="interestCompoundingPeriod">
                                    Interest Compounding Period <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="interestCompoundingPeriod"
                                    value={formData.Terms?.interestCompoundingPeriod || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "interestCompoundingPeriod", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">Select Compounding Period</option>
                                    {formData.savingsProductTemplate?.interestCompoundingPeriodTypeOptions?.map(
                                        (option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.value}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Interest Posting Period */}
                            <div className="staged-form-field">
                                <label htmlFor="interestPostingPeriod">
                                    Interest Posting Period <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="interestPostingPeriod"
                                    value={formData.Terms?.interestPostingPeriod || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "interestPostingPeriod", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">Select Posting Period</option>
                                    {formData.savingsProductTemplate?.interestPostingPeriodTypeOptions?.map(
                                        (option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.value}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="staged-form-row">
                            {/* Interest Calculated Using */}
                            <div className="staged-form-field">
                                <label htmlFor="interestCalculationType">
                                    Interest Calculated Using <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="interestCalculationType"
                                    value={formData.Terms?.interestCalculationType || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "interestCalculationType", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">Select Calculation Type</option>
                                    {formData.savingsProductTemplate?.interestCalculationTypeOptions?.map(
                                        (option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.value}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Days in Year */}
                            <div className="staged-form-field">
                                <label htmlFor="daysInYear">
                                    Days in Year <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="daysInYear"
                                    value={formData.Terms?.daysInYear || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "daysInYear", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">Select Days in Year</option>
                                    {formData.savingsProductTemplate?.interestCalculationDaysInYearTypeOptions?.map(
                                        (option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.value}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case "Settings":
                return (
                    <div className="staged-form-settings">
                        {/* General Settings Section */}
                        <h4 className="staged-form-section-title">General Settings</h4>
                        <div className="staged-form-row">
                            {/* Minimum Opening Balance */}
                            <div className="staged-form-field">
                                <label htmlFor="minimumOpeningBalance">
                                    Minimum Opening Balance
                                </label>
                                <input
                                    id="minimumOpeningBalance"
                                    type="number"
                                    value={formData.Settings?.minimumOpeningBalance || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "minimumOpeningBalance", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>

                            {/* Lock-in Period and Unit */}
                            <div className="staged-form-field">
                                <label htmlFor="lockInPeriod">
                                    Lock-in Period
                                </label>
                                <input
                                    id="lockInPeriod"
                                    type="number"
                                    value={formData.Settings?.lockInPeriod || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "lockInPeriod", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="lockInPeriodUnit">
                                    Lock-in Period Unit
                                </label>
                                <select
                                    id="lockInPeriodUnit"
                                    value={formData.Settings?.lockInPeriodUnit || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "lockInPeriodUnit", e.target.value)
                                    }
                                    className="staged-form-select"
                                >
                                    <option value="">Select Unit</option>
                                    {formData.savingsProductTemplate?.lockinPeriodFrequencyTypeOptions?.map(
                                        (option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.value}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="staged-form-row">
                            {/* Apply Withdrawal Fees for Transfers */}
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.applyWithdrawalFeesForTransfers || false}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "applyWithdrawalFeesForTransfers",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Apply Withdrawal Fees for Transfers
                                </label>
                            </div>

                            {/* Balance Required for Interest Calculation */}
                            <div className="staged-form-field">
                                <label htmlFor="balanceRequiredForInterestCalculation">
                                    Balance Required for Interest Calculation
                                </label>
                                <input
                                    id="balanceRequiredForInterestCalculation"
                                    type="number"
                                    value={formData.Settings?.balanceRequiredForInterestCalculation || ""}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "Settings",
                                            "balanceRequiredForInterestCalculation",
                                            e.target.value
                                        )
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>

                        <div className="staged-form-row">
                            {/* Enforce Minimum Balance */}
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.enforceMinimumBalance || false}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "enforceMinimumBalance",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Enforce Minimum Balance
                                </label>
                            </div>

                            {/* Minimum Balance */}
                            <div className="staged-form-field">
                                <label htmlFor="minimumBalance">
                                    Minimum Balance
                                </label>
                                <input
                                    id="minimumBalance"
                                    type="number"
                                    value={formData.Settings?.minimumBalance || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "minimumBalance", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>

                        <div className="staged-form-row">
                            {/* Is Withhold Tax Applicable */}
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.isWithholdTaxApplicable || false}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "isWithholdTaxApplicable",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Is Withhold Tax Applicable
                                </label>
                            </div>

                            {/* Tax Group (Conditional) */}
                            {formData.Settings?.isWithholdTaxApplicable && (
                                <div className="staged-form-field">
                                    <label htmlFor="taxGroup">
                                        Tax Group <span className="staged-form-required">*</span>
                                    </label>
                                    <select
                                        id="taxGroup"
                                        value={formData.Settings?.taxGroup || ""}
                                        onChange={(e) =>
                                            handleFieldChange("Settings", "taxGroup", e.target.value)
                                        }
                                        className="staged-form-select"
                                        required
                                    >
                                        <option value="">Select Tax Group</option>
                                        {formData.savingsProductTemplate?.taxGroupOptions?.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Overdraft Section */}
                        <h4 className="staged-form-section-title">Overdraft</h4>
                        <div className="staged-form-field">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.Settings?.isOverdraftAllowed || false}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "isOverdraftAllowed", e.target.checked)
                                    }
                                />
                                Is Overdraft Allowed
                            </label>
                        </div>

                        {formData.Settings?.isOverdraftAllowed && (
                            <div className="staged-form-row">
                                <div className="staged-form-field">
                                    <label htmlFor="minimumOverdraftRequiredForInterestCalculation">
                                        Minimum Overdraft Required for Interest Calculation
                                    </label>
                                    <input
                                        id="minimumOverdraftRequiredForInterestCalculation"
                                        type="number"
                                        value={
                                            formData.Settings?.minimumOverdraftRequiredForInterestCalculation ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "minimumOverdraftRequiredForInterestCalculation",
                                                e.target.value
                                            )
                                        }
                                        className="staged-form-input"
                                    />
                                </div>
                                <div className="staged-form-field">
                                    <label htmlFor="nominalAnnualInterestForOverdraft">
                                        Nominal Annual Interest for Overdraft
                                    </label>
                                    <input
                                        id="nominalAnnualInterestForOverdraft"
                                        type="number"
                                        value={formData.Settings?.nominalAnnualInterestForOverdraft || ""}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "nominalAnnualInterestForOverdraft",
                                                e.target.value
                                            )
                                        }
                                        className="staged-form-input"
                                    />
                                </div>
                                <div className="staged-form-field">
                                    <label htmlFor="maximumOverdraftAmountLimit">
                                        Maximum Overdraft Amount Limit
                                    </label>
                                    <input
                                        id="maximumOverdraftAmountLimit"
                                        type="number"
                                        value={formData.Settings?.maximumOverdraftAmountLimit || ""}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "maximumOverdraftAmountLimit",
                                                e.target.value
                                            )
                                        }
                                        className="staged-form-input"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Dormancy Tracking Section */}
                        <h4 className="staged-form-section-title">Dormancy Tracking</h4>
                        <div className="staged-form-field">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.Settings?.enableDormancyTracking || false}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "enableDormancyTracking", e.target.checked)
                                    }
                                />
                                Enable Dormancy Tracking
                            </label>
                        </div>

                        {formData.Settings?.enableDormancyTracking && (
                            <div className="staged-form-row">
                                <div className="staged-form-field">
                                    <label htmlFor="numberOfDaysToInactiveSubStatus">
                                        Number of Days to Inactive Sub-status <span className="staged-form-required">*</span>
                                    </label>
                                    <input
                                        id="numberOfDaysToInactiveSubStatus"
                                        type="number"
                                        value={formData.Settings?.numberOfDaysToInactiveSubStatus || ""}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "numberOfDaysToInactiveSubStatus",
                                                e.target.value
                                            )
                                        }
                                        className="staged-form-input"
                                        required
                                    />
                                </div>
                                <div className="staged-form-field">
                                    <label htmlFor="numberOfDaysToDormantSubStatus">
                                        Number of Days to Dormant Sub-status <span className="staged-form-required">*</span>
                                    </label>
                                    <input
                                        id="numberOfDaysToDormantSubStatus"
                                        type="number"
                                        value={formData.Settings?.numberOfDaysToDormantSubStatus || ""}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "numberOfDaysToDormantSubStatus",
                                                e.target.value
                                            )
                                        }
                                        className="staged-form-input"
                                        required
                                    />
                                </div>
                                <div className="staged-form-field">
                                    <label htmlFor="numberOfDaysToEscheat">
                                        Number of Days to Escheat <span className="staged-form-required">*</span>
                                    </label>
                                    <input
                                        id="numberOfDaysToEscheat"
                                        type="number"
                                        value={formData.Settings?.numberOfDaysToEscheat || ""}
                                        onChange={(e) =>
                                            handleFieldChange("Settings", "numberOfDaysToEscheat", e.target.value)
                                        }
                                        className="staged-form-input"
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "Charges":
                return (
                    <div className="staged-form-charges">
                        <h4 className="staged-form-section-title">Charges</h4>

                        {/* Regular Charges Section */}
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="charge">Charge</label>
                                <select
                                    id="charge"
                                    value={formData.Charges?.selectedCharge || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Charges", "selectedCharge", e.target.value)
                                    }
                                    className="staged-form-select"
                                >
                                    <option value="">Select Charge</option>
                                    {formData.savingsProductTemplate?.chargeOptions
                                        ?.filter(
                                            (option) =>
                                                !formData.Charges?.selectedCharges?.some(
                                                    (item) => item.id === option.id
                                                )
                                        )
                                        .map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <button
                                className="staged-form-button-add"
                                onClick={() => {
                                    const selectedChargeId = parseInt(formData.Charges?.selectedCharge, 10);
                                    const selectedCharge = formData.savingsProductTemplate?.chargeOptions?.find(
                                        (charge) => charge.id === selectedChargeId
                                    );
                                    if (selectedCharge) {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            Charges: {
                                                ...prevData.Charges,
                                                selectedCharges: [
                                                    ...(prevData.Charges?.selectedCharges || []),
                                                    selectedCharge,
                                                ],
                                                selectedCharge: "",
                                            },
                                        }));
                                    }
                                }}
                                disabled={!formData.Charges?.selectedCharge}
                            >
                                Add
                            </button>
                        </div>

                        {formData.Charges?.selectedCharges?.length > 0 && (
                            <table className="staged-form-table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Collected On</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {formData.Charges.selectedCharges.map((charge) => (
                                    <tr key={charge.id}>
                                        <td>{charge.name}</td>
                                        <td>{charge.chargeCalculationType.value}</td>
                                        <td>
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: charge.currency.code,
                                                minimumFractionDigits: charge.currency.decimalPlaces,
                                            }).format(charge.amount)}
                                        </td>
                                        <td>{charge.chargeTimeType.value}</td>
                                        <td>
                                            <button
                                                className="staged-form-icon-button-delete"
                                                onClick={() => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        Charges: {
                                                            ...prevData.Charges,
                                                            selectedCharges: prevData.Charges.selectedCharges.filter(
                                                                (item) => item.id !== charge.id
                                                            ),
                                                        },
                                                    }));
                                                }}
                                            >
                                                <FaTrash/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );
            case "Accounting":
                return (
                    <div className="staged-form-accounting">
                        <h4 className="staged-form-section-title">Accounting</h4>
                        {/* Radio Buttons for Selection */}
                        <div className="staged-form-radio-group">
                            {["None", "Cash", "Accrual (periodic)"].map((option) => (
                                <label key={option} className="staged-form-radio-option">
                                    <input
                                        type="radio"
                                        name="accountingOption"
                                        value={option}
                                        checked={formData.Accounting?.selectedOption === option}
                                        onChange={(e) =>
                                            handleFieldChange("Accounting", "selectedOption", e.target.value)
                                        }
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>

                        {formData.Accounting?.selectedOption === "Cash" && (
                            <>
                                {/* Assets Section */}
                                <h5>Assets</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="savingsReference">
                                            Savings Reference <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="savingsReference"
                                            value={formData.Accounting?.savingsReference || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "savingsReference", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Savings Reference</option>
                                            {Array.isArray(formData.savingsProductTemplate?.accountingMappingOptions) &&
                                                formData.savingsProductTemplate.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="overdraftPortfolio">
                                            Overdraft Portfolio <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="overdraftPortfolio"
                                            value={formData.Accounting?.overdraftPortfolio || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "overdraftPortfolio", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Overdraft Portfolio</option>
                                            {Array.isArray(formData.savingsProductTemplate?.accountingMappingOptions) &&
                                                formData.savingsProductTemplate.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Liabilities Section */}
                                <h5>Liabilities</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="savingsControl">
                                            Savings Control <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="savingsControl"
                                            value={formData.Accounting?.savingsControl || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "savingsControl", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Savings Control</option>
                                            {Array.isArray(formData.savingsProductTemplate?.accountingMappingOptions) &&
                                                formData.savingsProductTemplate.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="savingsTransferInSuspense">
                                            Savings Transfer in Suspense <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="savingsTransferInSuspense"
                                            value={formData.Accounting?.savingsTransferInSuspense || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "savingsTransferInSuspense", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Savings Transfer in Suspense</option>
                                            {Array.isArray(formData.savingsProductTemplate?.accountingMappingOptions) &&
                                                formData.savingsProductTemplate.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-field">
                                    <label htmlFor="escheatLiability">
                                        Escheat Liability <span className="staged-form-required">*</span>
                                    </label>
                                    <select
                                        id="escheatLiability"
                                        value={formData.Accounting?.escheatLiability || ""}
                                        onChange={(e) =>
                                            handleFieldChange("Accounting", "escheatLiability", e.target.value)
                                        }
                                        required
                                        className="staged-form-select"
                                    >
                                        <option value="">Select Escheat Liability</option>
                                        {Array.isArray(formData.savingsProductTemplate?.accountingMappingOptions) &&
                                            formData.savingsProductTemplate.accountingMappingOptions.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.value}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Expenses Section */}
                                <h5>Expenses</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="interestOnSavings">
                                            Interest on Savings <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="interestOnSavings"
                                            value={formData.Accounting?.interestOnSavings || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "interestOnSavings", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Interest on Savings</option>
                                            {Array.isArray(formData.savingsProductTemplate?.accountingMappingOptions) &&
                                                formData.savingsProductTemplate.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="writeOff">
                                            Write-off <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="writeOff"
                                            value={formData.Accounting?.writeOff || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "writeOff", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Write-off</option>
                                            {Array.isArray(formData.savingsProductTemplate?.accountingMappingOptions) &&
                                                formData.savingsProductTemplate.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Income Section */}
                                <h5>Income</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeFromFees">
                                            Income from Fees <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="incomeFromFees"
                                            value={formData.Accounting?.incomeFromFees || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeFromFees", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Fees</option>
                                            {Array.isArray(formData.savingsProductTemplate?.accountingMappingOptions) &&
                                                formData.savingsProductTemplate.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeFromPenalties">
                                            Income from Penalties <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="incomeFromPenalties"
                                            value={formData.Accounting?.incomeFromPenalties || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeFromPenalties", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Penalties</option>
                                            {Array.isArray(formData.savingsProductTemplate?.accountingMappingOptions) &&
                                                formData.savingsProductTemplate.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-field">
                                    <label htmlFor="overdraftInterestIncome">
                                        Overdraft Interest Income <span className="staged-form-required">*</span>
                                    </label>
                                    <select
                                        id="overdraftInterestIncome"
                                        value={formData.Accounting?.overdraftInterestIncome || ""}
                                        onChange={(e) =>
                                            handleFieldChange("Accounting", "overdraftInterestIncome", e.target.value)
                                        }
                                        required
                                        className="staged-form-select"
                                    >
                                        <option value="">Select Overdraft Interest Income</option>
                                        {Array.isArray(formData.savingsProductTemplate?.accountingMappingOptions) &&
                                            formData.savingsProductTemplate.accountingMappingOptions.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.value}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Advanced Accounting Rules */}
                                <h5>Advanced Accounting Rules</h5>
                                <div className="staged-form-field">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.Accounting?.advancedAccountingRules || false}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "Accounting",
                                                    "advancedAccountingRules",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        Advanced Accounting Rules
                                    </label>
                                </div>
                                {formData.Accounting?.advancedAccountingRules && (
                                    <>
                                        <h5>Advanced Accounting Rules</h5>
                                        <div className="staged-form-row">
                                            <button
                                                className="staged-form-button-add"
                                                onClick={() => handleAddAdvancedRule("fundSources")}
                                            >
                                                Configure Fund Sources for Payment Channels
                                            </button>
                                        </div>
                                        <div className="staged-form-row">
                                            <button
                                                className="staged-form-button-add"
                                                onClick={() => handleAddAdvancedRule("mapFees")}
                                            >
                                                Map Fees to Specific Income Accounts
                                            </button>
                                        </div>
                                        <div className="staged-form-row">
                                            <button
                                                className="staged-form-button-add"
                                                onClick={() => handleAddAdvancedRule("mapPenalties")}
                                            >
                                                Map Penalties to Specific Income Accounts
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* Accrual (periodic) */}
                        {formData.Accounting?.selectedOption === "Accrual (periodic)" && (
                            <>
                                {/* Assets Section */}
                                <h5>Assets</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="savingsReference">
                                            Savings Reference <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="savingsReference"
                                            value={formData.Accounting?.savingsReference || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "savingsReference", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Savings Reference</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="overdraftPortfolio">
                                            Overdraft Portfolio <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="overdraftPortfolio"
                                            value={formData.Accounting?.overdraftPortfolio || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "overdraftPortfolio", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Overdraft Portfolio</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="feesReceivable">
                                            Fees Receivable <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="feesReceivable"
                                            value={formData.Accounting?.feesReceivable || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "feesReceivable", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Fees Receivable</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="penaltiesReceivable">
                                            Penalties Receivable <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="penaltiesReceivable"
                                            value={formData.Accounting?.penaltiesReceivable || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "penaltiesReceivable", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Penalties Receivable</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Liabilities Section */}
                                <h5>Liabilities</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="savingsControl">
                                            Savings Control <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="savingsControl"
                                            value={formData.Accounting?.savingsControl || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "savingsControl", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Savings Control</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="savingsTransferInSuspense">
                                            Savings Transfer in Suspense <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="savingsTransferInSuspense"
                                            value={formData.Accounting?.savingsTransferInSuspense || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "savingsTransferInSuspense", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Savings Transfer in Suspense</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="interestPayable">
                                            Interest Payable <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="interestPayable"
                                            value={formData.Accounting?.interestPayable || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "interestPayable", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Interest Payable</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="escheatLiability">
                                            Escheat Liability <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="escheatLiability"
                                            value={formData.Accounting?.escheatLiability || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "escheatLiability", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Escheat Liability</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Expenses Section */}
                                <h5>Expenses</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="interestOnSavings">
                                            Interest on Savings <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="interestOnSavings"
                                            value={formData.Accounting?.interestOnSavings || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "interestOnSavings", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Interest on Savings</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="writeOff">
                                            Write-off <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="writeOff"
                                            value={formData.Accounting?.writeOff || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "writeOff", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Write-off</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Income Section */}
                                <h5>Income</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeFromFees">
                                            Income from Fees <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="incomeFromFees"
                                            value={formData.Accounting?.incomeFromFees || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeFromFees", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Fees</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeFromPenalties">
                                            Income from Penalties <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="incomeFromPenalties"
                                            value={formData.Accounting?.incomeFromPenalties || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeFromPenalties", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Penalties</option>
                                            {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                                formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-field">
                                    <label htmlFor="overdraftInterestIncome">
                                        Overdraft Interest Income <span className="staged-form-required">*</span>
                                    </label>
                                    <select
                                        id="overdraftInterestIncome"
                                        value={formData.Accounting?.overdraftInterestIncome || ""}
                                        onChange={(e) =>
                                            handleFieldChange("Accounting", "overdraftInterestIncome", e.target.value)
                                        }
                                        required
                                        className="staged-form-select"
                                    >
                                        <option value="">Select Overdraft Interest Income</option>
                                        {Array.isArray(formData.savingsProductTemplate?.chargeOptions) &&
                                            formData.savingsProductTemplate.chargeOptions.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Advanced Accounting Rules */}
                                <h5>Advanced Accounting Rules</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.Accounting?.advancedAccountingRules || false}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        "Accounting",
                                                        "advancedAccountingRules",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            Advanced Accounting Rules
                                        </label>
                                    </div>
                                </div>
                                {formData.Accounting?.advancedAccountingRules && (
                                    <>
                                        <h5>Advanced Accounting Rules</h5>
                                        <div className="staged-form-row">
                                            <button
                                                className="staged-form-button-add"
                                                onClick={() => handleAddAdvancedRule("fundSources")}
                                            >
                                                Configure Fund Sources for Payment Channels
                                            </button>
                                        </div>
                                        <div className="staged-form-row">
                                            <button
                                                className="staged-form-button-add"
                                                onClick={() => handleAddAdvancedRule("mapFees")}
                                            >
                                                Map Fees to Specific Income Accounts
                                            </button>
                                        </div>
                                        <div className="staged-form-row">
                                            <button
                                                className="staged-form-button-add"
                                                onClick={() => handleAddAdvancedRule("mapPenalties")}
                                            >
                                                Map Penalties to Specific Income Accounts
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}


                    </div>
                );

            default:
                return null;
        }
    };

    const renderStageTracker = () => {
        const trackerStages = allStagesComplete
            ? [...stages, "Preview"]
            : stages;

        return (
            <div className="staged-form-stage-tracker">
                {trackerStages.map((stage, index) => (
                    <React.Fragment key={stage}>
                        <div
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
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const renderPreviewSection = () => {
        const stageData = [
            { title: "Details", data: formData.Details },
            { title: "Currency", data: formData.Currency },
            { title: "Terms", data: formData.Terms },
            { title: "Settings", data: formData.Settings },
            { title: "Charges", data: formData.Charges },
            { title: "Accounting", data: formData.Accounting },
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
                        {data && Object.keys(data).length > 0 ? (
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
                                        <td>
                                            {Array.isArray(value)
                                                ? value
                                                    .map((item) =>
                                                        typeof item === "object"
                                                            ? JSON.stringify(item)
                                                            : item
                                                    )
                                                    .join(", ")
                                                : value || "N/A"}
                                        </td>
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

    return (
        <div className="staged-form-create-loan-product">
            {renderStageTracker()}
            <div className="staged-form-stage-content">
                {currentStage === stages.length && allStagesComplete ? (
                    renderPreviewSection()
                ) : (
                    renderStageContent()
                )}
            </div>
            <div className="staged-form-stage-buttons">
                <button onClick={handlePrevious}
                        disabled={currentStage === 0}
                        className="staged-form-button-previous">
                    Previous
                </button>
                {currentStage < stages.length && (
                    <button
                        onClick={handleNext}
                        className="staged-form-button-next"
                        disabled={!isNextDisabled}
                    >
                        Next
                    </button>
                )}
                {currentStage === stages.length && (
                    <button
                        onClick={handlePreview}
                        className="staged-form-button-preview"
                        disabled={!allStagesComplete}
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    );

};

export default CreateSavingsProducts;
