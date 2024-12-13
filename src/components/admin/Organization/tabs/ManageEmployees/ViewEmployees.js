import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import './ViewEmployees.css';

const ViewEmployees = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [employees, setEmployees] = useState([]);
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOffices();
        fetchEmployees();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredEmployees().length / pageSize));
    }, [employees, nameFilter, selectedOffice, pageSize]);

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

    const fetchEmployees = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/staff?status=all`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setEmployees(response.data || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            stopLoading();
        }
    };

    const handleOfficeChange = (e) => {
        setSelectedOffice(e.target.value);
    };

    const filteredEmployees = () => {
        return employees.filter((employee) => {
            const matchesName = employee.displayName.toLowerCase().includes(nameFilter.toLowerCase());
            const matchesOffice = selectedOffice
                ? employee.officeId === Number(selectedOffice)
                : true;
            return matchesName && matchesOffice;
        });
    };

    const paginatedData = filteredEmployees().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleRowClick = (employee) => {
        console.log('Selected Employee:', employee);
    };

    return (
        <div className="view-employees">
            <div className="table-controls">
                <div className="filter-container">
                    <div className="filter-item">
                        <label htmlFor="officeFilter" className="office-filter-label">Filter by Office:</label>
                        <select
                            id="officeFilter"
                            value={selectedOffice}
                            onChange={handleOfficeChange}
                            className="office-filter-select"
                        >
                            <option value="">All Offices</option>
                            {offices.map((office) => (
                                <option key={office.id} value={office.id}>
                                    {office.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-item">
                        <label htmlFor="nameFilter" className="name-filter-label">Filter by Name:</label>
                        <input
                            type="text"
                            id="nameFilter"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            placeholder="Enter employee name..."
                            className="name-filter-input"
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
            <table className="employees-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Loan Officer</th>
                    <th>Office</th>
                    <th>Status</th>
                    <th>Member Since</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((employee) => (
                        <tr
                            key={employee.id}
                            onClick={() => handleRowClick(employee)}
                            className="clickable-row"
                        >
                            <td>{employee.displayName || ' '}</td>
                            <td>{employee.isLoanOfficer ? 'Yes' : 'No'}</td>
                            <td>{offices.find((office) => office.id === employee.officeId)?.name || ' '}</td>
                            <td>{employee.isActive ? 'Active' : 'Inactive'}</td>
                            <td>
                                {employee.joiningDate && employee.joiningDate.length === 3
                                    ? new Date(employee.joiningDate[0], employee.joiningDate[1] - 1, employee.joiningDate[2]).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : 'N/A'}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="no-data">No employees available.</td>
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

export default ViewEmployees;
