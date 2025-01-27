import React, {useContext} from 'react';
import './Organization.css';
import {FaBuilding, FaCalendarAlt, FaUsers, FaHistory, FaKey, FaHandHoldingUsd, FaTable, FaSearch, FaDollarSign, FaWarehouse, FaProjectDiagram, FaCashRegister, FaCalendarWeek, FaCreditCard, FaSms, FaUpload, FaMap, FaUserTie} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from "../../../context/AuthContext";

const Organization = () => {
    const navigate = useNavigate();
    const { componentVisibility } = useContext(AuthContext);

    const tiles = [
        { id: "admin-organization-manage-offices", title: 'Manage Offices', icon: <FaBuilding />, description: 'Office management', color: '#f39c12', link: '/manage-offices' },
        { id: "admin-organization-manage-holidays", title: 'Manage Holidays', icon: <FaCalendarAlt />, description: 'Holiday settings', color: '#e74c3c', link: '/manage-holidays' },
        { id: "admin-organization-manage-employees", title: 'Manage Employees', icon: <FaUsers />, description: 'Employee records', color: '#3498db', link: '/manage-employees' },
        { id: "admin-organization-standing-instructions-history", title: 'Standing Instructions History', icon: <FaHistory />, description: 'Instruction records', color: '#8e44ad', link: '/standing-instructions-history' },
        { id: "admin-organization-manage-investors", title: 'Manage Investors', icon: <FaUserTie />, description: 'Investor management', color: '#f479b7', link: '/manage-investors' },
        { id: "admin-organization-fund-mapping", title: 'Fund Mapping', icon: <FaMap />, description: 'Map funds to projects', color: '#16a085', link: '/fund-mapping' },
        { id: "admin-organization-password-preferences", title: 'Password Preferences', icon: <FaKey />, description: 'Password policies', color: '#e67e22', link: '/password-preferences' },
        { id: "admin-organization-loan-provisioning-criteria", title: 'Loan Provisioning Criteria', icon: <FaHandHoldingUsd />, description: 'Loan policies', color: '#27ae60', link: '/loan-provisioning-criteria' },
        { id: "admin-organization-entity-data-table-checks", title: 'Entity Data Table Checks', icon: <FaTable />, description: 'Data checks', color: '#16a085', link: '/entity-data-table-checks' },
        { id: "admin-organization-adhocquery", title: 'AdHocQuery', icon: <FaSearch />, description: 'Define AdHoc Queries', color: '#2980b9', link: '/ad-hoc-query' },
        { id: "admin-organization-currency-configuration", title: 'Currency Configuration', icon: <FaDollarSign />, description: 'Currency settings', color: '#c0392b', link: '/currency-configuration' },
        { id: "admin-organization-manage-funds", title: 'Manage Funds', icon: <FaWarehouse />, description: 'Fund management', color: '#d35400', link: '/manage-funds' },
        { id: "admin-organization-bulk-loan-reassignment", title: 'Bulk Loan Reassignment', icon: <FaProjectDiagram />, description: 'Loan reassignment', color: '#9b59b6', link: '/bulk-loan-reassignment' },
        { id: "admin-organization-teller/cashier-management", title: 'Teller/Cashier Management', icon: <FaCashRegister />, description: 'Cashier setup', color: '#8398ff', link: '/teller-cashier-management' },
        { id: "admin-organization-working-days", title: 'Working Days', icon: <FaCalendarWeek />, description: 'Working days config', color: '#1abc9c', link: '/working-days' },
        { id: "admin-organization-payment-types", title: 'Payment Types', icon: <FaCreditCard />, description: 'Payment settings', color: '#e74c3c', link: '/payment-types' },
        { id: "admin-organization-sms-campaigns", title: 'SMS Campaigns', icon: <FaSms />, description: 'Campaigns setup', color: '#3498db', link: '/sms-campaigns' },
        { id: "admin-organization-bulk-imports", title: 'Bulk Imports', icon: <FaUpload />, description: 'Import bulk data', color: '#9b59b6', link: '/bulk-imports' }
    ];

    return (
        <div className="organization-page neighbor-element">
            <h2 className="system-page-heading">
                <Link to="/admin" className="breadcrumb-link">Admin</Link> . Organization
            </h2>
            <div className="tiles-grid">
                {tiles.map((tile, index) => (
                    <div
                        key={index}
                        className={`tile ${componentVisibility[tile.id] ? "" : "hidden"}`}
                        onClick={() => navigate(tile.link)}
                    >
                        <div className="tile-icon" style={{color: tile.color}}>{tile.icon}</div>
                        <h3 className="tile-title">{tile.title}</h3>
                        <p className="tile-description">{tile.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Organization;
