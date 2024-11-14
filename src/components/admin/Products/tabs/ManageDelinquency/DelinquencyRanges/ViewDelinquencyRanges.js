import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../../context/AuthContext';
import { useLoading } from '../../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../../config';
import './ViewDelinquencyRanges.css';

const ViewDelinquencyRanges = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [ranges, setRanges] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [classificationFilter, setClassificationFilter] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchDelinquencyRanges();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredRanges().length / pageSize));
    }, [ranges, classificationFilter, pageSize]);

    const fetchDelinquencyRanges = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/delinquency/ranges`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setRanges(response.data || []);
        } catch (error) {
            console.error('Error fetching delinquency ranges:', error);
        } finally {
            stopLoading();
        }
    };

    const filteredRanges = () =>
        ranges.filter((range) =>
            range.classification?.toLowerCase().includes(classificationFilter.toLowerCase())
        );

    const paginatedData = filteredRanges().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleRowClick = (range) => {
        console.log('Selected Delinquency Range:', {
            id: range.id,
            classification: range.classification,
            daysFrom: range.minimumAgeDays,
            daysTill: range.maximumAgeDays,
        });
    };

    return (
        <div className="view-delinquency-ranges">
            <div className="table-controls">
                <div className="filter-container">
                    <div className="filter-item">
                        <label htmlFor="classificationFilter">Filter by Classification:</label>
                        <input
                            type="text"
                            id="classificationFilter"
                            value={classificationFilter}
                            onChange={(e) => setClassificationFilter(e.target.value)}
                            placeholder="Search by classification..."
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
            <table className="delinquency-ranges-table">
                <thead>
                <tr>
                    <th>Classification</th>
                    <th>Days From</th>
                    <th>Days Till</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((range) => (
                        <tr
                            key={range.id}
                            onClick={() => handleRowClick(range)}
                            className="clickable-row"
                        >
                            <td>{range.classification}</td>
                            <td>{range.minimumAgeDays}</td>
                            <td>{range.maximumAgeDays}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="no-data">No delinquency ranges available.</td>
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

export default ViewDelinquencyRanges;
