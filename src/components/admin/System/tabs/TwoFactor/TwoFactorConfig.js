import React from "react";
import { Link } from "react-router-dom";
import "./TwoFactorConfig.css";
import { FaShieldAlt } from "react-icons/fa";

const TwoFactorAuthentication = () => {
    return (
        <div className="two-factor-page neighbor-element">
            <nav className="page-title">
                <Link to="/system" className="breadcrumb-link">System</Link>
                <span className="breadcrumb-separator">.</span>
                <span className="breadcrumb-current">Two-Factor Authentication</span>
            </nav>
            <div className="two-factor-content">
                <div className="two-factor-heading">
                    <FaShieldAlt className="heading-icon" />
                    <h1>Two-Factor Authentication</h1>
                </div>
                <div className="coming-soon-section">
                    <h2 className="coming-soon-title">Coming Soon</h2>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorAuthentication;
