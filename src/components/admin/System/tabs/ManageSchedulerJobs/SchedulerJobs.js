import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../../../../../config';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import './SchedulerJobs.css';

const SchedulerJobs = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [schedulerStatus, setSchedulerStatus] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({ name: '', status: '' });
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorDetails, setErrorDetails] = useState('');

    useEffect(() => {
        fetchSchedulerStatus();
        fetchJobs();
    }, []);

    const fetchSchedulerStatus = async () => {
        startLoading();
        try {
            const token = user?.base64EncodedAuthenticationKey;
            if (!token) throw new Error('Authorization token not found');

            const response = await axios.get(`${API_CONFIG.baseURL}/scheduler`, {
                headers: {
                    Authorization: `Basic ${token}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setSchedulerStatus(response.data.active);
        } catch (error) {
            console.error('Error fetching scheduler status:', error.message);
            setSchedulerStatus(null);
        } finally {
            stopLoading();
        }
    };

    const fetchJobs = async () => {
        setIsRefreshing(true);
        startLoading();
        try {
            const token = user?.base64EncodedAuthenticationKey;
            if (!token) throw new Error('Authorization token not found');

            const response = await axios.get(`${API_CONFIG.baseURL}/jobs`, {
                headers: {
                    Authorization: `Basic ${token}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            const jobsData = response.data.map((job) => ({
                ...job,
                lastRunHistory: job.lastRunHistory || null,
            }));

            // console.log(response.data);
            setJobs(response.data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error.message);
            setJobs([]);
        } finally {
            setIsRefreshing(false);
            stopLoading();
        }
    };

    const handleStatusToggle = async () => {
        startLoading();
        try {
            const token = user?.base64EncodedAuthenticationKey;
            if (!token) throw new Error('Authorization token not found');

            const endpoint = schedulerStatus
                ? `${API_CONFIG.baseURL}/scheduler?command=stop`
                : `${API_CONFIG.baseURL}/scheduler?command=start`;

            const response = await axios.post(endpoint, null, {
                headers: {
                    Authorization: `Basic ${token}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 202) {
                setSchedulerStatus(!schedulerStatus);
            }
        } catch (error) {
            console.error('Error toggling scheduler status:', error.message);
        } finally {
            stopLoading();
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const filteredJobs = jobs.filter((job) => {
        const matchesName = !filters.name || job.displayName.toLowerCase().includes(filters.name.toLowerCase());
        const matchesStatus = !filters.status || String(job.active) === filters.status;
        return matchesName && matchesStatus;
    });

    const handleRowClick = (job) => {
        console.log('Clicked Job:', job);
    };

    const handleJobSelection = (jobId) => {
        setSelectedJobs((prev) => {
            const newSelection = prev.includes(jobId)
                ? prev.filter((id) => id !== jobId)
                : [...prev, jobId];
            setIsAllSelected(newSelection.length === jobs.filter((job) => job.active).length);
            return newSelection;
        });
    };

    const handleSelectAllToggle = () => {
        if (isAllSelected) {
            setSelectedJobs([]);
        } else {
            const activeJobIds = jobs.filter((job) => job.active).map((job) => job.jobId);
            setSelectedJobs(activeJobIds);
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleRunSelectedJobs = () => {
        console.log('Running selected jobs:', selectedJobs);
    };

    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        const newRowsPerPage = Number(e.target.value);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    const openErrorModal = (errorLog) => {
        setErrorDetails(errorLog);
        setModalVisible(true);
    };

    const closeErrorModal = () => {
        setErrorDetails('');
        setModalVisible(false);
    };

    return (
        <div className="scheduler-jobs-tab">
            <div className="scheduler-status-container">
                <span className="scheduler-status">
                    Scheduler Status:{' '}
                    <strong>{schedulerStatus === null ? 'Unknown' : schedulerStatus ? 'Active' : 'Suspended'}</strong>
                </span>
                <button
                    className={`status-toggle-button ${schedulerStatus ? 'suspend' : 'activate'}`}
                    onClick={handleStatusToggle}
                    disabled={schedulerStatus === null}
                >
                    {schedulerStatus ? 'Suspend' : 'Activate'}
                </button>
            </div>
            <div className="filters-container">
                <input
                    type="text"
                    name="name"
                    placeholder="Filter by Name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="">All Statuses</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>
            <div className="scheduler-actions-container">
                <button
                    className="scheduler-action-button"
                    disabled={selectedJobs.length === 0}
                    onClick={handleRunSelectedJobs}
                >
                    Run Selected Jobs
                </button>

                <button
                    className="scheduler-action-button"
                    disabled={selectedJobs.length === 0}
                    >
                    Add Custom Parameters
                </button>
                <button className="scheduler-action-button" onClick={fetchJobs} disabled={isRefreshing}>
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
        </div>
    <div className="rows-per-page-selector">
        <label htmlFor="rows-per-page">Rows per page:</label>
        <select
            id="rows-per-page"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <table className="jobs-table">
                <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            ref={(el) => {
                                if (el) {
                                    el.indeterminate =
                                        selectedJobs.length > 0 && selectedJobs.length < jobs.filter((job) => job.active).length;
                                }
                            }}
                            checked={isAllSelected}
                            onChange={handleSelectAllToggle}
                        />
                    </th>

                    <th>Name</th>
                    <th>Active</th>
                    <th>Previous Run</th>
                    <th>Currently Running</th>
                    <th>Next Run</th>
                    <th>Error Log</th>
                </tr>
                </thead>
                <tbody>
                {paginatedJobs.map((job) => (
                    <tr
                        key={job.jobId}
                        onClick={(e) => {
                            if (!e.target.closest('.checkbox-cell')) handleRowClick(job);
                        }}
                    >
                        <td
                            className="checkbox-cell"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleJobSelection(job.jobId);
                            }}
                        >
                            {job.active && (
                                <input
                                    type="checkbox"
                                    checked={selectedJobs.includes(job.jobId)}
                                    readOnly
                                />
                            )}
                        </td>
                        <td>{job.displayName}</td>
                        <td>
                            <div className="indicator-container">
                                <div
                                    className={`indicator ${job.active ? 'yes' : 'no'}`}
                                ></div>
                                <div className="tooltip">
                                    {job.active ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                        </td>
                        <td
                            className={`status-cell ${job.lastRunHistory?.status === 'success' ? 'success' : job.lastRunHistory?.status === 'failed' ? 'failed' : ''}`}
                        >
                            <span className="status-tooltip-wrapper">
                                {job.lastRunHistory ? (
                                    <>
                                        {new Intl.DateTimeFormat('en-US', {
                                            weekday: 'long',
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        }).format(new Date(job.lastRunHistory.jobRunEndTime))}{' '}
                                        at{' '}
                                        {new Date(job.lastRunHistory.jobRunEndTime).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        })}
                                    </>
                                ) : (
                                    '-'
                                )}
                                {job.lastRunHistory?.status && (
                                    <span className="status-tooltip">
                                        {`Status: ${job.lastRunHistory.status}`}
                                    </span>
                                )}
                            </span>
                        </td>
                        <td>
                            <div className="indicator-container">
                                <div
                                    className={`indicator ${job.running ? 'yes' : 'no'}`}
                                ></div>
                                <div className="tooltip">
                                    {job.running ? 'Currently Running' : 'Not Currently Running'}
                                </div>
                            </div>
                        </td>
                        <td>
                            {job.nextRunTime ? (
                                <>
                                    {new Intl.DateTimeFormat('en-US', {
                                        weekday: 'long',
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    }).format(new Date(job.nextRunTime))}{' '}
                                    at{' '}
                                    {new Date(job.nextRunTime).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </>
                            ) : (
                                '-'
                            )}
                        </td>
                        <td
                            className="error-log-cell"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (job.lastRunHistory?.jobRunErrorLog) {
                                    openErrorModal(job.lastRunHistory.jobRunErrorLog);
                                }
                            }}
                        >
                            {job.lastRunHistory?.jobRunErrorLog ? (
                                <button className="custom-error-log-button">View</button>
                            ) : (
                                '-'
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>
            {modalVisible && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <button
                            className="custom-modal-close-button"
                            onClick={closeErrorModal}
                        >
                        &times;
                        </button>
                        <h2 className="custom-modal-title">Error Details</h2>
                        <pre className="custom-modal-error-log">{errorDetails}</pre>
                    </div>
                </div>
            )}
            <div className="pagination-controls">
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                >
                    First
                </button>
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    Last
                </button>
            </div>
        </div>
    );
};

export default SchedulerJobs;
