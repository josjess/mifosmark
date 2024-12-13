import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useLoading } from "../../../context/LoadingContext";
import { API_CONFIG } from "../../../config";
import {Link, useNavigate, useParams} from "react-router-dom";
import "./AllReports.css";

const ReportsPage = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const { reportType } = useParams();

    const [reports, setReports] = useState([]);
    const [nameFilter, setNameFilter] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState("");

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, [reportType]);


    useEffect(() => {
        if (reportType === "all") {
            const uniqueCategories = [
                ...new Set(
                    reports
                        .map((report) => report.reportCategory)
                        .filter(
                            (category) =>
                                category &&
                                category !== "NULL" &&
                                category !== "(NULL)"
                        )
                ),
            ];
            setCategories(uniqueCategories);
        }
    }, [reports, reportType]);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredReports().length / pageSize));
    }, [reports, nameFilter, pageSize]);

    const formattedReportType =
        reportType && reportType !== "all"
            ? reportType.toLowerCase() === "savings"
                ? "Savings"
                : reportType.charAt(0).toUpperCase() +
                (reportType.endsWith("s") ? reportType.slice(1, -1) : reportType.slice(1))
            : null;

    const fetchReports = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/reports`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    "Fineract-Platform-TenantId": "default",
                    "Content-Type": "application/json",
                },
            });
            const filteredReports = formattedReportType
                ? response.data.filter((report) => report.reportCategory === formattedReportType)
                : response.data;

            setReports(filteredReports || []);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            stopLoading();
        }
    };

    const filteredReports = () => {
        return reports.filter((report) =>
            report.reportName?.toLowerCase().includes(nameFilter.toLowerCase()) &&
            (reportType === "all" ? (categoryFilter === "" || report.reportCategory === categoryFilter) : true)
        );
    };

    const paginatedData = filteredReports().slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleRowClick = (report) => {
        if (!report || !report.id) {
            console.error("Invalid report data:", report);
            return;
        }

        console.log("Navigating to Report Form for:", report.reportName);
        navigate(`/reports/view/${report.id}`);
    };

    return (
        <div className="reports-page">
            <h2 className="page-heading">
                <Link to="/reports" className="breadcrumb-link">Reports</Link> .{" "}
                {reportType.charAt(0).toUpperCase() + reportType.slice(1).toLowerCase()}
            </h2>

            <div className="reports-content">
                <div className="table-controls">
                    <div className="filter-container">
                        <div className="filter-item">
                            <label htmlFor="nameFilter">Filter by Name:</label>
                            <input
                                type="text"
                                id="nameFilter"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                placeholder="Enter report name..."
                            />
                        </div>
                        {reportType === "all" && (
                            <div className="filter-item">
                                <label htmlFor="categoryFilter">Filter by Category:</label>
                                <select
                                    id="categoryFilter"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="page-size-selector">
                        <label>Rows per page:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
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
                        <th>Name</th>
                        <th>Type</th>
                        <th>Category</th>
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
                                <td>{report.reportName || ""}</td>
                                <td>{report.reportType || ""}</td>
                                <td>{report.reportCategory || ""}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="3" className="no-data">
                                No reports available.
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
        </div>
    );
};

export default ReportsPage;
