import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import './ViewReports.css';

const ViewReportsTable = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [reports, setReports] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({ type: '', name: '', category: '' });
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredReports().length / pageSize));
    }, [reports, filter, pageSize]);

    const fetchReports = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/reports`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            stopLoading();
        }
    };

    const filteredReports = () =>
        reports.filter((report) => {
            const matchesType = filter.type
                ? report.reportType?.toLowerCase().includes(filter.type.toLowerCase())
                : true;
            const matchesName = filter.name
                ? report.reportName?.toLowerCase().includes(filter.name.toLowerCase())
                : true;
            const matchesCategory = filter.category
                ? report.reportCategory?.toLowerCase().includes(filter.category.toLowerCase())
                : true;
            return matchesType && matchesName && matchesCategory;
        });

    const paginatedData = filteredReports().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleRowClick = (report) => {
        console.log('Row Data:', report);
    };

    return (
        <div className="reports-table-container">
            <div className="table-controls">
                <div className="filter-container">
                    <div className="filter-input">
                        <label htmlFor="typeFilter">Filter by Report Type:</label>
                        <input
                            type="text"
                            id="typeFilter"
                            value={filter.type}
                            onChange={(e) =>
                                setFilter((prev) => ({ ...prev, type: e.target.value }))
                            }
                            placeholder="Enter report type..."
                        />
                    </div>
                    <div className="filter-input">
                        <label htmlFor="nameFilter">Filter by Report Name:</label>
                        <input
                            type="text"
                            id="nameFilter"
                            value={filter.name}
                            onChange={(e) =>
                                setFilter((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="Enter report name..."
                        />
                    </div>
                    <div className="filter-input">
                        <label htmlFor="categoryFilter">Filter by Report Category:</label>
                        <input
                            type="text"
                            id="categoryFilter"
                            value={filter.category}
                            onChange={(e) =>
                                setFilter((prev) => ({ ...prev, category: e.target.value }))
                            }
                            placeholder="Enter report category..."
                        />
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
            <table className="reports-table">
                <thead>
                <tr>
                    <th>Report Name</th>
                    <th>Report Type</th>
                    <th>Report Category</th>
                    <th>Core Report</th>
                    <th>User Report</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((report) => (
                        <tr
                            key={report.id}
                            onClick={() => handleRowClick(report)}
                            className="clickable-row"
                        >
                            <td>{report.reportName || 'N/A'}</td>
                            <td>{report.reportType || 'N/A'}</td>
                            <td>{report.reportCategory || 'N/A'}</td>
                            <td>
                                <div className="indicator-container">
                                    <div
                                        className={`indicator ${
                                            report.coreReport ? 'yes' : 'no'
                                        }`}
                                    ></div>
                                    <div className="tooltip">
                                        {report.coreReport ? 'Core Report: Yes' : 'Core Report: No'}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="indicator-container">
                                    <div
                                        className={`indicator ${
                                            report.useReport ? 'yes' : 'no'
                                        }`}
                                    ></div>
                                    <div className="tooltip">
                                        {report.useReport ? 'User Report: Yes' : 'User Report: No'}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="no-data">
                            No reports available
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

export default ViewReportsTable;
