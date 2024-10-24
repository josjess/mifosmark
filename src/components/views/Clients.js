import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './styling.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import { API_CONFIG } from '../../config';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();

    const fetchClients = async (page, searchQuery = '') => {
        try {
            startLoading();
            const response = await axios.get(`${API_CONFIG.baseURL}/clients`, {
                params: { offset: (page - 1) * 10, limit: 10, search: searchQuery },
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setClients(response.data.pageItems);
            setTotalPages(Math.ceil(response.data.totalFilteredRecords / 10));
            // console.log(`${response.data.pageItems}`);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        fetchClients(currentPage);
        // eslint-disable-next-line
    }, [currentPage]);

    const handleAddClientClick = () => {
        navigate('/addclient');
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchClients(1, searchQuery);
    };

    const handleRowClick = (clientId) => {
        console.log(`Row clicked, Client ID: ${clientId}`);
    };

    return (
        <div className="view-layout navbar-spacing">
            <div className="view-header">
                <h2 className={'view-title'}>Clients</h2>
                <div className="action-buttons">
                    <button className="import-button">Import Clients</button>
                    <button className="add-button" onClick={handleAddClientClick}>
                        Add New Client
                    </button>
                </div>
            </div>

            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by Client Number or Name"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

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
                    {clients && clients.length > 0 ? (
                        clients.map((client) => (
                            <tr key={client.id} onClick={() => handleRowClick(client.id)}>
                                <td>{client.displayName}</td>
                                <td>{client.accountNo}</td>
                                <td>{client.externalId}</td>
                                <td>{client.status.value}</td>
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
