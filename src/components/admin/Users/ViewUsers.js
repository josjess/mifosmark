import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { useLoading } from '../../../context/LoadingContext';
import { API_CONFIG } from '../../../config';
import './ViewUsers.css';

const ViewUsers = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [filters, setFilters] = useState({ firstName: '', email: '' });
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/users`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            setAllUsers(response.data || []);
            setTotalPages(Math.ceil(response.data.length / pageSize));
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        setTotalPages(Math.ceil(allUsers.length / pageSize));
        setCurrentPage(1);
    }, [allUsers, pageSize]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setUsers(allUsers.slice(startIndex, endIndex));
    }, [allUsers, currentPage, pageSize]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchUsers();
    };

    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="view-users">
            <h3 className="view-users-title">Search Users</h3>

            <div className="search-form">
                <input
                    type="text"
                    name="firstName"
                    placeholder="Search by First Name"
                    value={filters.firstName}
                    onChange={handleInputChange}
                    className="search-input"
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Search by Email"
                    value={filters.email}
                    onChange={handleInputChange}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Search</button>
            </div>

            <div className="page-size-selector">
                <label htmlFor="pageSize">Rows per page: </label>
                <select
                    id="pageSize"
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="page-size-dropdown"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>

            <table className="users-table">
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Office</th>
                </tr>
                </thead>
                <tbody>
                {users.length === 0 ? (
                    <tr>
                        <td colSpan="4">No users found. Please apply filters and search.</td>
                    </tr>
                ) : (
                    users.map((user) => (
                        <tr key={user.id} className="clickable-row" onClick={() => console.log("User ID:", user.id)}>
                            <td>{user.firstname || 'N/A'}</td>
                            <td>{user.lastname || 'N/A'}</td>
                            <td>{user.email || 'N/A'}</td>
                            <td>{user.officeName || 'N/A'}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="pagination">
                    <button className="pagination-button" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                        Start
                    </button>
                    <button className="pagination-button" onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button className="pagination-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                    <button className="pagination-button" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                        End
                    </button>
                </div>
            )}
        </div>
    );
};

export default ViewUsers;
