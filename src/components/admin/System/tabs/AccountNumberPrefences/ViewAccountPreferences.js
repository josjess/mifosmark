import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import './ViewAccountPreferences.css';

const ViewAccountNumberPreferencesTable = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [preferences, setPreferences] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPreferences();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredPreferences().length / pageSize));
    }, [preferences, filter, pageSize]);

    const fetchPreferences = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/accountnumberformats`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setPreferences(response.data);
        } catch (error) {
            console.error('Error fetching account number preferences:', error);
        } finally {
            stopLoading();
        }
    };

    const filteredPreferences = () =>
        preferences.filter(
            (preference) =>
                preference.accountType?.value?.toLowerCase().includes(filter.toLowerCase())
        );

    const paginatedData = filteredPreferences().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="preferences-table-container">
            <div className="table-controls">
                <div className="filter-container">
                    <label htmlFor="filter">Filter by Preferences:</label>
                    <input
                        type="text"
                        id="filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Enter preference..."
                    />
                </div>
                <div className="page-size-selector">
                    <label>Rows per page: </label>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
            <table className="preferences-table">
                <thead>
                <tr>
                    <th>Account Number Preferences</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((preference) => (
                        <tr key={preference.id}>
                            <td>{preference.accountType?.value || 'N/A'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="1" className="no-data">No preferences available</td>
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

export default ViewAccountNumberPreferencesTable;
