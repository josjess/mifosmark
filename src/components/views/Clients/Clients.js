import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import '../styling.css';
import { AuthContext } from '../../../context/AuthContext';
import { useLoading } from '../../../context/LoadingContext';
import { API_CONFIG } from '../../../config';

const Clients = ({ onRowClick }) => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ searchQuery: '' });
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();

    const fetchClients = async () => {
        try {
            startLoading();
            const response = await axios.get(`${API_CONFIG.baseURL}/clients`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setClients(response.data.pageItems || []);
            setFilteredClients(response.data.pageItems || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        const filtered = clients.filter((client) =>
            client.displayName.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );

        setFilteredClients(filtered);
        setTotalPages(Math.ceil(filtered.length / pageSize));
        setCurrentPage(1);
    }, [clients, filters, pageSize]);

    const currentPageData = filteredClients.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const handlePageSizeChange = (e) => setPageSize(Number(e.target.value));

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'status-active';
            case 'inactive':
                return 'status-inactive';
            default:
                return 'status-default';
        }
    };

    return (
        <div className="view-layout navbar-spacing">
            <div className="table-controls">
                <div className="filters-container">
                    <div className="filter-group">
                        <label htmlFor="searchQuery" className="filter-label">
                            Search by Client Name:
                        </label>
                        <input
                            type="text"
                            id="searchQuery"
                            name="searchQuery"
                            placeholder="Enter client name"
                            className="filter-input"
                            value={filters.searchQuery}
                            onChange={handleFilterChange}
                        />
                    </div>

                </div>
                <div className="filter-group">
                    <label htmlFor="pageSize" className="filter-label">
                        Rows per page:
                    </label>
                    <select
                        id="pageSize"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="filter-dropdown"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className="client-table">
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Client Number</th>
                        <th>External ID</th>
                        <th>Status</th>
                        <th>Office</th>
                        <th>Staff</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentPageData && currentPageData.length > 0 ? (
                        currentPageData.map((client) => (
                            <tr key={client.id} onClick={() => onRowClick(client)}>
                                <td>{client.displayName}</td>
                                <td>{client.accountNo}</td>
                                <td>{client.externalId}</td>
                                <td>
                                    <span className={`status-badge ${getStatusClass(client.status.value)}`}>
                                        {client.status.value}
                                    </span>
                                </td>
                                <td>{client.officeName}</td>
                                <td>{client.staffName}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No clients found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

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

export default Clients;
