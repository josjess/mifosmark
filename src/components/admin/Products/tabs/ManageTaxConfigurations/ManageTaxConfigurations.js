import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ManageTaxConfigurations.css";
import { FaTags, FaLayerGroup } from "react-icons/fa";

const ManageTaxConfigurations = () => {
    const navigate = useNavigate();

    const taxOptions = [
        { name: "Manage Tax Components", icon: <FaTags />, color: "#1abc9c", text: "Define Tax Components", link: "/tax-components" },
        { name: "Manage Tax Groups", icon: <FaLayerGroup />, color: "#9b59b6", text: "Define Tax Groups", link: "/tax-groups" },
    ];

    return (
        <div className="manage-tax-page">
            <h2 className="system-page-heading">
                <Link to="/products" className="breadcrumb-link">Products</Link> . Manage Tax Configurations
            </h2>
            <div className="options-grid">
                {taxOptions.map((option, index) => (
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

export default ManageTaxConfigurations;
