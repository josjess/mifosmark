import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { API_CONFIG } from "../../config";
import "./ViewReports.css";

const ReportFormPage = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const { reportId } = useParams();

    const [reportDetails, setReportDetails] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [options, setOptions] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        if (reportId) fetchReportDetails();
    }, [reportId]);

    const fetchReportDetails = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/reports/${reportId}`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    "Fineract-Platform-TenantId": "default",
                    "Content-Type": "application/json",
                },
            });
            const { reportParameters = [] } = response.data;

            if (reportParameters.length === 0) {
                setError("This report does not have configurable parameters.");
            } else {
                const initialValues = reportParameters.reduce((acc, param) => {
                    acc[param.parameterName] = "";
                    return acc;
                }, {});

                setFormValues(initialValues);
                setError("");

                await Promise.all(
                    reportParameters
                        .filter((param) => param.parameterName.endsWith("SelectOne") || param.parameterName.endsWith("SelectAll"))
                        .map((param) => fetchOptionsForField(param.parameterName))
                );
            }

            setReportDetails(response.data);
        } catch (err) {
            console.error("Error fetching report details:", err);
            setError("Failed to load report details. Please try again.");
        } finally {
            stopLoading();
        }
    };

    const fetchOptionsForField = async (parameterName) => {
        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            "Fineract-Platform-TenantId": "default",
            "Content-Type": "application/json",
        };

        try {
            const endpoint = `/runreports/${parameterName}?parameterType=true`;

            const response = await axios.get(`${API_CONFIG.baseURL}${endpoint}`, { headers });
            const { data, columnHeaders } = response.data;

            const idIndex = columnHeaders.findIndex((header) => header.columnName === "id");
            const nameIndex = columnHeaders.findIndex((header) => header.columnName === "name" || header.columnName === "displayName");

            if (idIndex !== -1 && nameIndex !== -1) {
                const parsedOptions = data.map((row) => ({
                    id: row.row[idIndex],
                    name: row.row[nameIndex],
                }));
                setOptions((prev) => ({
                    ...prev,
                    [parameterName]: parsedOptions,
                }));

                if (parsedOptions.length > 0 && !formValues[parameterName]) {
                    setFormValues((prev) => ({
                        ...prev,
                        [parameterName]: parsedOptions[0].id,
                    }));
                }
            } else {
                console.warn(`Unexpected data structure for ${parameterName}`);
            }
        } catch (err) {
            console.error(`Error fetching options for ${parameterName}:`, err);
        }
    };

    const handleInputChange = (parameterName, value) => {
        setFormValues((prev) => ({
            ...prev,
            [parameterName]: value,
        }));
    };
    const renderLabel = (parameterName) => {
        const firstWord = parameterName.split(/(?=[A-Z])/)[0];
        return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
    };

    const renderField = (param) => {
        const { parameterName } = param;

        if (parameterName === "startDateSelect" || parameterName === "endDateSelect") {
            return (
                <input
                    type="date"
                    value={formValues[parameterName]}
                    onChange={(e) => handleInputChange(parameterName, e.target.value)}
                    className="custom-date-input"
                />
            );
        }

        if (parameterName.endsWith("SelectOne") || parameterName.endsWith("SelectAll")) {
            return (
                <select
                    value={formValues[parameterName]}
                    onChange={(e) => handleInputChange(parameterName, e.target.value)}
                    onFocus={() => fetchOptionsForField(parameterName)}
                    className="custom-select"
                >
                    <option value="">Select an option</option>
                    {options[parameterName]?.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type="text"
                value={formValues[parameterName]}
                onChange={(e) => handleInputChange(parameterName, e.target.value)}
                className="custom-text-input"
            />
        );
    };

    const handleRunReport = async () => {
        try {
            startLoading();

            const queryParams = new URLSearchParams();

            Object.entries(formValues).forEach(([key, value]) => {
                if (value !== undefined && value !== "") {
                    queryParams.append(key, value);
                }
            });

            if (!queryParams.has("decimalChoice")) {
                queryParams.append("decimalChoice", 1);
            }
            if (!queryParams.has("exportS3")) {
                queryParams.append("exportS3", false);
            }

            const url = `${API_CONFIG.baseURL}/runreports/${encodeURIComponent(
                reportDetails?.reportName
            )}?${queryParams.toString()}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    "Fineract-Platform-TenantId": "default",
                    "Content-Type": "application/json",
                },
            });

            console.log("Report run successfully:", response.data);
        } catch (err) {
            console.error("Error running report:", err);
        } finally {
            stopLoading();
        }
    };

    const handleRunAndDownloadReport = async () => {
        try {
            startLoading();

            const queryParams = new URLSearchParams();

            Object.entries(formValues).forEach(([key, value]) => {
                if (value !== undefined && value !== "") {
                    queryParams.append(key, value);
                }
            });

            if (!queryParams.has("decimalChoice")) {
                queryParams.append("decimalChoice", 1);
            }
            if (!queryParams.has("exportS3")) {
                queryParams.append("exportS3", false);
            }

            const url = `${API_CONFIG.baseURL}/runreports/${encodeURIComponent(
                reportDetails?.reportName
            )}?${queryParams.toString()}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    "Fineract-Platform-TenantId": "default",
                    "Content-Type": "application/json",
                },
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `${reportDetails?.reportName || "report"}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error("Error running and downloading report:", err);
        } finally {
            stopLoading();
        }
    };


    return (
        <div className="custom-page-container">
            <h2 className="page-heading">
                <Link to="/reports/all" className={"breadcrumb-link"}>Reports</Link> . {" "}
                {reportDetails?.reportName || "Report Form"}
            </h2>
            <div className="custom-content">
                <h2>{reportDetails?.reportName || "Report Form"}</h2>

                {error && <p className="error-message">{error}</p>}

                {!error && (
                    <form className="custom-report-form">
                        {reportDetails?.reportParameters.map((param) => (
                            <div key={param.id} className="custom-form-group">
                                <label>{renderLabel(param.parameterName)}</label>
                                {renderField(param)}
                            </div>
                        ))}
                        <div className="collateral-form-row">
                            <div className="custom-form-group">
                                <label>Decimal Places</label>
                                <select
                                    value={formValues.decimalChoice || "1"}
                                    onChange={(e) => handleInputChange("decimalChoice", e.target.value)}
                                    className="custom-select"
                                >
                                    {[0, 1, 2, 3, 4].map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="custom-form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={!!formValues.exportS3}
                                        onChange={(e) => handleInputChange("exportS3", e.target.checked)}
                                        className="custom-checkbox"
                                    />
                                    Export output data to S3 repository
                                </label>
                            </div>
                        </div>

                            <div className="custom-form-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.history.back();
                                    }}
                                    className="custom-cancel-button"
                                >
                                    Cancel
                                </button>
                                <button type="button" onClick={handleRunReport}>
                                    Run Report
                                </button>
                                <button type="button" onClick={handleRunAndDownloadReport}>
                                    Run and Download Report
                                </button>
                            </div>
                    </form>
                    )}
            </div>
        </div>
    );
};

export default ReportFormPage;
