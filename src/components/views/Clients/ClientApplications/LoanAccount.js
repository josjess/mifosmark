import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../../context/AuthContext';
import { useLoading } from '../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../config';
import DatePicker from "react-datepicker";

const LoanAccount = () => {
    const { clientId } = useParams();
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();

    const [currentStage, setCurrentStage] = useState('Details');
    const [clientData, setClientData] = useState(null);
    const [loanTemplate, setLoanTemplate] = useState(null);
    const [datatableInfo, setDatatableInfo] = useState(null);
    const [clientAccounts, setClientAccounts] = useState(null);
    const [collateralTemplate, setCollateralTemplate] = useState(null);
    const [collaterals, setCollaterals] = useState([]);
    const [isCollateralModalOpen, setIsCollateralModalOpen] = useState(false);
    const [selectedCollateral, setSelectedCollateral] = useState('');
    const [quantity, setQuantity] = useState('');
    const [loanPurpose, setLoanPurpose] = useState('');
    const [loanOfficer, setLoanOfficer] = useState('');
    const [frequency, setFrequency] = useState('');
    const [selectedCharge, setSelectedCharge] = useState('');
    const [chargeOptions, setChargeOptions] = useState([]);
    const [overdueCharges, setCharges] = useState([]);

    const [submittedOn, setSubmittedOn] = useState('');
    const [disbursementOn, setDisbursementOn] = useState('');

    const stages = ['Details', 'Terms', 'Charges'];

    const fetchData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            const [clientResponse, loanTemplateResponse, datatableResponse, clientAccountsResponse, collateralsResponse, chargesResponse] = await Promise.all([
                axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers }),
                axios.get(`${API_CONFIG.baseURL}/loans/template?activeOnly=true&staffInSelectedOfficeOnly=true&clientId=${clientId}&templateType=individual`, { headers }),
                axios.get(`${API_CONFIG.baseURL}/datatables?apptable=m_client`, { headers }),
                axios.get(`${API_CONFIG.baseURL}/clients/${clientId}/accounts`, { headers }),
                axios.get(`${API_CONFIG.baseURL}/clients/${clientId}/collaterals/template`, { headers }),
                axios.get(`${API_CONFIG.baseURL}/clients/${clientId}/charges?pendingPayment=true`, { headers }),
            ]);

            setClientData(clientResponse.data);
            setLoanTemplate(loanTemplateResponse.data);
            setDatatableInfo(datatableResponse.data);
            setClientAccounts(clientAccountsResponse.data);
            setCollateralTemplate(collateralsResponse.data);
            setCharges(chargesResponse.data.pageItems);
        } catch (error) {
            console.error("Error fetching loan account data:", error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchLoanProductDetails = async (productId) => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };
            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/template?activeOnly=true&staffInSelectedOfficeOnly=true&productId=${productId}&clientId=${clientId}&templateType=individual`,
                { headers }
            );
            setLoanTemplate(response.data);
        } catch (error) {
            console.error("Error fetching loan product details:", error);
        } finally {
            stopLoading();
        }
    };

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

    const handleAddCharge = async () => {
        if (!selectedCharge) {
            alert('Please select a charge to add.');
            return;
        }
        // Add the charge logic here
        console.log(`Adding charge with ID: ${selectedCharge}`);
    };

    const handleAddCollateral = () => {
        if (!selectedCollateral || !quantity) {
            alert('Please select a collateral and enter quantity.');
            return;
        }

        const collateralData = collateralTemplate.find((item) => item.id === selectedCollateral);

        setCollaterals((prev) => [
            ...prev,
            {
                name: collateralData.name,
                quantity: parseFloat(quantity),
                totalValue: parseFloat(quantity) * parseFloat(collateralData.value),
                totalCollateralValue: parseFloat(quantity) * parseFloat(collateralData.value),
            },
        ]);

        setSelectedCollateral('');
        setQuantity('');
        setIsCollateralModalOpen(false);
    };

    const handleRemoveCollateral = (index) => {
        setCollaterals((prev) => prev.filter((_, i) => i !== index));
    };

    const calculateTotalValue = () => {
        if (!selectedCollateral || !quantity) {
            return '';
        }
        const collateralData = collateralTemplate.find((item) => item.id === selectedCollateral);
        if (collateralData) {
            return parseFloat(quantity) * parseFloat(collateralData.value || 0);
        }
        return '';
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
                                    value={loanTemplate?.product?.id || ''}
                                    onChange={(e) => fetchLoanProductDetails(e.target.value)}
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">-- Select Loan Product --</option>
                                    {loanTemplate?.productOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dynamic Fields after Product Selection */}
                        {loanTemplate?.loanProductName && (
                            <>
                                <div className="staged-form-row">
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
                                    <div className="staged-form-field">
                                        <label htmlFor="loanOfficer">Loan Officer</label>
                                        <select
                                            id="loanOfficer"
                                            className="staged-form-select"
                                        >
                                            <option value="">-- Select Loan Officer --</option>
                                            {loanTemplate?.loanOfficerOptions?.map((officer) => (
                                                <option key={officer.id} value={officer.id}>
                                                    {officer.displayName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="loanPurpose">Loan Purpose</label>
                                        <select id="loanPurpose" className="staged-form-select">
                                            <option value="">-- Select Purpose --</option>
                                            {loanTemplate?.loanPurposeOptions?.map((purpose) => (
                                                <option key={purpose.id} value={purpose.id}>
                                                    {purpose.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="fund">Fund</label>
                                        <select id="fund" className="staged-form-select">
                                            <option value="">-- Select Fund --</option>
                                            {loanTemplate?.fundOptions?.map((fund) => (
                                                <option key={fund.id} value={fund.id}>
                                                    {fund.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="staged-form-row">
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
                                    <div className="staged-form-field">
                                        <label htmlFor="disbursementOn">Disbursement On</label>
                                        <DatePicker
                                            id="disbursementOn"
                                            selected={disbursementOn ? new Date(disbursementOn) : null}
                                            onChange={(date) => setDisbursementOn(date.toISOString().split('T')[0])}
                                            className="staged-form-input"
                                            placeholderText="Select Disbursement Date"
                                            dateFormat="MMMM d, yyyy"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            showPopperArrow={false}
                                        />
                                    </div>
                                </div>

                                <h4>Savings Linkage</h4>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="linkSavings">Link Savings</label>
                                        <select id="linkSavings" className="staged-form-select">
                                            <option value="">-- Select Savings --</option>
                                            {clientAccounts?.savingsAccounts?.map((account) => (
                                                <option key={account.id} value={account.id}>
                                                    {account.productName} - {account.accountNo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                    <label htmlFor="createStandingInstructions">
                                            <input
                                                type="checkbox"
                                                id="createStandingInstructions"
                                            />{' '}
                                            Create Standing Instructions at Disbursement
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            case 'Terms':
                return (
                    <div className="stage-terms">
                        {/* Principal */}
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="principal">Principal *</label>
                                <input
                                    type="number"
                                    id="principal"
                                    value={loanTemplate?.principal || ''}
                                    onChange={(e) => setLoanTemplate((prev) => ({
                                        ...prev,
                                        principal: e.target.value,
                                    }))}
                                    required
                                    className="staged-form-input"
                                />
                            </div>
                        </div>

                        {/* Term Options */}
                        <h4>Term Options</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="loanTerm">Loan Term</label>
                                <input
                                    type="text"
                                    id="loanTerm"
                                    value={loanTemplate?.termFrequency || ''}
                                    disabled
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="frequency">Frequency *</label>
                                <select
                                    id="frequency"
                                    value={loanTemplate?.termFrequencyType?.id || ''}
                                    onChange={(e) => setLoanTemplate((prev) => ({
                                        ...prev,
                                        termFrequencyType: e.target.value,
                                    }))}
                                    required
                                    className="staged-form-select"
                                >
                                    {loanTemplate?.termFrequencyTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Repayments */}
                        <h4>Repayments</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="numberOfRepayments">Number of Repayments *</label>
                                <input
                                    type="number"
                                    id="numberOfRepayments"
                                    value={loanTemplate?.numberOfRepayments || ''}
                                    onChange={(e) => setLoanTemplate((prev) => ({
                                        ...prev,
                                        numberOfRepayments: e.target.value,
                                    }))}
                                    required
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="firstRepayment">First Repayment On</label>
                                <input
                                    type="date"
                                    id="firstRepayment"
                                    value={loanTemplate?.firstRepaymentDate || ''}
                                    onChange={(e) => setLoanTemplate((prev) => ({
                                        ...prev,
                                        firstRepaymentDate: e.target.value,
                                    }))}
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="interestChargedFrom">Interest Charged From</label>
                                <input
                                    type="date"
                                    id="interestChargedFrom"
                                    value={loanTemplate?.interestChargedFrom || ''}
                                    onChange={(e) => setLoanTemplate((prev) => ({
                                        ...prev,
                                        interestChargedFrom: e.target.value,
                                    }))}
                                    className="staged-form-input"
                                />
                            </div>
                        </div>

                        {/* Repaid Every */}
                        <h4>Repaid Every</h4>
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="repaidEvery">Repaid Every</label>
                                <input
                                    type="text"
                                    id="repaidEvery"
                                    value={loanTemplate?.repaymentEvery || ''}
                                    disabled
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="frequencyRepaidEvery">Frequency</label>
                                <input
                                    type="text"
                                    id="frequencyRepaidEvery"
                                    value={loanTemplate?.repaymentFrequencyType?.value || ''}
                                    disabled
                                    className="staged-form-input"
                                />
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="selectOn">Select On</label>
                                <select
                                    id="selectOn"
                                    value={loanTemplate?.repaymentFrequencyNthDayType || ''}
                                    onChange={(e) => setLoanTemplate((prev) => ({
                                        ...prev,
                                        repaymentFrequencyNthDayType: e.target.value,
                                    }))}
                                    className="staged-form-select"
                                >
                                    {loanTemplate?.repaymentFrequencyNthDayTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="selectDay">Select Day</label>
                                <select
                                    id="selectDay"
                                    value={loanTemplate?.repaymentFrequencyDaysOfWeekType || ''}
                                    onChange={(e) => setLoanTemplate((prev) => ({
                                        ...prev,
                                        repaymentFrequencyDaysOfWeekType: e.target.value,
                                    }))}
                                    className="staged-form-select"
                                >
                                    {loanTemplate?.repaymentFrequencyDaysOfWeekTypeOptions?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Collateral Section */}
                        <h4>Collateral</h4>
                        <div className="staged-form-row">
                            <h4 className="staged-form-field">Collateral Data</h4>
                            <button
                                className="create-provisioning-criteria-confirm"
                                onClick={() => setIsCollateralModalOpen(true)}
                            >
                                Add
                            </button>
                        </div>
                        <table className="staged-form-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Total Value</th>
                                <th>Total Collateral Value</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {collaterals.map((collateral, index) => (
                                <tr key={index}>
                                    <td>{collateral.name}</td>
                                    <td>{collateral.quantity}</td>
                                    <td>{collateral.totalValue}</td>
                                    <td>{collateral.totalCollateralValue}</td>
                                    <td>
                                        <button
                                            className="staged-form-button-delete"
                                            onClick={() => handleRemoveCollateral(index)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {/* Collateral Modal */}
                        {isCollateralModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4>Add Collateral</h4>
                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="collateral">Collateral *</label>
                                        <select
                                            id="collateral"
                                            value={selectedCollateral}
                                            onChange={(e) => setSelectedCollateral(e.target.value)}
                                            className="staged-form-select"
                                        >
                                            {collateralTemplate?.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.name}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="quantity">Quantity *</label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            required
                                            className="staged-form-input"
                                        />
                                        <label htmlFor="totalValue">Total Value</label>
                                        <input
                                            type="text"
                                            id="totalValue"
                                            value={calculateTotalValue()}
                                            disabled
                                            className="staged-form-input"
                                        />
                                    </div>
                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            onClick={() => setIsCollateralModalOpen(false)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddCollateral}
                                            className="create-provisioning-criteria-confirm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'Charges':
                return (
                    <div className="stage-charges">
                        {/* Field to select a charge */}
                        <div className="form-group">
                            <label htmlFor="chargeSelect">Charge</label>
                            <select
                                id="chargeSelect"
                                value={selectedCharge}
                                onChange={(e) => setSelectedCharge(e.target.value)}
                                className="form-control"
                            >
                                <option value="">-- Select a Charge --</option>
                                {chargeOptions?.map((charge) => (
                                    <option key={charge.id} value={charge.id}>
                                        {charge.name} - {charge.amount}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddCharge}
                                className="add-charge-button"
                            >
                                Add
                            </button>
                        </div>

                        {/* Table for overdue charges */}
                        <div className="overdue-charges-section">
                            <h4>Overdue Charges</h4>
                            {overdueCharges?.length > 0 ? (
                                <table className="charges-table">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Collected On</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {overdueCharges.map((charge, index) => (
                                        <tr key={index}>
                                            <td>{charge.name}</td>
                                            <td>{charge.type}</td>
                                            <td>{charge.amount}</td>
                                            <td>{charge.collectedOn}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No overdue charges available.</p>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!clientData || !loanTemplate) {
        return <div>Loading...</div>;
    }

    return (
        <div className="staged-form-add-client">
            {renderStageTracker()}
            <div className="staged-form-stage-content">
                {renderStageContent()}

                <div className="staged-form-stage-buttons">
                    <button
                        onClick={handlePrevious}
                        className="staged-form-button-previous"
                        disabled={currentStage === 'Details'}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="staged-form-button-next"
                        disabled={currentStage === 'Charges'}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoanAccount;
