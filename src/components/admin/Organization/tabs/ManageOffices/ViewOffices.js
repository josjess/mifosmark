import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import './ViewOffices.css'

const ViewOffices = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [offices, setOffices] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [nameFilter, setNameFilter] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOffices();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredOffices().length / pageSize));
    }, [offices, nameFilter, pageSize]);

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

    const filteredOffices = () =>
        offices.filter((office) =>
            office.name.toLowerCase().includes(nameFilter.toLowerCase())
        );

    const paginatedData = filteredOffices().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleRowClick = (office) => {
        console.log('Selected Office:', office);
    };

    const formatDate = (dateArray) => {
        if (!dateArray || dateArray.length !== 3) return ' ';
        const [year, month, day] = dateArray;

        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="view-offices">
            <div className="table-controls">
                <div className="filter-container">
                    <label htmlFor="nameFilter">Filter by Name:</label>
                    <input
                        type="text"
                        id="nameFilter"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        placeholder="Enter office name..."
                    />
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
            <table className="offices-table">
                <thead>
                <tr>
                    <th>Office Name</th>
                    <th>External ID</th>
                    <th>Parent Office</th>
                    <th>Opened On</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((office) => (
                        <tr
                            key={office.id}
                            onClick={() => handleRowClick(office)}
                            className="clickable-row"
                        >
                            <td>{office.name || ''}</td>
                            <td>{office.externalId || ''}</td>
                            <td>{office.parentName || ''}</td>
                            <td>{formatDate(office.openingDate)}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="no-data">No offices available.</td>
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

export default ViewOffices;
