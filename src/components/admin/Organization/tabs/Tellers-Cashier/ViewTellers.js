import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import './ViewTellers.css';

const ViewTellers = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [tellers, setTellers] = useState([]);
    const [branchFilter, setBranchFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTellers();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredTellers().length / pageSize));
    }, [tellers, branchFilter, nameFilter, pageSize]);

    const fetchTellers = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/tellers`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setTellers(response.data || []);
        } catch (error) {
            console.error('Error fetching tellers:', error);
        } finally {
            stopLoading();
        }
    };

    const filteredTellers = () =>
        tellers.filter((teller) => {
            const matchesBranch = teller.branch.toLowerCase().includes(branchFilter.toLowerCase());
            const matchesName = teller.name.toLowerCase().includes(nameFilter.toLowerCase());
            return matchesBranch && matchesName;
        });

    const paginatedData = filteredTellers().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleRowClick = (teller) => {
        console.log('Selected Teller:', teller);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="view-tellers">
            <div className="table-controls">
                <div className="filter-container">
                    <div className="filter-item">
                        <label htmlFor="branchFilter" className="branch-filter-label">Filter by Branch:</label>
                        <input
                            type="text"
                            id="branchFilter"
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                            placeholder="Enter branch name..."
                            className="branch-filter-input"
                        />
                    </div>
                    <div className="filter-item">
                        <label htmlFor="nameFilter" className="name-filter-label">Filter by Teller Name:</label>
                        <input
                            type="text"
                            id="nameFilter"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            placeholder="Enter teller name..."
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
            <table className="tellers-table">
                <thead>
                <tr>
                    <th>Branch</th>
                    <th>Teller Name</th>
                    <th>Status</th>
                    <th>Started On</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((teller) => (
                        <tr
                            key={teller.id}
                            className="clickable-row"
                            onClick={() => handleRowClick(teller)}
                        >
                            <td>{teller.branch || '-'}</td>
                            <td>{teller.name || '-'}</td>
                            <td>{teller.status || '-'}</td>
                            <td>{formatDate(teller.startedOn)}</td>
                            <td>
                                <button className="action-button">Edit</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="no-data">No tellers available.</td>
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

export default ViewTellers;
