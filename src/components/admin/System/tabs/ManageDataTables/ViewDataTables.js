import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import './ViewDataTable.css';

const DataTableView = ({ newTableIdentifier }) => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [dataTables, setDataTables] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        fetchDataTables();
        if (newTableIdentifier) {
            fetchTableDetails(newTableIdentifier);
        }
    }, [newTableIdentifier]);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredData().length / pageSize));
    }, [dataTables, filter, pageSize]);

    const fetchDataTables = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/datatables`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setDataTables(response.data);
        } catch (error) {
            console.error('Error fetching data tables:', error);
        } finally {
            stopLoading();
        }
    };

    const fetchTableDetails = async (identifier) => {
        startLoading();
        try {
            const response = await axios.get(
                `${API_CONFIG.baseURL}/datatables/${encodeURIComponent(identifier)}`,
                {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        "Fineract-Platform-TenantId": "default",
                        "Content-Type": "application/json",
                    },
                }
            );
            setModalData(response.data);
        } catch (error) {
            console.error('Error fetching table details:', error);
        } finally {
            stopLoading();
        }
    };

    const closeModal = () => setModalData(null);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = () =>
        dataTables.filter(
            (table) =>
                typeof table.registeredTableName === 'string' &&
                table.registeredTableName.toLowerCase().includes(filter.toLowerCase())
        );

    const paginatedData = filteredData().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleDeleteTable = async () => {
        startLoading();
        try {
            const response = await axios.delete(
                `${API_CONFIG.baseURL}/datatables/${encodeURIComponent(modalData.registeredTableName)}`,
                {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        "Fineract-Platform-TenantId": "default",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                // console.log("Table deleted successfully!");
                closeModal();
                fetchDataTables();
            }
        } catch (error) {
            console.error("Error deleting table:", error.response?.data || error.message);
        } finally {
            stopLoading();
        }
    };

    return (
        <>
            <div className="data-table-container">
                <div className="table-controls">
                    <div className="filter-container">
                        <label htmlFor="filter">Filter by Name:</label>
                        <input
                            type="text"
                            id="filter"
                            value={filter}
                            onChange={handleFilterChange}
                            placeholder="Enter data table name..."
                        />
                    </div>
                    <div className="page-size-selector">
                        <label htmlFor="rows-per-page">Rows per page:</label>
                        <select
                            id="rows-per-page"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Registered Table Name</th>
                        <th>Application Table Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((dataTable, index) => (
                            <tr
                                key={index}
                                onClick={() => fetchTableDetails(dataTable.registeredTableName)}
                                className="clickable-row"
                            >
                                <td>{dataTable.registeredTableName || ''}</td>
                                <td>{dataTable.applicationTableName || ''}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="no-data">No data tables available</td>
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
            {modalData && (
                <div className="data-table-modal-backdrop" onClick={closeModal}>
                    <div className="data-table-modal" onClick={(e) => e.stopPropagation()}>
                        <h4>Associated with {modalData.applicationTableName}</h4>
                        <table className="data-table-modal-table">
                            <thead>
                            <tr>
                                <th>Field Name</th>
                                <th>Type</th>
                                <th>Length</th>
                                <th>Code</th>
                                <th>Mandatory</th>
                                <th>Unique</th>
                                <th>Indexed</th>
                            </tr>
                            </thead>
                            <tbody>
                            {modalData.columnHeaderData.map((col, index) => (
                                <tr key={index}>
                                    <td>{col.columnName}</td>
                                    <td>{col.columnType}</td>
                                    <td>{col.columnLength || '-'}</td>
                                    <td>{col.columnCode || '-'}</td>
                                    <td>{col.mandatory ? 'Yes' : 'No'}</td>
                                    <td>{col.unique ? 'Yes' : 'No'}</td>
                                    <td>{col.indexed ? 'Yes' : 'No'}</td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="data-table-modal-actions">
                            <button className="modal-edit-button" onClick={closeModal}>Close</button>
                            <button className="modal-delete-button" onClick={handleDeleteTable}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DataTableView;
