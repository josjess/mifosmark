import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ManageDelinquency.css";
import { FaLayerGroup, FaChartBar } from "react-icons/fa";

const ManageDelinquency = () => {
    const navigate = useNavigate();

    const delinquencyOptions = [
        { name: "Manage Delinquency Ranges", icon: <FaChartBar />, color: "#3498db", text: "Define delinquency day ranges", link: "/delinquency-ranges" },
        { name: "Manage Delinquency Buckets", icon: <FaLayerGroup />, color: "#e67e22", text: "Define delinquency buckets", link: "/delinquency-buckets" },
    ];

    return (
        <div className="manage-delinquency-page">
            <h2 className="system-page-heading">
                <Link to="/products" className="breadcrumb-link">Products</Link> . Manage Delinquency
            </h2>
            <div className="options-grid">
                {delinquencyOptions.map((option, index) => (
                    <div
                        key={index}
                        className="option-card"
                        onClick={() => navigate(option.link)}
                    >
                        <div className="option-icon" style={{ color: option.color }}>
                            {option.icon}
                        </div>
                        <h4 className="option-title">{option.name}</h4>
                        <p className="option-description">{option.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageDelinquency;
