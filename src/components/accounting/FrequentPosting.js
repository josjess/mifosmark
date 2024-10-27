import React, { useState } from 'react';
import './FrequentPosting.css';

const FrequentPostingForm = () => {
    const [step, setStep] = useState(1);
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);

    // Form states
    const [office, setOffice] = useState('');
    const [accountingRule, setAccountingRule] = useState('');
    const [currency, setCurrency] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [chequeNumber, setChequeNumber] = useState('');
    const [routingCode, setRoutingCode] = useState('');
    const [receiptNumber, setReceiptNumber] = useState('');
    const [bankNumber, setBankNumber] = useState('');
    const [comments, setComments] = useState('');

    // Step completion checks
    const isStep1Complete = office && accountingRule && currency && transactionDate;
    const isStep2Complete = showPaymentDetails ? paymentType : true;

    // Navigation functions
    const goNext = () => {
        if ((step === 1 && isStep1Complete) || (step === 2 && isStep2Complete)) {
            setStep(step + 1);
        }
    };
    const goBack = () => setStep(step - 1);

    const handleSubmit = () => {
        console.log("Form submitted with data:", {
            office, accountingRule, currency, referenceNumber, transactionDate,
            paymentType, accountNumber, chequeNumber, routingCode, receiptNumber,
            bankNumber, comments,
        });
    };

    return (
        <div className="form-container-client">
            <h2>Accounting / Frequent Posting</h2>

            <div className="with-indicator">
                <div className="stage-indicator">
                    <div className={`stage ${step === 1 ? 'current' : step > 1 ? 'completed' : ''}`} onClick={() => setStep(1)}>
                        <div className="circle"></div>
                        <span>Basic Information</span>
                    </div>
                    <div className={`stage ${step === 2 ? 'current' : step > 2 ? 'completed' : ''}`} onClick={() => setStep(2)}>
                        <div className="circle"></div>
                        <span>Payment Details</span>
                    </div>
                    <div className={`stage ${step === 3 ? 'current' : ''}`} onClick={() => setStep(3)}>
                        <div className="circle"></div>
                        <span>Review & Submit</span>
                    </div>
                </div>

                <form className="client-form">
                    {step === 1 && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Office <span>*</span></label>
                                    <select value={office} onChange={(e) => setOffice(e.target.value)} required>
                                        <option value="">Select Office</option>
                                        {/* Populate options here */}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Accounting Rules <span>*</span></label>
                                    <select value={accountingRule} onChange={(e) => setAccountingRule(e.target.value)} required>
                                        <option value="">Select Rule</option>
                                        {/* Populate options here */}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Currency <span>*</span></label>
                                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} required>
                                        <option value="">Select Currency</option>
                                        {/* Populate options here */}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Reference Number</label>
                                    <input type="text" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Transaction Date <span>*</span></label>
                                <input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} required />
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <button type="button" onClick={() => setShowPaymentDetails(!showPaymentDetails)} className="toggle-button">
                                {showPaymentDetails ? 'Hide' : 'Show'} Payment Details
                            </button>

                            {showPaymentDetails && (
                                <>
                                    <div className="form-group">
                                        <label>Payment Type</label>
                                        <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                                            <option value="">Select Payment Type</option>
                                            <option value="money-transfer">Money Transfer</option>
                                            <option value="account-to-account">Account to Account</option>
                                            <option value="funds-transfer">Funds Transfer</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Account Number</label>
                                        <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Cheque Number</label>
                                        <input type="text" value={chequeNumber} onChange={(e) => setChequeNumber(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Routing Code</label>
                                        <input type="text" value={routingCode} onChange={(e) => setRoutingCode(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Receipt Number</label>
                                        <input type="text" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Bank Number</label>
                                        <input type="text" value={bankNumber} onChange={(e) => setBankNumber(e.target.value)} />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label>Comments</label>
                                <textarea rows="3" value={comments} onChange={(e) => setComments(e.target.value)} />
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <div className="review-section">
                            <h3>Review & Submit</h3>
                            <p><strong>Office:</strong> {office}</p>
                            <p><strong>Accounting Rule:</strong> {accountingRule}</p>
                            <p><strong>Currency:</strong> {currency}</p>
                            <p><strong>Reference Number:</strong> {referenceNumber}</p>
                            <p><strong>Transaction Date:</strong> {transactionDate}</p>
                            {showPaymentDetails && (
                                <>
                                    <p><strong>Payment Type:</strong> {paymentType}</p>
                                    <p><strong>Account Number:</strong> {accountNumber}</p>
                                    <p><strong>Cheque Number:</strong> {chequeNumber}</p>
                                    <p><strong>Routing Code:</strong> {routingCode}</p>
                                    <p><strong>Receipt Number:</strong> {receiptNumber}</p>
                                    <p><strong>Bank Number:</strong> {bankNumber}</p>
                                </>
                            )}
                            <p><strong>Comments:</strong> {comments}</p>
                            <button type="button" onClick={handleSubmit} className="submit-button">Submit</button>
                        </div>
                    )}

                    <div className="navigation-buttons">
                        {step > 1 && <button onClick={goBack} className="back-button">Back</button>}
                        {step < 3 && <button onClick={goNext} className="next-button">Next</button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FrequentPostingForm;
