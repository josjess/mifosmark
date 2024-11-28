import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './styling.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import { API_CONFIG } from '../../config';

const Centers = () => {
    const [centers, setCenters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();

    const fetchCenters = async (page, searchQuery = '') => {
        try {
            startLoading();
            const response = await axios.get(`${API_CONFIG.baseURL}/centers`, {
                params: { offset: (page - 1) * 10, limit: 10, search: searchQuery },
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setCenters(response.data);
            setTotalPages(Math.ceil(response.data.totalFilteredRecords / 10));
        } catch (error) {
            console.error('Error fetching centers:', error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        fetchCenters(currentPage);
        // eslint-disable-next-line
    }, [currentPage]);

    const handleAddCenterClick = () => {
        navigate('/addcenter');
    };

    const handleImportCentersClick = () => {
        navigate('/bulk-imports/centers');
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCenters(1, searchQuery);
    };

    const handleRowClick = (centerId) => {
        console.log(`Row clicked, Center ID: ${centerId}`);
    };

    return (
        <div className="view-layout navbar-spacing">
            <div className="view-header">
                <h2 className={'view-title'}>Centers</h2>
                <div className="action-buttons">
                    <button className="import-button" onClick={handleImportCentersClick}>Import Centers</button>
                    <button className="add-button" onClick={handleAddCenterClick}>
                        Add Center
                    </button>
                </div>
            </div>

            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by Name or External ID"
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
                        <th>Account Number</th>
                        <th>External ID</th>
                        <th>Status</th>
                        <th>Office</th>
                    </tr>
                    </thead>
                    <tbody>
                    {centers && centers.length > 0 ? (
                        centers.map((center) => (
                            <tr key={center.id} onClick={() => handleRowClick(center.id)}>
                                <td>{center.name}</td>
                                <td>{center.accountNo}</td>
                                <td>{center.externalId}</td>
                                <td>{center.status.value}</td>
                                <td>{center.officeName}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No centers found</td>
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

export default Centers;
