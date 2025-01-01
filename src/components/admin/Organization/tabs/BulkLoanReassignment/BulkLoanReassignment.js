import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import './BulkLoanReassignment.css';
import DatePicker from "react-datepicker";

const BulkLoanReassignment = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    const [offices, setOffices] = useState([]);
    const [loanOfficers, setLoanOfficers] = useState([]);
    const [fromLoanOfficer, setFromLoanOfficer] = useState('');
    const [toLoanOfficer, setToLoanOfficer] = useState('');
    const [selectedOffice, setSelectedOffice] = useState('');
    const [assignmentDate, setAssignmentDate] = useState(getDefaultDate());
    const [clientLoans, setClientLoans] = useState([]);
    const [groupLoans, setGroupLoans] = useState([]);
    const [savingsAccounts, setSavingsAccounts] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);

    const [activeTab, setActiveTab] = useState('clientLoans');
    const [clientPage, setClientPage] = useState(1);
    const [clientItemsPerPage, setClientItemsPerPage] = useState(10);
    const [groupPage, setGroupPage] = useState(1);
    const [groupItemsPerPage, setGroupItemsPerPage] = useState(10);
    const [savingsPage, setSavingsPage] = useState(1);
    const [savingsItemsPerPage, setSavingsItemsPerPage] = useState(10);

    const [selectedClientLoans, setSelectedClientLoans] = useState([]);
    const [selectedGroupLoans, setSelectedGroupLoans] = useState([]);
    const [selectedSavingsAccounts, setSelectedSavingsAccounts] = useState([]);

    const [reassignmentType, setReassignmentType] = useState('client');
    const [selectAllClients, setSelectAllClients] = useState(false);

    useEffect(() => {
        fetchOffices();
    }, []);

    useEffect(() => {
        const hasSelectedAccounts =
            (reassignmentType === 'client' && (selectedClientLoans.length > 0 || selectedSavingsAccounts.length > 0)) ||
            (reassignmentType === 'loans' && (selectedClientLoans.length > 0 || selectedGroupLoans.length > 0)) ||
            (reassignmentType === 'savings' && selectedSavingsAccounts.length > 0);

        setIsFormValid(
            selectedOffice &&
            fromLoanOfficer &&
            toLoanOfficer &&
            assignmentDate &&
            hasSelectedAccounts
        );
    }, [selectedOffice, fromLoanOfficer, toLoanOfficer, assignmentDate, reassignmentType, selectedClientLoans, selectedGroupLoans, selectedSavingsAccounts]);

    const fetchOffices = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/offices`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setOffices(response.data || []);
        } catch (error) {
            console.error('Error fetching offices:', error);
        } finally {
            stopLoading();
        }
    };

    const fetchLoanOfficers = async (officeId) => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/staff?officeId=${officeId}`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setLoanOfficers(response.data || []);
        } catch (error) {
            console.error('Error fetching loan officers:', error);
        } finally {
            stopLoading();
        }
    };

    const fetchSavingsAccounts = async (officerId) => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/savingsaccounts?loanOfficerId=${officerId}`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            const savingsAccounts = (response.data.pageItems || []).filter(
                (account) => account.fieldOfficerId === officerId
            );

            setSavingsAccounts(savingsAccounts);
        } catch (error) {
            console.error('Error fetching savings accounts:', error);
        } finally {
            stopLoading();
        }
    };

    const fetchLoans = async (officerId) => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/loans?loanOfficerId=${officerId}`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            const loans = response.data.pageItems || [];

            // Filter loans by type and ensure they belong to the selected loan officer
            const officerLoans = loans.filter((loan) => loan.loanOfficerId === officerId);

            setClientLoans(officerLoans.filter((loan) => loan.loanType?.code === 'loanType.individual'));
            setGroupLoans(officerLoans.filter((loan) => loan.loanType?.code === 'loanType.group'));
        } catch (error) {
            console.error('Error fetching loans:', error);
        } finally {
            stopLoading();
        }
    };

    const handleOfficeChange = (e) => {
        const selectedOfficeId = e.target.value;
        setSelectedOffice(selectedOfficeId);
        setLoanOfficers([]);
        setFromLoanOfficer('');
        setToLoanOfficer('');
        setClientLoans([]);
        setGroupLoans([]);
        if (selectedOfficeId) {
            fetchLoanOfficers(selectedOfficeId);
        }
    };

    const handleFromLoanOfficerChange = (e) => {
        const officerId = e.target.value;
        setFromLoanOfficer(officerId);
        setToLoanOfficer('');
        setClientLoans([]);
        setGroupLoans([]);
        if (officerId) {
            if (reassignmentType === 'client' || reassignmentType === 'loans') {
                fetchLoans(officerId);
            }
            if (reassignmentType === 'client' || reassignmentType === 'savings') {
                fetchSavingsAccounts(officerId);
            }
        }
    };

    const handleCancel = () => {
        navigate('/organization');
    };

    const handleSubmit = async () => {
        startLoading();
        try {
            const formattedAssignmentDate = new Date(assignmentDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            });

            console.log('Starting loan reassignment...');

            // Reassign loans individually
            for (const loanId of [...selectedClientLoans, ...selectedGroupLoans]) {
                const loanPayload = {
                    fromLoanOfficerId: fromLoanOfficer || null,
                    toLoanOfficerId: toLoanOfficer,
                    assignmentDate: formattedAssignmentDate,
                    locale: 'en',
                    dateFormat: 'dd MMMM yyyy',
                };

                await axios.post(
                    `${API_CONFIG.baseURL}/loans/${loanId}?command=assignLoanOfficer`,
                    loanPayload,
                    {
                        headers: {
                            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                            'Fineract-Platform-TenantId': 'default',
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            console.log('Loan reassignment successful, proceeding with savings reassignment...');

            // Reassign savings accounts individually
            for (const savingsId of selectedSavingsAccounts) {
                const savingsPayload = {
                    fromSavingsOfficerId: fromLoanOfficer || null,
                    toSavingsOfficerId: toLoanOfficer,
                    assignmentDate: formattedAssignmentDate,
                    locale: 'en',
                    dateFormat: 'dd MMMM yyyy',
                };

                await axios.post(
                    `${API_CONFIG.baseURL}/savingsaccounts/${savingsId}?command=assignSavingsOfficer`,
                    savingsPayload,
                    {
                        headers: {
                            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                            'Fineract-Platform-TenantId': 'default',
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            alert('Bulk reassignment successful!');
            navigate('/organization');
        } catch (error) {
            console.error('Error submitting reassignment:', error);
            alert('Failed to reassign accounts. Please try again.');
        } finally {
            stopLoading();
        }
    };

    const handleClientItemsPerPageChange = (e) => {
        setClientItemsPerPage(parseInt(e.target.value, 10));
        setClientPage(1);
    };

    const handleGroupItemsPerPageChange = (e) => {
        setGroupItemsPerPage(parseInt(e.target.value, 10));
        setGroupPage(1);
    };

    const getPaginatedItems = (items, page, itemsPerPage) => {
        const startIndex = (page - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    function getDefaultDate() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }

    const handleSelectAllClientLoans = (e) => {
        if (e.target.checked) {
            setSelectedClientLoans(clientLoans.map((loan) => loan.id));
        } else {
            setSelectedClientLoans([]);
        }
    };

    const handleSelectAllGroupLoans = (e) => {
        if (e.target.checked) {
            setSelectedGroupLoans(groupLoans.map((loan) => loan.id));
        } else {
            setSelectedGroupLoans([]);
        }
    };

    const handleClientLoanSelect = (loanId) => {
        setSelectedClientLoans((prev) =>
            prev.includes(loanId) ? prev.filter((id) => id !== loanId) : [...prev, loanId]
        );
    };

    const handleGroupLoanSelect = (loanId) => {
        setSelectedGroupLoans((prev) =>
            prev.includes(loanId) ? prev.filter((id) => id !== loanId) : [...prev, loanId]
        );
    };

    useEffect(() => {
        const clientSelectAllCheckbox = document.getElementById('select-all-client-loans');
        if (clientSelectAllCheckbox) {
            clientSelectAllCheckbox.indeterminate =
                selectedClientLoans.length > 0 &&
                selectedClientLoans.length < clientLoans.length;
        }
    }, [selectedClientLoans, clientLoans]);

    useEffect(() => {
        const groupSelectAllCheckbox = document.getElementById('select-all-group-loans');
        if (groupSelectAllCheckbox) {
            groupSelectAllCheckbox.indeterminate =
                selectedGroupLoans.length > 0 &&
                selectedGroupLoans.length < groupLoans.length;
        }
    }, [selectedGroupLoans, groupLoans]);

    useEffect(() => {
        if (reassignmentType === 'client') {
            setSelectAllClients(true);
            setSelectedClientLoans(clientLoans.map((loan) => loan.id));
            setSelectedSavingsAccounts(savingsAccounts.map((savings) => savings.id));
        } else if (reassignmentType === 'loans') {
            setSelectAllClients(clientLoans.length > 0 && groupLoans.length > 0);
            setSelectedClientLoans(clientLoans.map((loan) => loan.id));
            setSelectedGroupLoans(groupLoans.map((loan) => loan.id));
        } else if (reassignmentType === 'savings') {
            setSelectAllClients(savingsAccounts.length > 0);
            setSelectedSavingsAccounts(savingsAccounts.map((savings) => savings.id));
        }
    }, [reassignmentType, clientLoans, groupLoans, savingsAccounts]);

    return (
        <div className="bulk-loan-reassignment-page">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Bulk Loan Reassignment
            </h2>
            <div className="bulk-loan-reassignment-form-container">
                <div className="bulk-loan-reassignment-field">
                    <label htmlFor="officeSelect" className="bulk-loan-reassignment-label">Office</label>
                    <select
                        id="officeSelect"
                        value={selectedOffice}
                        onChange={handleOfficeChange}
                        className="bulk-loan-reassignment-select"
                    >
                        <option value="">Select Office</option>
                        {offices.map((office) => (
                            <option key={office.id} value={office.id}>
                                {office.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="staged-form-row">
                    <div className="bulk-loan-reassignment-field">
                        <label htmlFor="fromLoanOfficerSelect" className="bulk-loan-reassignment-label">From Loan
                            Officer</label>
                        <select
                            id="fromLoanOfficerSelect"
                            value={fromLoanOfficer}
                            onChange={handleFromLoanOfficerChange}
                            className="bulk-loan-reassignment-select"
                            disabled={!loanOfficers.length}
                        >
                            <option value="">Select From Loan Officer</option>
                            {loanOfficers.map((officer) => (
                                <option key={officer.id} value={officer.id}>
                                    {officer.displayName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bulk-loan-reassignment-field">
                        <label htmlFor="toLoanOfficerSelect" className="bulk-loan-reassignment-label">To Loan
                            Officer</label>
                        <select
                            id="toLoanOfficerSelect"
                            value={toLoanOfficer}
                            onChange={(e) => setToLoanOfficer(e.target.value)}
                            className="bulk-loan-reassignment-select"
                            disabled={!fromLoanOfficer}
                        >
                            <option value="">Select To Loan Officer</option>
                            {loanOfficers
                                .filter((officer) => officer.id !== parseInt(fromLoanOfficer))
                                .map((officer) => (
                                    <option key={officer.id} value={officer.id}>
                                        {officer.displayName}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <div className="bulk-loan-reassignment-field">
                    <label htmlFor="assignmentDate" className="bulk-loan-reassignment-label">Assignment Date</label>
                    <DatePicker
                        id="assignmentDate"
                        selected={assignmentDate ? new Date(assignmentDate) : new Date()}
                        onChange={(date) => setAssignmentDate(date.toISOString().split('T')[0])}
                        maxDate={new Date()}
                        dateFormat="dd MMMM yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="bulk-loan-reassignment-input"
                    />
                </div>

                {fromLoanOfficer && (
                    <div className="bulk-loan-reassignment-field">
                        <label className="bulk-loan-reassignment-label">Reassignment Type</label>
                        <div className="checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={reassignmentType === 'client'}
                                    onChange={() => setReassignmentType('client')}
                                />
                                Client Reassignment (Loans & Savings)
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={reassignmentType === 'loans'}
                                    onChange={() => setReassignmentType('loans')}
                                />
                                Loans Only (Client and Group)
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={reassignmentType === 'savings'}
                                    onChange={() => setReassignmentType('savings')}
                                />
                                Savings Only
                            </label>
                        </div>
                    </div>
                )}

                {fromLoanOfficer && reassignmentType === 'client' && (
                    <div className="bulk-loan-reassignment-field">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectAllClients}
                                onChange={(e) => {
                                    setSelectAllClients(e.target.checked);
                                    if (e.target.checked) {
                                        setSelectedClientLoans(clientLoans.map((loan) => loan.id));
                                        setSelectedSavingsAccounts(savingsAccounts.map((savings) => savings.id));
                                    } else {
                                        setSelectedClientLoans([]);
                                        setSelectedSavingsAccounts([]);
                                    }
                                }}
                            />
                            Select All Clients
                        </label>
                    </div>
                )}
                {fromLoanOfficer && reassignmentType === 'loans' && (
                    <div className="bulk-loan-reassignment-field">
                        <label>
                            <input
                                type="checkbox"
                                checked={
                                    clientLoans.length > 0 &&
                                    groupLoans.length > 0 &&
                                    selectedClientLoans.length === clientLoans.length &&
                                    selectedGroupLoans.length === groupLoans.length
                                }
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedClientLoans(clientLoans.map((loan) => loan.id));
                                        setSelectedGroupLoans(groupLoans.map((loan) => loan.id));
                                    } else {
                                        setSelectedClientLoans([]);
                                        setSelectedGroupLoans([]);
                                    }
                                }}
                            />
                            Select All Loans (Client and Group)
                        </label>
                    </div>
                )}

                {fromLoanOfficer && reassignmentType === 'savings' && (
                    <div className="bulk-loan-reassignment-field">
                        <label>
                            <input
                                type="checkbox"
                                checked={
                                    savingsAccounts.length > 0 &&
                                    selectedSavingsAccounts.length === savingsAccounts.length
                                }
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedSavingsAccounts(savingsAccounts.map((savings) => savings.id));
                                    } else {
                                        setSelectedSavingsAccounts([]);
                                    }
                                }}
                            />
                            Select All Savings Accounts
                        </label>
                    </div>
                )}

                <div className="bulk-loan-reassignment-actions">
                    <button
                        className="bulk-loan-reassignment-cancel-btn"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="bulk-loan-reassignment-submit-btn"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                    >
                        Submit
                    </button>
                </div>
            </div>
            {fromLoanOfficer && reassignmentType && (
                <div className="tabs-container" style={{ marginTop: '40px'}}>
                    {(reassignmentType === 'client' || reassignmentType === 'loans') && (
                        <button
                            className={`tab-button ${activeTab === 'clientLoans' ? 'active' : ''}`}
                            onClick={() => setActiveTab('clientLoans')}
                        >
                            Client Loans
                        </button>
                    )}
                    {reassignmentType === 'loans' && (
                        <button
                            className={`tab-button ${activeTab === 'groupLoans' ? 'active' : ''}`}
                            onClick={() => setActiveTab('groupLoans')}
                        >
                            Group Loans
                        </button>
                    )}
                    {(reassignmentType === 'client' || reassignmentType === 'savings') && (
                        <button
                            className={`tab-button ${activeTab === 'savingsAccounts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('savingsAccounts')}
                        >
                            Savings Accounts
                        </button>
                    )}
                </div>
            )}
            <div className="loan-tables-container">
                {fromLoanOfficer && activeTab === 'clientLoans' && (
                    <div className="loan-table-container">
                        <h3>Client Loans</h3>
                        <table className="loan-table">
                            <thead>
                            <tr>
                                <th>
                                    <input
                                        id="select-all-client-loans"
                                        type="checkbox"
                                        onChange={handleSelectAllClientLoans}
                                        checked={clientLoans.length > 0 && selectedClientLoans.length === clientLoans.length}
                                    />
                                </th>
                                <th>Account No</th>
                                <th>Client Name</th>
                                <th>Principal Amount</th>
                                <th>Total Expected Payment</th>
                                <th>Currency</th>
                            </tr>
                            </thead>
                            <tbody>
                            {clientLoans.length > 0 ? (
                                getPaginatedItems(clientLoans, clientPage, clientItemsPerPage).map((loan) => (
                                    <tr key={loan.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleClientLoanSelect(loan.id)}
                                                checked={selectedClientLoans.includes(loan.id)}
                                            />
                                        </td>
                                        <td>{loan.accountNo}</td>
                                        <td>{loan.clientName}</td>
                                        <td>
                                            {loan.principal !== null && loan.principal !== undefined
                                                ? loan.principal.toLocaleString()
                                                : ''}
                                        </td>
                                        <td>
                                            {loan.summary?.totalExpectedRepayment !== null && loan.summary?.totalExpectedRepayment !== undefined
                                                ? loan.summary.totalExpectedRepayment.toLocaleString()
                                                : ''}
                                        </td>
                                        <td>{loan.currency.code}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className={'no-data'} colSpan="6" style={{textAlign: 'center'}}>No data available</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                        <div className="pagination-controls">
                            <label>
                                Items per page:
                                <select
                                    value={clientItemsPerPage}
                                    onChange={handleClientItemsPerPageChange}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </label>
                            <div className="pagination-buttons">
                                <button
                                    onClick={() => setClientPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={clientPage === 1}
                                >
                                    Previous
                                </button>
                                <span>Page {clientPage} of {Math.ceil(clientLoans.length / clientItemsPerPage)}</span>
                                <button
                                    onClick={() =>
                                        setClientPage((prev) =>
                                            Math.min(prev + 1, Math.ceil(clientLoans.length / clientItemsPerPage))
                                        )
                                    }
                                    disabled={clientPage === Math.ceil(clientLoans.length / clientItemsPerPage)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {fromLoanOfficer && activeTab === 'groupLoans' && (
                    <div className="loan-table-container">
                        <h3>Group Loans</h3>
                        <table className="loan-table">
                            <thead>
                            <tr>
                                <th>
                                    <input
                                        id="select-all-group-loans"
                                        type="checkbox"
                                        onChange={handleSelectAllGroupLoans}
                                        checked={groupLoans.length > 0 && selectedGroupLoans.length === groupLoans.length}
                                    />
                                </th>
                                <th>Account No</th>
                                <th>Group Name</th>
                                <th>Principal Amount</th>
                                <th>Total Expected Payment</th>
                                <th>Currency</th>
                            </tr>
                            </thead>
                            <tbody>
                            {groupLoans.length > 0 ? (
                                getPaginatedItems(groupLoans, groupPage, groupItemsPerPage).map((loan) => (
                                    <tr key={loan.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleGroupLoanSelect(loan.id)}
                                                checked={selectedGroupLoans.includes(loan.id)}
                                            />
                                        </td>
                                        <td>{loan.accountNo}</td>
                                        <td>{loan.groupName}</td>
                                        <td>
                                            {loan.principal !== null && loan.principal !== undefined
                                                ? loan.principal.toLocaleString()
                                                : ''}
                                        </td>
                                        <td>
                                            {loan.summary?.totalExpectedRepayment !== null && loan.summary?.totalExpectedRepayment !== undefined
                                                ? loan.summary.totalExpectedRepayment.toLocaleString()
                                                : ''}
                                        </td>
                                        <td>{loan.currency.code}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className={'no-data'} colSpan="6" style={{textAlign: 'center'}}>No data available</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                        <div className="pagination-controls">
                            <label>
                                Items per page:
                                <select
                                    value={groupItemsPerPage}
                                    onChange={handleGroupItemsPerPageChange}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </label>
                            <div className="pagination-buttons">
                                <button
                                    onClick={() => setGroupPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={groupPage === 1}
                                >
                                    Previous
                                </button>
                                <span>Page {groupPage} of {Math.ceil(groupLoans.length / groupItemsPerPage)}</span>
                                <button
                                    onClick={() =>
                                        setGroupPage((prev) =>
                                            Math.min(prev + 1, Math.ceil(groupLoans.length / groupItemsPerPage))
                                        )
                                    }
                                    disabled={groupPage === Math.ceil(groupLoans.length / groupItemsPerPage)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {fromLoanOfficer && activeTab === 'savingsAccounts' && (
                    <div className="loan-table-container">
                        <h3>Savings Accounts</h3>
                        <table className="loan-table">
                            <thead>
                            <tr>
                                <th>
                                    <input
                                        id="select-all-savings-accounts"
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedSavingsAccounts(savingsAccounts.map((savings) => savings.id));
                                            } else {
                                                setSelectedSavingsAccounts([]);
                                            }
                                        }}
                                        checked={
                                            savingsAccounts.length > 0 &&
                                            selectedSavingsAccounts.length === savingsAccounts.length
                                        }
                                    />
                                </th>
                                <th>Account No</th>
                                <th>Client Name</th>
                                <th>Account Balance</th>
                                <th>Available Balance</th>
                                <th>Currency</th>
                            </tr>
                            </thead>
                            <tbody>
                            {savingsAccounts.length > 0 ? (
                                getPaginatedItems(savingsAccounts, savingsPage, savingsItemsPerPage).map((savings) => (
                                    <tr key={savings.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                onChange={() =>
                                                    setSelectedSavingsAccounts((prev) =>
                                                        prev.includes(savings.id)
                                                            ? prev.filter((id) => id !== savings.id)
                                                            : [...prev, savings.id]
                                                    )
                                                }
                                                checked={selectedSavingsAccounts.includes(savings.id)}
                                            />
                                        </td>
                                        <td>{savings.accountNo}</td>
                                        <td>{savings.clientName}</td>
                                        <td>
                                            {savings.summary?.accountBalance !== null && savings.summary?.accountBalance !== undefined
                                                ? savings.summary.accountBalance.toLocaleString()
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            {savings.summary?.availableBalance !== null && savings.summary?.availableBalance !== undefined
                                                ? savings.summary.availableBalance.toLocaleString()
                                                : 'N/A'}
                                        </td>
                                        <td>{savings.currency?.code || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className={'no-data'} colSpan="6" style={{textAlign: 'center'}}>No data available</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                        <div className="pagination-controls">
                            <label>
                                Items per page:
                                <select
                                    value={savingsItemsPerPage}
                                    onChange={(e) => setSavingsItemsPerPage(parseInt(e.target.value, 10))}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </label>
                            <div className="pagination-buttons">
                                <button onClick={() => setSavingsPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={savingsPage === 1}>
                                    Previous
                                </button>
                                <span>
                                    Page {savingsPage} of {Math.ceil(savingsAccounts.length / savingsItemsPerPage)}
                                </span>
                                <button
                                    onClick={() =>
                                        setSavingsPage((prev) =>
                                            Math.min(prev + 1, Math.ceil(savingsAccounts.length / savingsItemsPerPage))
                                        )
                                    }
                                    disabled={savingsPage === Math.ceil(savingsAccounts.length / savingsItemsPerPage)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkLoanReassignment;
