import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { useLoading } from '../../../context/LoadingContext';
import { API_CONFIG } from '../../../config';
import './ViewJournalEntries.css';

const ViewJournalEntries = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [filters, setFilters] = useState({
        accountName: '',
        office: '',
        transactionDate: '',
        transactionId: '',
    });
    const [entries, setEntries] = useState([]);
    const [offices, setOffices] = useState([]);
    const [accountSuggestions, setAccountSuggestions] = useState([]);
    const [showAccountSuggestions, setShowAccountSuggestions] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchEntries();
    }, [filters, currentPage, pageSize]);

    useEffect(() => {
        fetchOffices();
    }, []);

    const fetchOffices = async () => {
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
            console.error("Error fetching offices:", error);
        }
    };

    const fetchEntries = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/journalentries`, {
                params: {
                    offset: (currentPage - 1) * pageSize,
                    limit: pageSize,
                    accountName: filters.accountName,
                    office: filters.office,
                    transactionDate: filters.transactionDate,
                    transactionId: filters.transactionId,
                },
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            const fetchedEntries = response.data.pageItems || [];
            const sortedEntries = fetchedEntries.sort((a, b) => a.id - b.id);

            setEntries(sortedEntries);
            setTotalPages(Math.ceil(response.data.totalFilteredRecords / pageSize));
        } catch (error) {
            console.error("Error fetching journal entries:", error);
        } finally {
            stopLoading();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleAccountSelect = (name) => {
        setFilters((prev) => ({ ...prev, accountName: name }));
        setShowAccountSuggestions(false);
    };

    const handleAccountNameChange = async (e) => {
        const { value } = e.target;
        setFilters((prev) => ({ ...prev, accountName: value }));
        if (value.length > 2) {
            try {
                const response = await axios.get(`${API_CONFIG.baseURL}/glAccounts`, {
                    params: { search: value },
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                    },
                });
                setAccountSuggestions(response.data || []);
                setShowAccountSuggestions(true);
            } catch (error) {
                console.error("Error fetching account suggestions:", error);
            }
        } else {
            setShowAccountSuggestions(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchEntries();
    };

    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    const formatDate = (dateArray) => {
        const [year, month, day] = dateArray;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const formatCurrency = (amount, symbol, decimalPlaces) => {
        return `${symbol}${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        }).format(amount)}`;
    };

    const handleRowClick = (entryId) => {
        console.log("Row clicked. Entry ID:", entryId);
        // Logic for handling row click (e.g., navigation)
    };

    return (
        <div className="view-journal-entries">
            <h3 className={'view-journal-entries-title'}>Search Journal Entries</h3>

            <div className="search-form">
                <div className="search-field">
                    <input
                        type="text"
                        name="accountName"
                        placeholder="Account Name"
                        value={filters.accountName}
                        onChange={handleAccountNameChange}
                        className="search-input"
                        onFocus={() => setShowAccountSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowAccountSuggestions(false), 200)}
                    />
                    {showAccountSuggestions && (
                        <ul className="suggestions-list">
                            {accountSuggestions.map((account) => (
                                <li key={account.id} onClick={() => handleAccountSelect(account.name)}>
                                    {account.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <select
                    name="office"
                    value={filters.office}
                    onChange={handleInputChange}
                    className="search-input"
                >
                    <option value="">Select Office</option>
                    {offices.map((office) => (
                        <option key={office.id} value={office.name}>{office.name}</option>
                    ))}
                </select>
                <input
                    type="date"
                    name="transactionDate"
                    value={filters.transactionDate}
                    onChange={handleInputChange}
                    className="search-input"
                />
                <input
                    type="text"
                    name="transactionId"
                    placeholder="Transaction ID"
                    value={filters.transactionId}
                    onChange={handleInputChange}
                    className="search-input"
                />
                {/*<button onClick={handleSearch} className="search-button">Search</button>*/}
            </div>

            <div className="page-size-selector">
                <label htmlFor="pageSize">Rows per page: </label>
                <select
                    id="pageSize"
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="page-size-dropdown"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            <table className="journal-entries-table">
                <thead>
                <tr>
                    <th>Entry ID</th>
                    <th>Office</th>
                    <th>Transaction Date</th>
                    <th>Transaction ID</th>
                    <th>Account Name</th>
                    <th>Debit</th>
                    <th>Credit</th>
                </tr>
                </thead>
                <tbody>
                {entries.length === 0 ? (
                    <tr>
                        <td colSpan="7">No entries found. Please apply filters and search.</td>
                    </tr>
                ) : (
                    entries.map((entry) => {
                        const isDebit = entry.entryType.value === "DEBIT";
                        const debitAmount = isDebit ? entry.amount : 0;
                        const creditAmount = isDebit ? 0 : entry.amount;

                        const currencySymbol = entry.currency?.displaySymbol || '';
                        const decimalPlaces = entry.currency?.decimalPlaces || 2;

                        return (
                            <tr key={entry.id} onClick={() => handleRowClick(entry.id)} className="clickable-row">
                                <td>{entry.id}</td>
                                <td>{entry.officeName}</td>
                                <td>{formatDate(entry.transactionDate)}</td>
                                <td>{entry.transactionId || 'N/A'}</td>
                                <td>{entry.glAccountName || 'N/A'}</td>
                                <td>{debitAmount ? formatCurrency(debitAmount, currencySymbol, decimalPlaces) : ''}</td>
                                <td>{creditAmount ? formatCurrency(creditAmount, currencySymbol, decimalPlaces) : ''}</td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-button"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                    >
                        Start
                    </button>
                    <button
                        className="pagination-button"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        className="pagination-button"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                    <button
                        className="pagination-button"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        End
                    </button>
                </div>
            )}
        </div>
    );
};

export default ViewJournalEntries;
