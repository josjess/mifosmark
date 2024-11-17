import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import './ViewFunds.css';

const ViewFunds = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [funds, setFunds] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchFunds();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredFunds().length / pageSize));
    }, [funds, nameFilter, pageSize]);

    const fetchFunds = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/funds`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setFunds(response.data || []);
        } catch (error) {
            console.error('Error fetching funds:', error);
        } finally {
            stopLoading();
        }
    };

    const filteredFunds = () =>
        funds.filter((fund) =>
            fund.name.toLowerCase().includes(nameFilter.toLowerCase())
        );

    const paginatedData = filteredFunds().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleRowClick = (fund) => {
        console.log('Selected Fund:', fund);
    };

    return (
        <div className="view-funds">
            <div className="table-controls">
                <div className="filter-container">
                    <div className="filter-item">
                        <label htmlFor="nameFilter" className="name-filter-label">Filter by Name:</label>
                        <input
                            type="text"
                            id="nameFilter"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            placeholder="Enter fund name..."
                            className="name-filter-input"
                        />
                    </div>
                </div>
                <div className="page-size-selector">
                    <label>Rows per page:</label>
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
            <table className="funds-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>External ID</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((fund) => (
                        <tr
                            key={fund.id}
                            className="clickable-row"
                            onClick={() => handleRowClick(fund)}
                        >
                            <td>{fund.name || '-'}</td>
                            <td>{fund.externalId || '-'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="2" className="no-data">No funds available.</td>
                    </tr>
                )}
                </tbody>
            </table>
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                        Start
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                    <button
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

export default ViewFunds;
