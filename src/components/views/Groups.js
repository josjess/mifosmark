import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './styling.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import { API_CONFIG } from '../../config';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();

    const fetchGroups = async (page, searchQuery = '') => {
        try {
            startLoading();
            const response = await axios.get(`${API_CONFIG.baseURL}/groups`, {
                params: { offset: (page - 1) * 10, limit: 10, search: searchQuery },
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setGroups(response.data);
            setTotalPages(Math.ceil(response.data / 10));
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        fetchGroups(currentPage).then();
        // eslint-disable-next-line
    }, [currentPage]);

    const handleAddGroupClick = () => {
        navigate('/addgroup');
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchGroups(1, searchQuery).then();
    };

    const handleRowClick = (groupId) => {
        console.log(`Row clicked, Group ID: ${groupId}`);
    };

    return (
        <div className="view-layout navbar-spacing">
            <div className="view-header">
                <h2 className={'view-title'}>Groups</h2>
                <div className="action-buttons">
                    <button className="add-button" onClick={handleAddGroupClick}>
                        Add Group
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
                    {groups && groups.length > 0 ? (
                        groups.map((group) => (
                            <tr key={group.id} onClick={() => handleRowClick(group.id)}>
                                <td>{group.name}</td>
                                <td>{group.accountNo}</td>
                                <td>{group.externalId}</td>
                                <td>{group.status.value}</td>
                                <td>{group.officeName}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No groups found</td>
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

export default Groups;
