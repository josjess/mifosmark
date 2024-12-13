import React, { useState, useEffect, useContext } from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../../context/AuthContext";
import { useLoading } from "../../../../../context/LoadingContext";
import { API_CONFIG } from "../../../../../config";
import "./ViewHoliday.css";

const ViewHoliday = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    const [holidayDetails, setHolidayDetails] = useState(null);

    useEffect(() => {
        fetchHolidayDetails();
    }, []);

    const fetchHolidayDetails = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/holidays/${id}`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    "Fineract-Platform-TenantId": "default",
                },
            });
            setHolidayDetails(response.data);
        } catch (error) {
            console.error("Error fetching holiday details:", error);
        } finally {
            stopLoading();
        }
    };

    const handleAction = (action) => {
        if (action === "activate") {
            // alert("Activate functionality is not yet implemented.");
        } else if (action === "edit") {
            // navigate(`/holidays/edit/${id}`);
        } else if (action === "delete") {
            // alert("Delete functionality is not yet implemented.");
        }
    };

    const formatDate = (dateArray) => {
        if (!dateArray || dateArray.length !== 3) return "";
        const [year, month, day] = dateArray;
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (!holidayDetails) {
        return <div className="view-holiday-loading">Ops! Couldn't fetch data!</div>;
    }

    return (
        <div className="view-holiday-container">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">
                    Organization
                </Link>
                <Link to="/manage-holidays" className="breadcrumb-link">
                   . Manage Holidays
                </Link>  {" "}
                . View Holiday
            </h2>

            <table className="view-holiday-table">
                <tbody>
                <tr>
                    <td className="view-holiday-label">Name</td>
                    <td>{holidayDetails.name}</td>
                </tr>
                <tr>
                    <td className="view-holiday-label">Description</td>
                    <td>{holidayDetails.description || ""}</td>
                </tr>
                <tr>
                    <td className="view-holiday-label">From Date</td>
                    <td>{formatDate(holidayDetails.fromDate)}</td>
                </tr>
                <tr>
                    <td className="view-holiday-label">To Date</td>
                    <td>{formatDate(holidayDetails.toDate)}</td>
                </tr>
                <tr>
                    <td className="view-holiday-label">Repayment Scheduled To</td>
                    <td>
                        {holidayDetails.repaymentsRescheduledTo
                            ? formatDate(holidayDetails.repaymentsRescheduledTo)
                            : ""}
                    </td>
                </tr>
                <tr>
                    <td className="view-holiday-label">Status</td>
                    <td>{holidayDetails.status.value}</td>
                </tr>
                </tbody>
            </table>
            <div className="view-holiday-actions">
                <button onClick={() => handleAction("activate")} className="view-holiday-action">
                    Activate
                </button>
                <button onClick={() => handleAction("edit")} className="view-holiday-action">
                    Edit
                </button>
                <button onClick={() => handleAction("delete")} className="view-holiday-action">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ViewHoliday;
