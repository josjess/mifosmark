import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../../context/AuthContext';
import { useLoading } from '../../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../../config';
import './ViewTaxComponents.css';

const ViewTaxComponents = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [taxComponents, setTaxComponents] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [nameFilter, setNameFilter] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTaxComponents();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredComponents().length / pageSize));
    }, [taxComponents, nameFilter, pageSize]);

    const fetchTaxComponents = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/taxes/component`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setTaxComponents(response.data || []);
        } catch (error) {
            console.error('Error fetching tax components:', error);
        } finally {
            stopLoading();
        }
    };

    const filteredComponents = () =>
        taxComponents.filter((component) =>
            component.name?.toLowerCase().includes(nameFilter.toLowerCase())
        );

    const paginatedData = filteredComponents().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleRowClick = (component) => {
        console.log('Selected Tax Component:', component);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };


    return (
        <div className="view-tax-components">
            <div className="table-controls">
                <div className="filter-container">
                    <div className="filter-item">
                        <label htmlFor="nameFilter">Filter by Name:</label>
                        <input
                            type="text"
                            id="nameFilter"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            placeholder="Search by name..."
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
            <table className="tax-components-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Percentage %</th>
                    <th>Start Date</th>
                    <th>Account</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((component) => (
                        <tr
                            key={component.id}
                            onClick={() => handleRowClick(component)}
                            className="clickable-row"
                        >
                            <td>{component.name}</td>
                            <td>{component.percentage || '0'}%</td>
                            <td>{formatDate(component.startDate)}</td>
                            <td>{component.account?.name || ''}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="no-data">
                            No tax components available.
                        </td>
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

export default ViewTaxComponents;
