import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { useLoading } from '../../../context/LoadingContext';
import { API_CONFIG } from '../../../config';
import './ViewChartOfAccounts.css';

const ChartOfAccountsTable = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [allAccounts, setAllAccounts] = useState([]);
    const [displayedAccounts, setDisplayedAccounts] = useState([]);
    const [filters, setFilters] = useState({ account: '', glCode: '', accountType: '' });
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchAccounts();
    }, [filters]);

    useEffect(() => {
        paginateData();
    }, [allAccounts, currentPage, pageSize]);

    const fetchAccounts = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/glaccounts`, {
                params: filters,
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            const accountsData = response.data;
            setAllAccounts(accountsData);
            setTotalPages(Math.ceil(accountsData.length / pageSize));
            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching chart of accounts:', error);
        } finally {
            stopLoading();
        }
    };

    const paginateData = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setDisplayedAccounts(allAccounts.slice(startIndex, endIndex));
    };

    const handleInputChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setCurrentPage(1);
    };

    const handlePageSizeChange = (e) => {
        const newPageSize = Number(e.target.value);
        setPageSize(newPageSize);
        setTotalPages(Math.ceil(allAccounts.length / newPageSize));
        setCurrentPage(1);
    };

    const handleRowClick = (id) => {
        console.log("Row ID:", id);
    };

    return (
        <div className="view-chart-accounts-container">
            <div className="controls-row">
                <div className="page-size-selector">
                    <label>Rows per page: </label>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <button className="tree-view-toggle">Tree View</button>
            </div>
            <div className="filter-row">
                <input
                    type="text"
                    name="account"
                    placeholder="Filter by Account"
                    onChange={handleInputChange}
                    className="filter-input"
                />
                <input
                    type="text"
                    name="glCode"
                    placeholder="Filter by GL Code"
                    onChange={handleInputChange}
                    className="filter-input"
                />
                <select name="accountType" onChange={handleInputChange} className="filter-select">
                    <option value="">Filter by Account Type</option>
                    <option value="ASSET">Assets</option>
                    <option value="LIABILITY">Liabilities</option>
                    <option value="EQUITY">Equity</option>
                    <option value="EXPENSE">Expenses</option>
                    <option value="INCOME">Income</option>
                </select>
            </div>
            <table className="chart-accounts-table">
                <thead>
                <tr>
                    <th>Account</th>
                    <th>GL Code</th>
                    <th>Account Type</th>
                    <th>Disabled?</th>
                    <th>Are Manual Entries Allowed?</th>
                    <th>Used As</th>
                </tr>
                </thead>
                <tbody>
                {displayedAccounts.length > 0 ? (
                    displayedAccounts.map((account) => (
                        <tr key={account.id} onClick={() => handleRowClick(account.id)} className="clickable-row">
                            <td>{account.name}</td>
                            <td>{account.glCode}</td>
                            <td>{account.type?.value || 'N/A'}</td>
                            <td>{account.disabled ? 'Yes' : 'No'}</td>
                            <td>{account.manualEntriesAllowed ? 'Yes' : 'No'}</td>
                            <td>{account.usage?.value || 'N/A'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="no-data">No accounts available</td>
                    </tr>
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
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        className="pagination-button"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

export default ChartOfAccountsTable;
