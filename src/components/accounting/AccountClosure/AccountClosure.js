import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { useLoading } from '../../../context/LoadingContext';
import { API_CONFIG } from '../../../config';
import './AccountClosure.css';

const AccountClosure = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [office, setOffice] = useState('');
    const [closures, setClosures] = useState([]);
    const [offices, setOffices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchClosures();
        fetchOffices();
    }, [currentPage, pageSize]);

    const fetchClosures = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/glclosures`, {
                params: {
                    offset: (currentPage - 1) * pageSize,
                    limit: pageSize,
                },
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            const closuresData = response.data.pageItems || response.data;
            setClosures(closuresData);
            setTotalPages(Math.ceil(response.data.totalFilteredRecords / pageSize));
        } catch (error) {
            console.error('Error fetching closures:', error);
        } finally {
            stopLoading();
        }
    };

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

    const handleOfficeFilterChange = (e) => {
        setOffice(e.target.value);
    };

    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="account-closure-container">
            <h3 className="account-closure-title">Account Closures</h3>

            <div className="account-closure-controls">
                <div className="account-closure-filter">
                    <label className="filter-label">Filter by Office</label>
                    <select
                        value={office}
                        onChange={handleOfficeFilterChange}
                        className="filter-select"
                    >
                        <option value="">All Offices</option>
                        {offices.map((office) => (
                            <option key={office.id} value={office.name}>
                                {office.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="page-size-selector">
                    <label>Rows per page: </label>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <table className="account-closure-table">
                <thead>
                <tr>
                    <th>Office</th>
                    <th>Account Closure Date</th>
                    <th>Comments</th>
                    <th>Close Account Created By</th>
                </tr>
                </thead>
                <tbody>
                {closures.length > 0 ? (
                    closures
                        .filter((closure) => !office || closure.office === office)
                        .map((closure, index) => (
                            <tr key={index}>
                                <td>{closure.office}</td>
                                <td>{closure.closureDate}</td>
                                <td>{closure.comments}</td>
                                <td>{closure.createdBy}</td>
                            </tr>
                        ))
                ) : (
                    <tr>
                        <td colSpan="4" className="no-data">
                            No data available
                        </td>
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

export default AccountClosure;
