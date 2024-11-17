import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './ViewPaymentTypes.css';

const ViewPaymentTypes = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [codeFilter, setCodeFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPaymentTypes();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredPaymentTypes().length / pageSize));
    }, [paymentTypes, nameFilter, codeFilter, pageSize]);

    const fetchPaymentTypes = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/paymenttypes`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setPaymentTypes(response.data || []);
        } catch (error) {
            console.error('Error fetching payment types:', error);
        } finally {
            stopLoading();
        }
    };

    const filteredPaymentTypes = () =>
        paymentTypes.filter((paymentType) => {
            const matchesName = paymentType.name.toLowerCase().includes(nameFilter.toLowerCase());
            const matchesCode = paymentType.description.toLowerCase().includes(codeFilter.toLowerCase());
            return matchesName && matchesCode;
        });

    const paginatedData = filteredPaymentTypes().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleEdit = (paymentType) => {
        console.log('Edit:', paymentType);
    };

    const handleDelete = (paymentType) => {
        console.log('Delete:', paymentType);
    };

    return (
        <div className="view-payment-types">
            <div className="table-controls">
                <div className="filter-container">
                    <div className="filter-item">
                        <label htmlFor="nameFilter" className="name-filter-label">Filter by Name:</label>
                        <input
                            type="text"
                            id="nameFilter"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            placeholder="Enter name..."
                            className="name-filter-input"
                        />
                    </div>
                    <div className="filter-item">
                        <label htmlFor="codeFilter" className="code-filter-label">Filter by Code:</label>
                        <input
                            type="text"
                            id="codeFilter"
                            value={codeFilter}
                            onChange={(e) => setCodeFilter(e.target.value)}
                            placeholder="Enter code..."
                            className="code-filter-input"
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
            <table className="payment-types-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Code</th>
                    <th>System Defined</th>
                    <th>Cash Payment</th>
                    <th>Position</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((paymentType) => (
                        <tr key={paymentType.id} className="clickable-row">
                            <td>{paymentType.name || ''}</td>
                            <td>{paymentType.description || ''}</td>
                            <td>{paymentType.codeName || ''}</td>
                            <td>{paymentType.isSystemDefined ? 'Yes' : 'No'}</td>
                            <td>{paymentType.isCashPayment ? 'Yes' : 'No'}</td>
                            <td>{paymentType.position || ''}</td>
                            <td>
                                <FaEdit
                                    className="action-icon edit-icon"
                                    onClick={() => handleEdit(paymentType)}
                                />
                                <FaTrash
                                    className="action-icon delete-icon"
                                    onClick={() => handleDelete(paymentType)}
                                />
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="no-data">No payment types available.</td>
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

export default ViewPaymentTypes;
