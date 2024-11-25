import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../context/AuthContext";
import { useLoading } from "../../../../../context/LoadingContext";
import { API_CONFIG } from "../../../../../config";
import "./CreateLoanProducts.css";
import {FaEdit, FaTrash} from "react-icons/fa";

const stages = [
    "Details",
    "Currency",
    "Settings",
    "Terms",
    "Charges",
    "Accounting",
];

const CreateLoanProducts = () => {
    const [currentStage, setCurrentStage] = useState(0);
    const [formData, setFormData] = useState({});
    const [completedStages, setCompletedStages] = useState(new Set());
    const [errors, setErrors] = useState({});
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: "",
        data: null,
    });

    const [loanCycleData, setLoanCycleData] = useState({
        principal: [],
        repayments: [],
        interest: [],
    });

    const openModal = (type, data = null) => {
        setModalState({ isOpen: true, type, data });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, type: "", data: null });
    };

    const handleSubmitModalData = (newData) => {
        setLoanCycleData((prevData) => {
            if (!modalState.type) {
                console.warn("modalState.type is not defined");
                return prevData;
            }

            const updatedData = Array.isArray(prevData[modalState.type])
                ? [...prevData[modalState.type]]
                : [];

            if (modalState.data?.id) {
                const index = updatedData.findIndex((item) => item.id === modalState.data.id);
                if (index > -1) {
                    updatedData[index] = { ...newData, id: modalState.data.id };
                } else {
                    console.warn("No matching item found for editing");
                }
            } else {
                const newItem = { ...newData, id: Date.now() };
                updatedData.push(newItem);
            }

            return { ...prevData, [modalState.type]: updatedData };
        });

        closeModal();
    };


    useEffect(() => {
        if (modalState.isOpen) {
            const { condition, loanCycle, default: defaultValue } = modalState.data || {};
            const hasRequiredFields =
                condition &&
                loanCycle !== undefined &&
                loanCycle !== "" &&
                defaultValue !== undefined &&
                defaultValue !== "";
            setIsSubmitDisabled(!hasRequiredFields);
        }
    }, [modalState.isOpen, modalState.data]);

    const handleEditCycle = (type, index) => {
        const itemToEdit = loanCycleData[type][index];
        if (!itemToEdit) {
            console.warn(`No item found at index ${index} for type ${type}`);
            return;
        }
        openModal(type, itemToEdit);
    };

    const handleDeleteCycle = (type, id) => {
        const keyMap = {
            principal: "principal",
            repayments: "repayments",
            interest: "interest",
        };
        const dataKey = keyMap[type];

        if (!dataKey) {
            console.warn(`Unknown type: ${type}`);
            return;
        }

        if (window.confirm("Are you sure you want to delete this item?")) {
            setLoanCycleData((prevData) => ({
                ...prevData,
                [dataKey]: prevData[dataKey].filter((item) => item.id !== id),
            }));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                startLoading();

                const loanProductTemplateResponse = await axios.get(
                    `${API_CONFIG.baseURL}/loanproducts/template`,
                    {
                        headers: {
                            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                            "Fineract-Platform-TenantId": "default",
                            "Content-Type": "application/json",
                        },
                    }
                );

                const globalConfigResponse = await axios.get(
                    `${API_CONFIG.baseURL}/configurations`,
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
                    loanProductTemplate: loanProductTemplateResponse.data,
                    globalConfiguration: globalConfigResponse.data.globalConfiguration,
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                stopLoading();
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        validateStage();
    }, [currentStage, formData]);

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
        setFormData((prevData) => ({
            ...prevData,
            Accounting: {
                ...prevData.Accounting,
                advancedAccountingRules: [
                    ...(prevData.Accounting?.advancedAccountingRules || []),
                    { id: Date.now(), type },
                ],
            },
        }));
    };

    const validateStage = () => {
        const fields = formData[stages[currentStage]] || {};
        const currentErrors = {};

        for (const [key, value] of Object.entries(fields)) {
            const isFieldRequired = document.querySelector(`[name="${key}"]`)?.required;
            if (isFieldRequired && (!value || value.trim() === "")) {
                currentErrors[key] = true;
            }
        }

        setErrors((prev) => ({
            ...prev,
            [stages[currentStage]]: currentErrors,
        }));
        setIsNextDisabled(Object.keys(currentErrors).length > 0);
    };


    const handleNext = () => {
        if (!isNextDisabled) {
            setCompletedStages((prev) => new Set([...prev, stages[currentStage]]));
            setCurrentStage((prev) => prev + 1);
        }
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

                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="fund">Fund</label>
                                <select
                                    id="fund"
                                    value={formData.Details?.fund || ""}
                                    onChange={(e) => handleFieldChange("Details", "fund", e.target.value)}
                                    className="staged-form-select"
                                >
                                    <option value="">Select Fund</option>
                                    {formData.loanProductTemplate?.fundOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Details?.includeInCustomerLoanCounter || false}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Details",
                                                "includeInCustomerLoanCounter",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Include in Customer Loan Counter
                                </label>
                            </div>
                        </div>

                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="startDate">Start Date</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={formData.Details?.startDate || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Details", "startDate", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="closeDate">Close Date</label>
                                <input
                                    id="closeDate"
                                    type="date"
                                    value={formData.Details?.closeDate || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Details", "closeDate", e.target.value)
                                    }
                                    className="staged-form-input"
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
                                    {formData.loanProductTemplate?.currencyOptions?.map((option) => (
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
                            <div className="staged-form-field">
                                <label htmlFor="installmentMultiples">
                                    Installment in Multiples Of
                                </label>
                                <input
                                    id="installmentMultiples"
                                    name="installmentMultiples"
                                    type="number"
                                    min="0"
                                    value={formData.Currency?.installmentMultiples || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Currency", "installmentMultiples", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>
                    </div>
                );
            case "Settings":
                return (
                    <div className="staged-form-settings">
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="amortization">
                                    Amortization <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="amortization"
                                    value={formData.Settings?.amortization || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "amortization", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">Select Amortization</option>
                                    {formData.loanProductTemplate?.amortizationTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="interestMethod">
                                    Interest Method <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="interestMethod"
                                    value={formData.Settings?.interestMethod || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "interestMethod", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">Select Interest Method</option>
                                    {formData.loanProductTemplate?.interestTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="interestCalculationPeriod">
                                    Interest Calculation Period{" "}
                                    <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="interestCalculationPeriod"
                                    value={formData.Settings?.interestCalculationPeriod || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "interestCalculationPeriod", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">Select Calculation Period</option>
                                    {formData.loanProductTemplate?.interestCalculationPeriodTypeOptions?.map(
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
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.isEqualAmortization || false}
                                        onChange={(e) =>
                                            handleFieldChange("Settings", "isEqualAmortization", e.target.checked)
                                        }
                                    />
                                    Is Equal Amortization?
                                </label>
                            </div>
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={
                                            formData.Settings?.calculateInterestForExactDays || false
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "calculateInterestForExactDays",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Calculate Interest for Exact Days in Partial Period
                                </label>
                            </div>
                        </div>

                        {/* Loan Schedule Section */}
                        <h4 className="staged-form-section-title">Loan Schedule</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="loanScheduleType">
                                    Loan Schedule Type <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="loanScheduleType"
                                    value={formData.Settings?.loanScheduleType || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "loanScheduleType", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">Select Loan Schedule Type</option>
                                    {formData.loanProductTemplate?.loanScheduleTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="repaymentStrategy">
                                    Repayment Strategy <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="repaymentStrategy"
                                    value={formData.Settings?.repaymentStrategy || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "repaymentStrategy", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">Select Repayment Strategy</option>
                                    {formData.loanProductTemplate?.transactionProcessingStrategyOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Loan Tranche Details Section */}
                        <h4 className="staged-form-section-title">Loan Tranche Details</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.enableMultipleDisbursals || false}
                                        onChange={(e) =>
                                            handleFieldChange("Settings", "enableMultipleDisbursals", e.target.checked)
                                        }
                                    />
                                    Enable Multiple Disbursals
                                </label>
                            </div>
                        </div>
                        <h4 className="staged-form-section-title">Down Payment </h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.enableDownPayment || false}
                                        onChange={(e) =>
                                            handleFieldChange("Settings", "enableDownPayment", e.target.checked)
                                        }
                                    />
                                    Enable Down Payment
                                </label>
                            </div>
                        </div>

                        {/* Moratorium Section */}
                        <h4 className="staged-form-section-title">Moratorium</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="gracePrincipalPayment">Grace on Principal Payment</label>
                                <input
                                    id="gracePrincipalPayment"
                                    type="number" min={0}
                                    value={formData.Settings?.gracePrincipalPayment || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "gracePrincipalPayment", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="graceInterestPayment">Grace on Interest Payment</label>
                                <input
                                    id="graceInterestPayment"
                                    type="number" min={0}
                                    value={formData.Settings?.graceInterestPayment || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "graceInterestPayment", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>
                        {/* Delinquency Section */}
                        <h4 className="staged-form-section-title">Delinquency</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="delinquencyBucket">Delinquency Bucket</label>
                                <select
                                    id="delinquencyBucket"
                                    value={formData.Settings?.delinquencyBucket || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "delinquencyBucket", e.target.value)
                                    }
                                    className="staged-form-select"
                                >
                                    <option value="">Select Delinquency Bucket</option>
                                    {formData.loanProductTemplate?.delinquencyBucketOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {formData.Settings?.delinquencyBucket && (
                                <div className="staged-form-field">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.Settings?.enableInstallmentLevelDelinquency || false}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "Settings",
                                                    "enableInstallmentLevelDelinquency",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        Enable Installment Level Delinquency
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Interest Free Period Section */}
                        <h4 className="staged-form-section-title">Interest Free Period</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="interestFreePeriod">Interest Free Period</label>
                                <input
                                    id="interestFreePeriod"
                                    type="number" min={0}
                                    value={formData.Settings?.interestFreePeriod || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "interestFreePeriod", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="arrearsTolerance">Arrears Tolerance</label>
                                <input
                                    id="arrearsTolerance"
                                    type="number" min={0}
                                    value={formData.Settings?.arrearsTolerance || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "arrearsTolerance", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>

                        {/* Days in Year/Month Section */}
                        <h4 className="staged-form-section-title">Days in Year/Month</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="daysInYear">
                                    Days in Year <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="daysInYear"
                                    value={formData.Settings?.daysInYear || formData.loanProductTemplate?.daysInYearType?.id || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "daysInYear", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    {formData.loanProductTemplate?.daysInYearTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="daysInMonth">
                                    Days in Month <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="daysInMonth"
                                    value={formData.Settings?.daysInMonth || formData.loanProductTemplate?.daysInMonthType?.id || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "daysInMonth", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    {formData.loanProductTemplate?.daysInMonthTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.allowFixingInstallmentAmount || false}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "allowFixingInstallmentAmount",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Allow Fixing of the Installment Amount
                                </label>
                            </div>
                        </div>

                        {/* Overdue and NPA Settings */}
                        <h4 className="staged-form-section-title">Overdue and NPA (Non-Performing Assets) Settings</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="onArrearsAging">
                                    Number of Days a Loan May Be Overdue Before Moving into Arrears
                                </label>
                                <input
                                    id="onArrearsAging"
                                    type="number" min={0}
                                    value={formData.Settings?.onArrearsAging || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "onArrearsAging", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="overdueDays">
                                    Maximum Number of Days a Loan May Be Overdue Before Becoming NPA
                                </label>
                                <input
                                    id="overdueDays"
                                    type="number" min={0}
                                    value={formData.Settings?.overdueDays || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "overdueDays", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.accountMovesOutOfNPA || false}
                                        onChange={(e) =>
                                            handleFieldChange("Settings", "accountMovesOutOfNPA", e.target.checked)
                                        }
                                    />
                                    Account Moves Out of NPA Only After All Arrears Have Been Cleared
                                </label>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="principalThreshold">
                                    Principal Threshold (%) for Last Installment
                                </label>
                                <input
                                    id="principalThreshold"
                                    type="number" min={0}
                                    value={formData.Settings?.principalThreshold || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "principalThreshold", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>

                        {/* Variable Installments */}
                        <h4 className="staged-form-section-title">Variable Installments</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.variableInstallments || false}
                                        onChange={(e) =>
                                            handleFieldChange("Settings", "variableInstallments", e.target.checked)
                                        }
                                    />
                                    Are Variable Installments Allowed?
                                </label>
                            </div>
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.topUpLoans || false}
                                        onChange={(e) =>
                                            handleFieldChange("Settings", "topUpLoans", e.target.checked)
                                        }
                                    />
                                    Allowed to Be Used for Providing Top Up Loans
                                </label>
                            </div>
                        </div>

                        {/* Interest Recalculation */}
                        <h4 className="staged-form-section-title">Interest Recalculation</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.recalculateInterest || false}
                                        onChange={(e) =>
                                            handleFieldChange("Settings", "recalculateInterest", e.target.checked)
                                        }
                                    />
                                    Recalculate Interest
                                </label>
                            </div>
                        </div>

                        {/* Guarantee Requirements */}
                        <h4 className="staged-form-section-title">Guarantee Requirements</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.placeGuaranteeFundsOnHold || false}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "placeGuaranteeFundsOnHold",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Place Guarantee Funds On-Hold
                                </label>
                            </div>
                        </div>

                        {/* Event Settings */}
                        <h4 className="staged-form-section-title">Event Settings</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.useGlobalRepaymentEventConfig || false}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Settings",
                                                "useGlobalRepaymentEventConfig",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Use the Global Configurations Values for the Repayment Event (Notifications)
                                </label>
                            </div>
                        </div>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="dueDaysForRepayment">
                                    Due Days for Repayment Event
                                </label>
                                <input
                                    id="dueDaysForRepayment"
                                    type="number" min={0}
                                    value={formData.Settings?.dueDaysForRepayment || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "dueDaysForRepayment", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="overDueDaysForRepayment">
                                    Overdue Days for Repayment Event
                                </label>
                                <input
                                    id="overDueDaysForRepayment"
                                    type="number" min={0}
                                    value={formData.Settings?.overDueDaysForRepayment || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Settings", "overDueDaysForRepayment", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>
                        {/* Configurable Terms and Settings */}
                        <h4 className="staged-form-section-title">Configurable Terms and Settings</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Settings?.allowOverridingTerms ?? true} // Default to checked
                                        onChange={(e) =>
                                            handleFieldChange("Settings", "allowOverridingTerms", e.target.checked)
                                        }
                                    />
                                    Allow Overriding Select Terms and Settings in Loan Accounts
                                </label>
                            </div>
                        </div>
                        {formData.Settings?.allowOverridingTerms && (
                            <>
                                {/* Row 1: Amortization and Interest Method */}
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.Settings?.overrideAmortization ?? true} // Default to checked
                                                onChange={(e) =>
                                                    handleFieldChange("Settings", "overrideAmortization", e.target.checked)
                                                }
                                            />
                                            Amortization
                                        </label>
                                    </div>
                                    <div className="staged-form-field">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.Settings?.overrideInterestMethod ?? true} // Default to checked
                                                onChange={(e) =>
                                                    handleFieldChange("Settings", "overrideInterestMethod", e.target.checked)
                                                }
                                            />
                                            Interest Method
                                        </label>
                                    </div>
                                </div>

                                {/* Row 2: Repayment Strategy and Interest Calculation Period */}
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.Settings?.overrideRepaymentStrategy ?? true} // Default to checked
                                                onChange={(e) =>
                                                    handleFieldChange("Settings", "overrideRepaymentStrategy", e.target.checked)
                                                }
                                            />
                                            Repayment Strategy
                                        </label>
                                    </div>
                                    <div className="staged-form-field">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.Settings?.overrideInterestCalculationPeriod ?? true} // Default to checked
                                                onChange={(e) =>
                                                    handleFieldChange("Settings", "overrideInterestCalculationPeriod", e.target.checked)
                                                }
                                            />
                                            Interest Calculation Period
                                        </label>
                                    </div>
                                </div>

                                {/* Row 3: Arrears Tolerance and Repaid Every */}
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.Settings?.overrideArrearsTolerance ?? true} // Default to checked
                                                onChange={(e) =>
                                                    handleFieldChange("Settings", "overrideArrearsTolerance", e.target.checked)
                                                }
                                            />
                                            Arrears Tolerance
                                        </label>
                                    </div>
                                    <div className="staged-form-field">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.Settings?.overrideRepaidEvery ?? true} // Default to checked
                                                onChange={(e) =>
                                                    handleFieldChange("Settings", "overrideRepaidEvery", e.target.checked)
                                                }
                                            />
                                            Repaid Every
                                        </label>
                                    </div>
                                </div>

                                {/* Row 4: Moratorium and Overdue Days */}
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.Settings?.overrideMoratorium ?? true} // Default to checked
                                                onChange={(e) =>
                                                    handleFieldChange("Settings", "overrideMoratorium", e.target.checked)
                                                }
                                            />
                                            Moratorium
                                        </label>
                                    </div>
                                    <div className="staged-form-field">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.Settings?.overrideOverdueDays ?? true} // Default to checked
                                                onChange={(e) =>
                                                    handleFieldChange("Settings", "overrideOverdueDays", e.target.checked)
                                                }
                                            />
                                            Number of Days a Loan May Be Overdue Before Moving Into Arrears
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            case "Terms":
                return (
                    <div className="staged-form-terms">
                        {/* Principal Section */}
                        <h4 className="staged-form-section-title">Principal</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="principalMin">Minimum</label>
                                <input
                                    id="principalMin"
                                    type="number"
                                    value={formData.Terms?.principalMin || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "principalMin", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="principalDefault">
                                    Default <span className="staged-form-required">*</span>
                                </label>
                                <input
                                    id="principalDefault"
                                    type="number"
                                    value={formData.Terms?.principalDefault || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "principalDefault", e.target.value)
                                    }
                                    className={`staged-form-input ${
                                        errors.Terms?.principalDefault ? "staged-form-error" : ""
                                    }`}
                                    required
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="principalMax">Maximum</label>
                                <input
                                    id="principalMax"
                                    type="number"
                                    value={formData.Terms?.principalMax || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "principalMax", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>

                        {/* Allow Approval/Disbursal Above Loan Amount */}
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Terms?.allowApprovalAboveLoanAmount || false}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Terms",
                                                "allowApprovalAboveLoanAmount",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    Allow Approval/Disbursal Above Loan Applied Amount
                                </label>
                            </div>
                        </div>

                        {/* Over Amount Fields */}
                        {formData.Terms?.allowApprovalAboveLoanAmount && (
                            <div className="staged-form-row">
                                <div className="staged-form-field">
                                    <label htmlFor="overAmountCalcType">
                                        Over Amount Calculation Type{" "}
                                        <span className="staged-form-required">*</span>
                                    </label>
                                    <select
                                        id="overAmountCalcType"
                                        value={formData.Terms?.overAmountCalcType || ""}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "Terms",
                                                "overAmountCalcType",
                                                e.target.value
                                            )
                                        }
                                        className="staged-form-select"
                                        required
                                    >
                                        <option value="">Select Calculation Type</option>
                                        {formData.loanProductTemplate?.overAmountCalcTypeOptions?.map(
                                            (option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.value}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div className="staged-form-field">
                                    <label htmlFor="overAmount">
                                        Over Amount <span className="staged-form-required">*</span>
                                    </label>
                                    <input
                                        id="overAmount"
                                        type="number"
                                        value={formData.Terms?.overAmount || ""}
                                        onChange={(e) =>
                                            handleFieldChange("Terms", "overAmount", e.target.value)
                                        }
                                        className={`staged-form-input ${
                                            errors.Terms?.overAmount ? "staged-form-error" : ""
                                        }`}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Installment Day Calculation */}
                        <h4 className="staged-form-section-title">Installment Day Calculation</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="installmentDayCalcFrom">
                                    Installment Day Calculation From{" "}
                                    <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="installmentDayCalcFrom"
                                    value={formData.Terms?.installmentDayCalcFrom || ""}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "Terms",
                                            "installmentDayCalcFrom",
                                            e.target.value
                                        )
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">Select Option</option>
                                    {formData.loanProductTemplate?.installmentDayCalcFromOptions?.map(
                                        (option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.value}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>
                        {/* Number of Repayments */}
                        <h4 className="staged-form-section-title">Number of Repayments</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="repaymentMin">Minimum</label>
                                <input
                                    id="repaymentMin"
                                    type="number"
                                    value={formData.Terms?.repaymentMin || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "repaymentMin", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="repaymentDefault">
                                    Default <span className="staged-form-required">*</span>
                                </label>
                                <input
                                    id="repaymentDefault"
                                    type="number"
                                    value={formData.Terms?.repaymentDefault || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "repaymentDefault", e.target.value)
                                    }
                                    className={`staged-form-input ${
                                        errors.Terms?.repaymentDefault ? "staged-form-error" : ""
                                    }`}
                                    required
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="repaymentMax">Maximum</label>
                                <input
                                    id="repaymentMax"
                                    type="number"
                                    value={formData.Terms?.repaymentMax || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "repaymentMax", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>

                        {/* Interest Rates Section */}
                        <h4 className="staged-form-section-title">Interest Rates</h4>
                        <div className="staged-form-row">
                            {/* Is Zero Interest Rate? */}
                            {!formData.Terms?.isLinkedToFloatingRates && (
                                <div className="staged-form-field">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.Terms?.isZeroInterestRate || false}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                handleFieldChange("Terms", "isZeroInterestRate", isChecked);
                                                if (isChecked) {
                                                    // Nullify values for floating interest and nominal interest rates
                                                    handleFieldChange("Terms", "isLinkedToFloatingRates", false);
                                                    handleFieldChange("Terms", "floatingRate", "");
                                                    handleFieldChange("Terms", "differentialRate", "");
                                                    handleFieldChange("Terms", "isFloatingCalcAllowed", false);
                                                    handleFieldChange("Terms", "floatingMin", "");
                                                    handleFieldChange("Terms", "floatingDefault", "");
                                                    handleFieldChange("Terms", "floatingMax", "");
                                                } else {
                                                    // Nullify nominal interest rate when unchecked
                                                    handleFieldChange("Terms", "nominalInterestMin", "");
                                                    handleFieldChange("Terms", "nominalInterestDefault", "");
                                                    handleFieldChange("Terms", "nominalInterestMax", "");
                                                }
                                            }}
                                        />
                                        Is Zero Interest Rate?
                                    </label>
                                </div>
                            )}

                            {/* Is Linked to Floating Interest Rates */}
                            {!formData.Terms?.isZeroInterestRate && (
                                <div className="staged-form-field">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.Terms?.isLinkedToFloatingRates || false}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                handleFieldChange("Terms", "isLinkedToFloatingRates", isChecked);
                                                if (isChecked) {
                                                    // Nullify values for nominal interest rates
                                                    handleFieldChange("Terms", "nominalInterestMin", "");
                                                    handleFieldChange("Terms", "nominalInterestDefault", "");
                                                    handleFieldChange("Terms", "nominalInterestMax", "");
                                                } else {
                                                    // Nullify floating interest values when unchecked
                                                    handleFieldChange("Terms", "floatingRate", "");
                                                    handleFieldChange("Terms", "differentialRate", "");
                                                    handleFieldChange("Terms", "isFloatingCalcAllowed", false);
                                                    handleFieldChange("Terms", "floatingMin", "");
                                                    handleFieldChange("Terms", "floatingDefault", "");
                                                    handleFieldChange("Terms", "floatingMax", "");
                                                }
                                            }}
                                        />
                                        Is Linked to Floating Interest Rates?
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Nominal Interest Rate Logic */}
                        {!formData.Terms?.isZeroInterestRate &&
                            !formData.Terms?.isLinkedToFloatingRates && (
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="nominalInterestMin">Minimum</label>
                                        <input
                                            id="nominalInterestMin"
                                            type="number"
                                            value={formData.Terms?.nominalInterestMin || ""}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "Terms",
                                                    "nominalInterestMin",
                                                    e.target.value
                                                )
                                            }
                                            className="staged-form-input"
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="nominalInterestDefault">
                                            Default <span className="staged-form-required">*</span>
                                        </label>
                                        <input
                                            id="nominalInterestDefault"
                                            type="number"
                                            value={formData.Terms?.nominalInterestDefault || ""}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "Terms",
                                                    "nominalInterestDefault",
                                                    e.target.value
                                                )
                                            }
                                            className={`staged-form-input ${
                                                errors.Terms?.nominalInterestDefault ? "staged-form-error" : ""
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="nominalInterestMax">Maximum</label>
                                        <input
                                            id="nominalInterestMax"
                                            type="number"
                                            value={formData.Terms?.nominalInterestMax || ""}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "Terms",
                                                    "nominalInterestMax",
                                                    e.target.value
                                                )
                                            }
                                            className="staged-form-input"
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="frequency">
                                            Frequency <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="frequency"
                                            value={formData.Terms?.frequency || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Terms", "frequency", e.target.value)
                                            }
                                            className="staged-form-select"
                                            required
                                        >
                                            <option value="">Select Frequency</option>
                                            {formData.loanProductTemplate?.interestRateFrequencyTypeOptions?.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                        {/* Floating Interest Rate Logic */}
                        {formData.Terms?.isLinkedToFloatingRates && (
                            <>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="floatingRate">Floating Rate</label>
                                        <select
                                            id="floatingRate"
                                            value={formData.Terms?.floatingRate || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Terms", "floatingRate", e.target.value)
                                            }
                                            className="staged-form-select"
                                            required
                                        >
                                            <option value="">Select Floating Rate</option>
                                            {formData.loanProductTemplate?.floatingRateOptions?.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="differentialRate">
                                            Differential Rate <span className="staged-form-required">*</span>
                                        </label>
                                        <input
                                            id="differentialRate"
                                            type="number"
                                            value={formData.Terms?.differentialRate || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Terms", "differentialRate", e.target.value)
                                            }
                                            className={`staged-form-input ${
                                                errors.Terms?.differentialRate ? "staged-form-error" : ""
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={formData.Terms?.isFloatingCalcAllowed || false}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        "Terms",
                                                        "isFloatingCalcAllowed",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            Is Floating Calculation Allowed?
                                        </label>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="floatingMin">
                                            Minimum <span className="staged-form-required">*</span>
                                        </label>
                                        <input
                                            id="floatingMin"
                                            type="number"
                                            value={formData.Terms?.floatingMin || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Terms", "floatingMin", e.target.value)
                                            }
                                            className="staged-form-input"
                                            required
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="floatingDefault">
                                            Default <span className="staged-form-required">*</span>
                                        </label>
                                        <input
                                            id="floatingDefault"
                                            type="number"
                                            value={formData.Terms?.floatingDefault || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Terms", "floatingDefault", e.target.value)
                                            }
                                            className={`staged-form-input ${
                                                errors.Terms?.floatingDefault ? "staged-form-error" : ""
                                            }`}
                                            required
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="floatingMax">
                                            Maximum <span className="staged-form-required">*</span>
                                        </label>
                                        <input
                                            id="floatingMax"
                                            type="number"
                                            value={formData.Terms?.floatingMax || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Terms", "floatingMax", e.target.value)
                                            }
                                            className="staged-form-input"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Variations Section */}
                        <h4 className="staged-form-section-title">Variations</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.Terms?.termsVaryByLoanCycle || false}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            handleFieldChange("Terms", "termsVaryByLoanCycle", isChecked);

                                            if (!isChecked) {
                                                // Clear loan cycle data if unchecked
                                                setLoanCycleData({
                                                    principal: [],
                                                    repayments: [],
                                                    interest: [],
                                                });
                                            }
                                        }}
                                    />
                                    Terms Vary Based on Loan Cycle
                                </label>
                            </div>
                        </div>
                        {formData.Terms?.termsVaryByLoanCycle && (
                            <>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="principal">Principal by Loan Cycle</label>
                                    </div>
                                    <button
                                        onClick={() => openModal("principal")}
                                        className="staged-form-button-add"
                                    >
                                        Add
                                    </button>
                                </div>
                                {loanCycleData.principal?.length > 0 && (
                                    <table className="staged-form-table">
                                        <thead>
                                        <tr>
                                            <th>Condition</th>
                                            <th>Loan Cycle</th>
                                            <th>Minimum</th>
                                            <th>Default</th>
                                            <th>Maximum</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {loanCycleData.principal.map((item, index) => {
                                            const conditionValue =
                                                formData.loanProductTemplate?.valueConditionTypeOptions?.find(
                                                    (option) => option.id.toString() === item.condition.toString()
                                                )?.value || "Unknown Condition";

                                            return (
                                                <tr key={item.id}>
                                                    <td>{conditionValue}</td>
                                                    <td>{item.loanCycle}</td>
                                                    <td>{item.min}</td>
                                                    <td>{item.default}</td>
                                                    <td>{item.max}</td>
                                                    <td>
                                                        <button
                                                            className="staged-form-icon-button-edit"
                                                            onClick={() => handleEditCycle("principal", index)}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="staged-form-icon-button-delete"
                                                            onClick={() => handleDeleteCycle("principal", item.id)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                )}
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="repayments">Number of Repayments by Loan Cycle</label>
                                    </div>
                                    <button
                                        onClick={() => openModal("repayments")}
                                        className="staged-form-button-add"
                                    >
                                        Add
                                    </button>
                                </div>
                                {loanCycleData.repayments?.length > 0 && (
                                    <table className="staged-form-table">
                                        <thead>
                                        <tr>
                                            <th>Condition</th>
                                            <th>Loan Cycle</th>
                                            <th>Minimum</th>
                                            <th>Default</th>
                                            <th>Maximum</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {loanCycleData.repayments.map((item, index) => {
                                            const conditionValue =
                                                formData.loanProductTemplate?.valueConditionTypeOptions?.find(
                                                    (option) => option.id.toString() === item.condition.toString()
                                                )?.value || "Unknown Condition";

                                            return (
                                                <tr key={item.id}>
                                                    <td>{conditionValue}</td>
                                                    <td>{item.loanCycle}</td>
                                                    <td>{item.min}</td>
                                                    <td>{item.default}</td>
                                                    <td>{item.max}</td>
                                                    <td>
                                                        <button
                                                            className="staged-form-icon-button-edit"
                                                            onClick={() => handleEditCycle("repayments", index)}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="staged-form-icon-button-delete"
                                                            onClick={() => handleDeleteCycle("repayments", item.id)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                )}


                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="interest">Nominal Interest Rate by Loan Cycle</label>
                                    </div>
                                    <button
                                        onClick={() => openModal("interest")}
                                        className="staged-form-button-add"
                                    >
                                        Add
                                    </button>
                                </div>
                                {loanCycleData.interest?.length > 0 && (
                                    <table className="staged-form-table">
                                        <thead>
                                        <tr>
                                            <th>Condition</th>
                                            <th>Loan Cycle</th>
                                            <th>Minimum</th>
                                            <th>Default</th>
                                            <th>Maximum</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {loanCycleData.interest.map((item, index) => {
                                            const conditionValue =
                                                formData.loanProductTemplate?.valueConditionTypeOptions?.find(
                                                    (option) => option.id.toString() === item.condition.toString()
                                                )?.value || "Unknown Condition"; // Fallback to "Unknown Condition"

                                            return (
                                                <tr key={item.id}>
                                                    <td>{conditionValue}</td>
                                                    <td>{item.loanCycle}</td>
                                                    <td>{item.min}</td>
                                                    <td>{item.default}</td>
                                                    <td>{item.max}</td>
                                                    <td>
                                                        <button
                                                            className="staged-form-icon-button-edit"
                                                            onClick={() => handleEditCycle("interest", index)}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="staged-form-icon-button-delete"
                                                            onClick={() => handleDeleteCycle("interest", item.id)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                )}

                            </>
                        )}


                        {/* Repaid Every Section */}
                        <h4 className="staged-form-section-title">Repaid Every</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="frequencyRepaid">
                                    Frequency <span className="staged-form-required">*</span>
                                </label>
                                <input
                                    id="frequencyRepaid"
                                    type="number"
                                    value={formData.Terms?.frequencyRepaid || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "frequencyRepaid", e.target.value)
                                    }
                                    className={`staged-form-input ${
                                        errors.Terms?.frequencyRepaid ? "staged-form-error" : ""
                                    }`}
                                    required
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="frequencyType">
                                    Frequency Type <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="frequencyType"
                                    value={formData.Terms?.frequencyType || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "frequencyType", e.target.value)
                                    }
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    {formData.loanProductTemplate?.repaymentFrequencyTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Minimum Days Between Disbursal and First Repayment Date */}
                        <div className="staged-form-field">
                            <label htmlFor="minDaysDisbursalToRepayment">
                                Minimum Days Between Disbursal and First Repayment Date
                            </label>
                            <input
                                id="minDaysDisbursalToRepayment"
                                type="number"
                                value={formData.Terms?.minDaysDisbursalToRepayment || ""}
                                onChange={(e) =>
                                    handleFieldChange("Terms", "minDaysDisbursalToRepayment", e.target.value)
                                }
                                className="staged-form-input"
                            />
                        </div>
                        {/* Interest Recalculation */}
                        <h4 className="staged-form-section-title">Interest Recalculation</h4>
                        <div className="staged-form-field">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.Terms?.recalculateInterest || false}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "recalculateInterest", e.target.checked)
                                    }
                                />
                                Recalculate Interest
                            </label>
                        </div>

                        {/* Guarantee Requirements */}
                        <h4 className="staged-form-section-title">Guarantee Requirements</h4>
                        <div className="staged-form-field">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.Terms?.placeGuaranteeFundsOnHold || false}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "placeGuaranteeFundsOnHold", e.target.checked)
                                    }
                                />
                                Place Guarantee Funds On-Hold
                            </label>
                        </div>

                        {/* Event Settings */}
                        <h4 className="staged-form-section-title">Event Settings</h4>
                        <div className="staged-form-field">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={
                                        formData.Terms?.useGlobalConfigurationsForRepaymentEvent || false
                                    }
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "Terms",
                                            "useGlobalConfigurationsForRepaymentEvent",
                                            e.target.checked
                                        )
                                    }
                                />
                                Use the Global Configurations Values for the Repayment Event (Notifications)
                            </label>
                        </div>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="dueDaysRepaymentEvent">
                                    Due Days for Repayment Event
                                </label>
                                <input
                                    id="dueDaysRepaymentEvent"
                                    type="number"
                                    value={formData.Terms?.dueDaysRepaymentEvent || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "dueDaysRepaymentEvent", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="overdueDaysRepaymentEvent">
                                    Overdue Days for Repayment Event
                                </label>
                                <input
                                    id="overdueDaysRepaymentEvent"
                                    type="number"
                                    value={formData.Terms?.overdueDaysRepaymentEvent || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Terms", "overdueDaysRepaymentEvent", e.target.value)
                                    }
                                    className="staged-form-input"
                                />
                            </div>
                        </div>
                    </div>
                );
            case "Charges":
                return (
                    <div className="staged-form-charges">
                        <h4 className="staged-form-section-title">Charges</h4>

                        {/* Regular Charges */}
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
                                    {formData.loanProductTemplate?.creditAllocationAllocationTypes
                                        ?.filter(
                                            (option) =>
                                                !loanCycleData.charges?.some(
                                                    (item) => parseInt(item.charge) === option.id
                                                )
                                        )
                                        .map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.value}
                                            </option>
                                        ))}
                                </select>

                            </div>
                            <button
                                className="staged-form-button-add"
                                onClick={() => {
                                    if (formData.Charges?.selectedCharge) {
                                        setLoanCycleData((prevData) => ({
                                            ...prevData,
                                            charges: [
                                                ...(prevData.charges || []),
                                                {id: Date.now(), charge: formData.Charges.selectedCharge},
                                            ],
                                        }));
                                        handleFieldChange("Charges", "selectedCharge", ""); // Clear selection
                                    }
                                }}
                                disabled={!formData.Charges?.selectedCharge}
                            >
                                Add
                            </button>
                        </div>
                        {loanCycleData.charges?.length > 0 && (
                            <table className="staged-form-table">
                                <thead>
                                <tr>
                                    <th>Charge</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loanCycleData.charges.map((item, index) => {
                                    const chargeValue = formData.loanProductTemplate?.creditAllocationAllocationTypes?.find(
                                        (option) => option.id === parseInt(item.charge)
                                    )?.value || item.charge;

                                    return (
                                        <tr key={item.id}>
                                            <td>{chargeValue}</td>
                                            <td>
                                                <button
                                                    className="staged-form-icon-button-delete"
                                                    onClick={() => {
                                                        setLoanCycleData((prevData) => ({
                                                            ...prevData,
                                                            charges: prevData.charges.filter((_, i) => i !== index),
                                                        }));
                                                    }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        )}

                        {/* Overdue Charges */}
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="overdueCharge">Overdue Charges</label>
                                <select
                                    id="overdueCharge"
                                    value={formData.Charges?.selectedOverdueCharge || ""}
                                    onChange={(e) =>
                                        handleFieldChange("Charges", "selectedOverdueCharge", e.target.value)
                                    }
                                    className="staged-form-select"
                                >
                                    <option value="">Select Overdue Charge</option>
                                    {formData.loanProductTemplate?.advancedPaymentAllocationTypes
                                        ?.filter(
                                            (option) =>
                                                !loanCycleData.overdueCharges?.some(
                                                    (item) => parseInt(item.overdueCharge) === option.id
                                                )
                                        )
                                        .map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.value}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <button
                                className="staged-form-button-add"
                                onClick={() => {
                                    if (formData.Charges?.selectedOverdueCharge) {
                                        setLoanCycleData((prevData) => ({
                                            ...prevData,
                                            overdueCharges: [
                                                ...(prevData.overdueCharges || []),
                                                {
                                                    id: Date.now(),
                                                    overdueCharge: formData.Charges.selectedOverdueCharge,
                                                },
                                            ],
                                        }));
                                        handleFieldChange("Charges", "selectedOverdueCharge", ""); // Clear selection
                                    }
                                }}
                                disabled={!formData.Charges?.selectedOverdueCharge}
                            >
                                Add
                            </button>
                        </div>
                        {loanCycleData.overdueCharges?.length > 0 && (
                            <table className="staged-form-table">
                                <thead>
                                <tr>
                                    <th>Overdue Charge</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loanCycleData.overdueCharges.map((item, index) => {
                                    const overdueChargeValue = formData.loanProductTemplate?.advancedPaymentAllocationTypes?.find(
                                        (option) => option.id === parseInt(item.overdueCharge)
                                    )?.value || item.overdueCharge; // Fallback to the overdueCharge ID if no match is found

                                    return (
                                        <tr key={item.id}>
                                            <td>{overdueChargeValue}</td>
                                            <td>
                                                <button
                                                    className="staged-form-icon-button-delete"
                                                    onClick={() => {
                                                        setLoanCycleData((prevData) => ({
                                                            ...prevData,
                                                            overdueCharges: prevData.overdueCharges.filter((_, i) => i !== index),
                                                        }));
                                                    }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                            {["None", "Cash", "Accrual (periodic)", "Accrual (upfront)"].map((option) => (
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

                        {/* Render Fields Based on Selected Option */}
                        {formData.Accounting?.selectedOption === "Cash" && (
                            <>
                                <h5>Assets / Liabilities</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="fundSource">Fund Source</label>
                                        <select
                                            id="fundSource"
                                            value={formData.Accounting?.fundSource || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "fundSource", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Fund Source</option>
                                            {Array.isArray(formData.loanProductTemplate?.fundOptions) &&
                                                formData.loanProductTemplate?.fundOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Assets Section */}
                                <h5>Assets</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="loanPortfolio">Loan Portfolio</label>
                                        <select
                                            id="loanPortfolio"
                                            value={formData.Accounting?.loanPortfolio || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "loanPortfolio", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Loan Portfolio</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="transferSuspense">Transfer in Suspense</label>
                                        <select
                                            id="transferSuspense"
                                            value={formData.Accounting?.transferSuspense || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "transferSuspense", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Transfer in Suspense</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
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
                                        <label htmlFor="incomeInterest">Income from Interest</label>
                                        <select
                                            id="incomeInterest"
                                            value={formData.Accounting?.incomeInterest || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeInterest", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Interest</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeFees">Income from Fees</label>
                                        <select
                                            id="incomeFees"
                                            value={formData.Accounting?.incomeFees || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeFees", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Fees</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomePenalties">Income from Penalties</label>
                                        <select
                                            id="incomePenalties"
                                            value={formData.Accounting?.incomePenalties || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomePenalties", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Penalties</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeRecovery">Income from Recovery Repayments</label>
                                        <select
                                            id="incomeRecovery"
                                            value={formData.Accounting?.incomeRecovery || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeRecovery", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Recovery Repayments</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeChargeOffInterest">Income from Charge-Off Interest</label>
                                        <select
                                            id="incomeChargeOffInterest"
                                            value={formData.Accounting?.incomeChargeOffInterest || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeChargeOffInterest", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Charge-Off Interest</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeChargeOffFees">Income from Charge-Off Fees</label>
                                        <select
                                            id="incomeChargeOffFees"
                                            value={formData.Accounting?.incomeChargeOffFees || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeChargeOffFees", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Charge-Off Fees</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeChargeOffPenalty">Income from Charge-Off Penalty</label>
                                        <select
                                            id="incomeChargeOffPenalty"
                                            value={formData.Accounting?.incomeChargeOffPenalty || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeChargeOffPenalty", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Charge-Off Penalty</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeGoodwillCreditInterest">
                                            Income from Goodwill Credit Interest
                                        </label>
                                        <select
                                            id="incomeGoodwillCreditInterest"
                                            value={formData.Accounting?.incomeGoodwillCreditInterest || ""}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "Accounting",
                                                    "incomeGoodwillCreditInterest",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Goodwill Credit Interest</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeGoodwillCreditFees">Income from Goodwill Credit
                                            Fees</label>
                                        <select
                                            id="incomeGoodwillCreditFees"
                                            value={formData.Accounting?.incomeGoodwillCreditFees || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeGoodwillCreditFees", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Goodwill Credit Fees</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeGoodwillCreditPenalty">
                                            Income from Goodwill Credit Penalty
                                        </label>
                                        <select
                                            id="incomeGoodwillCreditPenalty"
                                            value={formData.Accounting?.incomeGoodwillCreditPenalty || ""}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "Accounting",
                                                    "incomeGoodwillCreditPenalty",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Goodwill Credit Penalty</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Expenses Section */}
                                <h5>Expenses</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="lossesWrittenOff">Losses Written Off</label>
                                        <select
                                            id="lossesWrittenOff"
                                            value={formData.Accounting?.lossesWrittenOff || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "lossesWrittenOff", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Losses Written Off</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="goodwillCreditExpenses">Goodwill Credit Expenses</label>
                                        <select
                                            id="goodwillCreditExpenses"
                                            value={formData.Accounting?.goodwillCreditExpenses || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "goodwillCreditExpenses", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Goodwill Credit Expenses</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="chargeOffExpense">Charge-Off Expense</label>
                                        <select
                                            id="chargeOffExpense"
                                            value={formData.Accounting?.chargeOffExpense || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "chargeOffExpense", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Charge-Off Expense</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="chargeOffFraudExpense">Charge-Off Fraud Expense</label>
                                        <select
                                            id="chargeOffFraudExpense"
                                            value={formData.Accounting?.chargeOffFraudExpense || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "chargeOffFraudExpense", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Charge-Off Fraud Expense</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                <h5>Liabilities</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="overpaymentLiability">Overpayment Liability</label>
                                        <select
                                            id="overpaymentLiability"
                                            value={formData.Accounting?.overpaymentLiability || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "overpaymentLiability", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Overpayment Liability</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

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


                        {/* Accrual (periodic) */}
                        {formData.Accounting?.selectedOption === "Accrual (periodic)" && (
                            <>
                                {/* Assets / Liabilities Section */}
                                <h5>Assets / Liabilities</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="fundSource">Fund Source</label>
                                        <select
                                            id="fundSource"
                                            value={formData.Accounting?.fundSource || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "fundSource", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Fund Source</option>
                                            {formData.loanProductTemplate?.fundOptions?.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <h5>Assets</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="loanPortfolio">Loan Portfolio</label>
                                        <select
                                            id="loanPortfolio"
                                            value={formData.Accounting?.loanPortfolio || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "loanPortfolio", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Loan Portfolio</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="transferSuspense">Transfer in Suspense</label>
                                        <select
                                            id="transferSuspense"
                                            value={formData.Accounting?.transferSuspense || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "transferSuspense", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Transfer in Suspense</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="interestReceivable">Interest Receivable</label>
                                        <select
                                            id="interestReceivable"
                                            value={formData.Accounting?.interestReceivable || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "interestReceivable", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Interest Receivable</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="feesReceivable">Fees Receivable</label>
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
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="penaltiesReceivable">Penalties Receivable</label>
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
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
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
                                        <label htmlFor="incomeInterest">Income from Interest</label>
                                        <select
                                            id="incomeInterest"
                                            value={formData.Accounting?.incomeInterest || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeInterest", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Interest</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeFees">Income from Fees</label>
                                        <select
                                            id="incomeFees"
                                            value={formData.Accounting?.incomeFees || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeFees", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Fees</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomePenalties">Income from Penalties</label>
                                        <select
                                            id="incomePenalties"
                                            value={formData.Accounting?.incomePenalties || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomePenalties", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Penalties</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeRecovery">Income from Recovery Repayments</label>
                                        <select
                                            id="incomeRecovery"
                                            value={formData.Accounting?.incomeRecovery || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeRecovery", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Recovery Repayments</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeChargeOffInterest">Income from Charge-Off Interest</label>
                                        <select
                                            id="incomeChargeOffInterest"
                                            value={formData.Accounting?.incomeChargeOffInterest || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeChargeOffInterest", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Charge-Off Interest</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeChargeOffFees">Income from Charge-Off Fees</label>
                                        <select
                                            id="incomeChargeOffFees"
                                            value={formData.Accounting?.incomeChargeOffFees || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeChargeOffFees", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Charge-Off Fees</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeChargeOffPenalty">Income from Charge-Off Penalty</label>
                                        <select
                                            id="incomeChargeOffPenalty"
                                            value={formData.Accounting?.incomeChargeOffPenalty || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeChargeOffPenalty", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Charge-Off Penalty</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeGoodwillCreditInterest">
                                            Income from Goodwill Credit Interest
                                        </label>
                                        <select
                                            id="incomeGoodwillCreditInterest"
                                            value={formData.Accounting?.incomeGoodwillCreditInterest || ""}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "Accounting",
                                                    "incomeGoodwillCreditInterest",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Goodwill Credit Interest</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeGoodwillCreditFees">Income from Goodwill Credit Fees</label>
                                        <select
                                            id="incomeGoodwillCreditFees"
                                            value={formData.Accounting?.incomeGoodwillCreditFees || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeGoodwillCreditFees", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Goodwill Credit Fees</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeGoodwillCreditPenalty">
                                            Income from Goodwill Credit Penalty
                                        </label>
                                        <select
                                            id="incomeGoodwillCreditPenalty"
                                            value={formData.Accounting?.incomeGoodwillCreditPenalty || ""}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "Accounting",
                                                    "incomeGoodwillCreditPenalty",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Goodwill Credit Penalty</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Expenses Section */}
                                <h5>Expenses</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="lossesWrittenOff">Losses Written Off</label>
                                        <select
                                            id="lossesWrittenOff"
                                            value={formData.Accounting?.lossesWrittenOff || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "lossesWrittenOff", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Losses Written Off</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="goodwillCreditExpenses">Goodwill Credit Expenses</label>
                                        <select
                                            id="goodwillCreditExpenses"
                                            value={formData.Accounting?.goodwillCreditExpenses || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "goodwillCreditExpenses", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Goodwill Credit Expenses</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="chargeOffExpense">Charge-Off Expense</label>
                                        <select
                                            id="chargeOffExpense"
                                            value={formData.Accounting?.chargeOffExpense || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "chargeOffExpense", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Charge-Off Expense</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="chargeOffFraudExpense">Charge-Off Fraud Expense</label>
                                        <select
                                            id="chargeOffFraudExpense"
                                            value={formData.Accounting?.chargeOffFraudExpense || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "chargeOffFraudExpense", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Charge-Off Fraud Expense</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                <h5>Liabilities</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="overpaymentLiability">Overpayment Liability</label>
                                        <select
                                            id="overpaymentLiability"
                                            value={formData.Accounting?.overpaymentLiability || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "overpaymentLiability", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Overpayment Liability</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

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

                        {/* Accrual (upfront) */}
                        {formData.Accounting?.selectedOption === "Accrual (upfront)" && (
                            <>
                                <h4>Assets / Liabilities</h4>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="fundSource">Fund Source</label>
                                        <select
                                            id="fundSource"
                                            value={formData.Accounting?.fundSource || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "fundSource", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Fund Source</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}

                                        </select>
                                    </div>
                                </div>

                                <h4>Assets</h4>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="loanPortfolio">Loan Portfolio</label>
                                        <select
                                            id="loanPortfolio"
                                            value={formData.Accounting?.loanPortfolio || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "loanPortfolio", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Loan Portfolio</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="transferSuspense">Transfer in Suspense</label>
                                        <select
                                            id="transferSuspense"
                                            value={formData.Accounting?.transferSuspense || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "transferSuspense", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Transfer in Suspense</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="interestReceivable">Interest Receivable</label>
                                        <select
                                            id="interestReceivable"
                                            value={formData.Accounting?.interestReceivable || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "interestReceivable", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Interest Receivable</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="feesReceivable">Fees Receivable</label>
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
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="penaltiesReceivable">Penalties Receivable</label>
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
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
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
                                        <label htmlFor="incomeInterest">Income from Interest</label>
                                        <select
                                            id="incomeInterest"
                                            value={formData.Accounting?.incomeInterest || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeInterest", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Interest</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeFees">Income from Fees</label>
                                        <select
                                            id="incomeFees"
                                            value={formData.Accounting?.incomeFees || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeFees", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Fees</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomePenalties">Income from Penalties</label>
                                        <select
                                            id="incomePenalties"
                                            value={formData.Accounting?.incomePenalties || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomePenalties", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Penalties</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeRecovery">Income from Recovery Repayments</label>
                                        <select
                                            id="incomeRecovery"
                                            value={formData.Accounting?.incomeRecovery || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeRecovery", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Recovery Repayments</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeChargeOffInterest">Income from Charge-Off Interest</label>
                                        <select
                                            id="incomeChargeOffInterest"
                                            value={formData.Accounting?.incomeChargeOffInterest || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeChargeOffInterest", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Charge-Off Interest</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeChargeOffFees">Income from Charge-Off Fees</label>
                                        <select
                                            id="incomeChargeOffFees"
                                            value={formData.Accounting?.incomeChargeOffFees || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeChargeOffFees", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Charge-Off Fees</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeChargeOffPenalty">Income from Charge-Off Penalty</label>
                                        <select
                                            id="incomeChargeOffPenalty"
                                            value={formData.Accounting?.incomeChargeOffPenalty || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeChargeOffPenalty", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Charge-Off Penalty</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeGoodwillCreditInterest">
                                            Income from Goodwill Credit Interest
                                        </label>
                                        <select
                                            id="incomeGoodwillCreditInterest"
                                            value={formData.Accounting?.incomeGoodwillCreditInterest || ""}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "Accounting",
                                                    "incomeGoodwillCreditInterest",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Goodwill Credit Interest</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeGoodwillCreditFees">Income from Goodwill Credit Fees</label>
                                        <select
                                            id="incomeGoodwillCreditFees"
                                            value={formData.Accounting?.incomeGoodwillCreditFees || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "incomeGoodwillCreditFees", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Goodwill Credit Fees</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incomeGoodwillCreditPenalty">
                                            Income from Goodwill Credit Penalty
                                        </label>
                                        <select
                                            id="incomeGoodwillCreditPenalty"
                                            value={formData.Accounting?.incomeGoodwillCreditPenalty || ""}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "Accounting",
                                                    "incomeGoodwillCreditPenalty",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Income from Goodwill Credit Penalty</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Expenses Section */}
                                <h5>Expenses</h5>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="lossesWrittenOff">Losses Written Off</label>
                                        <select
                                            id="lossesWrittenOff"
                                            value={formData.Accounting?.lossesWrittenOff || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "lossesWrittenOff", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Losses Written Off</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="goodwillCreditExpenses">Goodwill Credit Expenses</label>
                                        <select
                                            id="goodwillCreditExpenses"
                                            value={formData.Accounting?.goodwillCreditExpenses || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "goodwillCreditExpenses", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Goodwill Credit Expenses</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="chargeOffExpense">Charge-Off Expense</label>
                                        <select
                                            id="chargeOffExpense"
                                            value={formData.Accounting?.chargeOffExpense || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "chargeOffExpense", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Charge-Off Expense</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="chargeOffFraudExpense">Charge-Off Fraud Expense</label>
                                        <select
                                            id="chargeOffFraudExpense"
                                            value={formData.Accounting?.chargeOffFraudExpense || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "chargeOffFraudExpense", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Charge-Off Fraud Expense</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>


                                <h4>Liabilities</h4>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="overpaymentLiability">Overpayment Liability</label>
                                        <select
                                            id="overpaymentLiability"
                                            value={formData.Accounting?.overpaymentLiability || ""}
                                            onChange={(e) =>
                                                handleFieldChange("Accounting", "overpaymentLiability", e.target.value)
                                            }
                                            required
                                            className="staged-form-select"
                                        >
                                            <option value="">Select Overpayment Liability</option>
                                            {Array.isArray(formData.loanProductTemplate?.accountingMappingOptions) &&
                                                formData.loanProductTemplate?.accountingMappingOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

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
            { title: "Settings", data: formData.Settings },
            { title: "Terms", data: formData.Terms },
            { title: "Charges", data: formData.Charges },
            { title: "Accounting", data: formData.Accounting },
        ];

        return (
            <div className="staged-form-preview-section">
                <h3>Preview</h3>
                {stageData.map(({ title, data }) => (
                    <div key={title} className="staged-form-preview-block">
                        <h4>{title}</h4>
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
                                                ? value.map((item) =>
                                                    typeof item === "object"
                                                        ? JSON.stringify(item)
                                                        : item
                                                ).join(", ")
                                                : value || "N/A"}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available for this section.</p>
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
                {currentStage > 0 && (
                    <button onClick={handlePrevious} className="staged-form-button-previous">
                        Previous
                    </button>
                )}
                {currentStage < stages.length && (
                    <button
                        onClick={handleNext}
                        className="staged-form-button-next"
                        disabled={isNextDisabled}
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
            {modalState.isOpen && (
                <div className="staged-modal-container">
                    <div className="staged-modal-content">
                        <h3 className="modal-staged-form-title">
                            {`${
                                modalState.type.charAt(0).toUpperCase() + modalState.type.slice(1)
                            } by Loan Cycle`}
                        </h3>

                        {/* Fields */}
                        <div className="staged-form-field">
                            <label htmlFor="condition">Condition <span>*</span></label>
                            <select
                                id="condition"
                                value={modalState.data?.condition || ""}
                                onChange={(e) =>
                                    setModalState((prev) => ({
                                        ...prev,
                                        data: { ...prev.data, condition: e.target.value },
                                    }))
                                }
                                required
                            >
                                <option value="">Select Condition</option>
                                {formData.loanProductTemplate?.valueConditionTypeOptions?.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="staged-form-field">
                            <label htmlFor="loanCycle">Loan Cycle <span>*</span></label>
                            <input
                                id="loanCycle"
                                type="number"
                                min={0}
                                value={modalState.data?.loanCycle || ""}
                                onChange={(e) =>
                                    setModalState((prev) => ({
                                        ...prev,
                                        data: { ...prev.data, loanCycle: e.target.value },
                                    }))
                                }
                                required
                            />
                        </div>
                        <div className="staged-form-field">
                            <label htmlFor="min">Minimum</label>
                            <input
                                id="min"
                                type="number"
                                min={0}
                                value={modalState.data?.min || ""}
                                onChange={(e) =>
                                    setModalState((prev) => ({
                                        ...prev,
                                        data: { ...prev.data, min: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div className="staged-form-field">
                            <label htmlFor="default">Default <span>*</span></label>
                            <input
                                id="default"
                                type="number"
                                min={0}
                                value={modalState.data?.default || ""}
                                onChange={(e) =>
                                    setModalState((prev) => ({
                                        ...prev,
                                        data: { ...prev.data, default: e.target.value },
                                    }))
                                }
                                required
                            />
                        </div>
                        <div className="staged-form-field">
                            <label htmlFor="max">Maximum</label>
                            <input
                                id="max"
                                type="number"
                                min={0}
                                value={modalState.data?.max || ""}
                                onChange={(e) =>
                                    setModalState((prev) => ({
                                        ...prev,
                                        data: { ...prev.data, max: e.target.value },
                                    }))
                                }
                            />
                        </div>

                        {/* Buttons */}
                        <div className="staged-form-modal-buttons">
                            <button onClick={closeModal} className="staged-form-modal-button-cancel">
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSubmitModalData(modalState.data)}
                                className="staged-form-modal-button-submit"
                                disabled={isSubmitDisabled}
                            >
                                {modalState.data?.id ? "Save Changes" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default CreateLoanProducts;
