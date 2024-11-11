import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import { API_CONFIG } from '../../config';
import './ViewAccountingRules.css';

const AccountingRulesTable = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [allAccountingRules, setAllAccountingRules] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchAccountingRules();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(allAccountingRules.length / pageSize));
    }, [allAccountingRules, pageSize]);

    const fetchAccountingRules = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/accountingrules`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            setAllAccountingRules(response.data);
        } catch (error) {
            console.error('Error fetching accounting rules:', error);
        } finally {
            stopLoading();
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleRowClick = (rule) => {
        console.log("Row Data:", rule);
    };

    const paginatedData = allAccountingRules.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="accounting-rules-table-container">
            <div className="page-size-selector">
                <label>Rows per page: </label>
                <select value={pageSize} onChange={handlePageSizeChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <table className="accounting-rules-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Office</th>
                    <th>Debit Tags</th>
                    <th>Debit Account</th>
                    <th>Credit Tags</th>
                    <th>Credit Account</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((rule) => (
                        <tr
                            key={rule.id}
                            onClick={() => handleRowClick(rule)}
                            className="clickable-row"
                        >
                            <td>{rule.name}</td>
                            <td>{rule.officeName || 'N/A'}</td>
                            <td>
                                {Array.isArray(rule.debitAccounts) && rule.debitAccounts.length > 0
                                    ? rule.debitAccounts.map(account => account.name).join(', ')
                                    : 'N/A'}
                            </td>
                            <td>
                                {Array.isArray(rule.creditAccounts) && rule.creditAccounts.length > 0
                                    ? rule.creditAccounts.map(account => account.name).join(', ')
                                    : 'N/A'}
                            </td>
                            <td>
                                {Array.isArray(rule.debitTags) && rule.debitTags.length > 0
                                    ? rule.debitTags.map(tag => `${tag.tag.name} (${tag.transactionType.value})`).join(', ')
                                    : 'N/A'}
                            </td>
                            <td>
                                {Array.isArray(rule.creditTags) && rule.creditTags.length > 0
                                    ? rule.creditTags.map(tag => `${tag.tag.name} (${tag.transactionType.value})`).join(', ')
                                    : 'N/A'}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="no-data">No accounting rules available</td>
                    </tr>
                )}
                </tbody>
            </table>
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>Start</button>
                    <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}>Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}>Next
                    </button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>End
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccountingRulesTable;
