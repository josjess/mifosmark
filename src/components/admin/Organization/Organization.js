import React from 'react';
import './Organization.css';
import {
    FaBuilding, FaCalendarAlt, FaUsers, FaHistory, FaKey, FaHandHoldingUsd, FaTable,
    FaSearch, FaDollarSign, FaWarehouse, FaProjectDiagram, FaCashRegister,
    FaCalendarWeek, FaCreditCard, FaSms, FaUpload
} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';

const Organization = () => {
    const navigate = useNavigate();

    const tiles = [
        { title: 'Manage Offices', icon: <FaBuilding />, description: 'Office management', color: '#f39c12', link: '#/manage-offices' },
        { title: 'Manage Holidays', icon: <FaCalendarAlt />, description: 'Holiday settings', color: '#e74c3c', link: '#/manage-holidays' },
        { title: 'Manage Employees', icon: <FaUsers />, description: 'Employee records', color: '#3498db', link: '#/manage-employees' },
        { title: 'Standing Instructions History', icon: <FaHistory />, description: 'Instruction records', color: '#8e44ad', link: '#/standing-instructions-history' },
        { title: 'Password Preferences', icon: <FaKey />, description: 'Password policies', color: '#e67e22', link: '#/password-preferences' },
        { title: 'Loan Provisioning Criteria', icon: <FaHandHoldingUsd />, description: 'Loan policies', color: '#27ae60', link: '#/loan-provisioning-criteria' },
        { title: 'Entity Data Table Checks', icon: <FaTable />, description: 'Data checks', color: '#16a085', link: '#/entity-data-table-checks' },
        { title: 'AdHocQuery', icon: <FaSearch />, description: 'Custom queries', color: '#2980b9', link: '#/adhoc-query' },
        { title: 'Currency Configuration', icon: <FaDollarSign />, description: 'Currency settings', color: '#c0392b', link: '#/currency-configuration' },
        { title: 'Manage Funds', icon: <FaWarehouse />, description: 'Fund management', color: '#d35400', link: '#/manage-funds' },
        { title: 'Bulk Loan Reassignment', icon: <FaProjectDiagram />, description: 'Loan reassignment', color: '#9b59b6', link: '#/bulk-loan-reassignment' },
        { title: 'Teller/Cashier Management', icon: <FaCashRegister />, description: 'Cashier setup', color: '#8398ff', link: '#/teller-cashier-management' },
        { title: 'Working Days', icon: <FaCalendarWeek />, description: 'Working days config', color: '#1abc9c', link: '#/working-days' },
        { title: 'Payment Type', icon: <FaCreditCard />, description: 'Payment settings', color: '#e74c3c', link: '#/payment-type' },
        { title: 'SMS Campaigns', icon: <FaSms />, description: 'Campaigns setup', color: '#3498db', link: '#/sms-campaigns' },
        { title: 'Bulk Imports', icon: <FaUpload />, description: 'Import bulk data', color: '#9b59b6', link: '#/bulk-imports' }
    ];

    return (
        <div className="organization-page">
            <h2 className="system-page-heading">
                <Link to="/admin" className="breadcrumb-link">Admin</Link> . Organization
            </h2>
            <div className="tiles-grid">
                {tiles.map((tile, index) => (
                    <div
                        key={index}
                        className="tile"
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
