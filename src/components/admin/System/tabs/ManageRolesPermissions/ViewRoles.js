import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import './ViewRoles.css';
import {FiEdit} from "react-icons/fi";

const ViewRolesTable = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [roles, setRoles] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({ name: '', status: '' });
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredRoles().length / pageSize));
    }, [roles, filter, pageSize]);

    const fetchRoles = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/roles`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            stopLoading();
        }
    };

    const filteredRoles = () =>
        roles.filter((role) => {
            const matchesName = role.name
                .toLowerCase()
                .includes(filter.name.toLowerCase());
            const matchesStatus =
                filter.status === '' ||
                (filter.status === 'enabled' && !role.disabled) ||
                (filter.status === 'disabled' && role.disabled);
            return matchesName && matchesStatus;
        });

    const paginatedData = filteredRoles().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleRowClick = (role) => {
        console.log('Row Data:', role);
    };

    const handleEditRole = (role) => {
        console.log('Editing role:', role.name);

    };


    return (
        <div className="roles-table-container">
            <div className="table-controls">
                <div className="filter-container">
                    <div className="filter-input">
                        <label htmlFor="nameFilter">Filter by Name:</label>
                        <input
                            type="text"
                            id="nameFilter"
                            value={filter.name}
                            onChange={(e) =>
                                setFilter((prev) => ({...prev, name: e.target.value}))
                            }
                            placeholder="Enter role name..."
                        />
                    </div>
                    <div className="filter-input">
                        <label htmlFor="statusFilter">Filter by Status:</label>
                        <select
                            id="statusFilter"
                            value={filter.status}
                            onChange={(e) =>
                                setFilter((prev) => ({...prev, status: e.target.value}))
                            }
                        >
                            <option value="">All</option>
                            <option value="enabled">Enabled</option>
                            <option value="disabled">Disabled</option>
                        </select>
                    </div>
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
            <table className="roles-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((role) => (
                        <tr
                            key={role.id}
                            onClick={() => handleRowClick(role)}
                            className="clickable-row"
                        >
                            <td>{role.name}</td>
                            <td>{role.description || 'N/A'}</td>
                            <td>
                                <div className="indicator-container">
                                    <div
                                        className={`indicator ${!role.disabled ? 'yes' : 'no'}`}
                                    ></div>
                                    <div className="tooltip">
                                        {!role.disabled ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>
                            </td>
                            <td>
                                {role.id !== 1 && (
                                    <button
                                        className="edit-icon-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditRole(role);
                                        }}
                                    >
                                        <FiEdit className="edit-icon"/>
                                    </button>

                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="no-data">No roles available</td>
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

export default ViewRolesTable;
