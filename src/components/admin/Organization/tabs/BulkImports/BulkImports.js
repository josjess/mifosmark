import React from 'react';
import {FaBuilding, FaUser, FaUsers, FaHandHoldingUsd, FaPiggyBank, FaArchive, FaChartLine, FaDollarSign, FaUserTie, FaObjectGroup, FaFileInvoiceDollar, FaMoneyCheckAlt, FaRedoAlt, FaBook, FaHandshake} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const BulkImports = () => {
    const navigate = useNavigate();

    const tiles = [
        { title: 'Offices', icon: <FaBuilding />, description: 'Import office data', color: '#f39c12', link: '/bulk-imports/offices' },
        { title: 'Users', icon: <FaUser />, description: 'Import user data', color: '#e74c3c', link: '/bulk-imports/users' },
        { title: 'Groups', icon: <FaObjectGroup />, description: 'Import group data', color: '#3498db', link: '/bulk-imports/groups' },
        { title: 'Loan Accounts', icon: <FaHandHoldingUsd />, description: 'Import loan accounts', color: '#8e44ad', link: '/bulk-imports/loanaccounts' },
        { title: 'Savings Accounts', icon: <FaPiggyBank />, description: 'Import savings accounts', color: '#27ae60', link: '/bulk-imports/savingsaccounts' },
        { title: 'Fixed Deposit Accounts', icon: <FaArchive />, description: 'Import fixed deposit accounts', color: '#16a085', link: '/bulk-imports/fixeddeposit-accounts' },
        { title: 'Chart of Accounts', icon: <FaChartLine />, description: 'Import chart of accounts', color: '#d35400', link: '/bulk-imports/chartofaccounts' },
        { title: 'Share Accounts', icon: <FaDollarSign />, description: 'Import share accounts', color: '#8398ff', link: '/bulk-imports/shareaccounts' },
        { title: 'Employees', icon: <FaUserTie />, description: 'Import employee data', color: '#2980b9', link: '/bulk-imports/employees' },
        { title: 'Clients', icon: <FaUsers />, description: 'Import client data', color: '#c0392b', link: '/bulk-imports/clients' },
        { title: 'Centers', icon: <FaBuilding />, description: 'Import center data', color: '#e67e22', link: '/bulk-imports/centers' },
        { title: 'Loan Repayments', icon: <FaFileInvoiceDollar />, description: 'Import loan repayments', color: '#9b59b6', link: '/bulk-imports/loanrepayments' },
        { title: 'Savings Transactions', icon: <FaMoneyCheckAlt />, description: 'Import savings transactions', color: '#1abc9c', link: '/bulk-imports/savingstransactions' },
        { title: 'Fixed Deposit Transactions', icon: <FaArchive />, description: 'Import fixed deposit transactions', color: '#f479b7', link: '/bulk-imports/fixeddeposittransactions' },
        { title: 'Recurring Deposit Transactions', icon: <FaRedoAlt />, description: 'Import recurring deposit transactions', color: '#8398ff', link: '/bulk-imports/recurringdeposittransactions' },
        { title: 'Journal Entries', icon: <FaBook />, description: 'Import journal entries', color: '#e74c3c', link: '/bulk-imports/journalentries' },
        { title: 'Guarantors', icon: <FaHandshake />, description: 'Import guarantor data', color: '#27ae60', link: '/bulk-imports/guarantors' },
    ];

    return (
        <div className="organization-page">
            <h2 className="system-page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Bulk Imports
            </h2>
            <div className="tiles-grid">
                {tiles.map((tile, index) => (
                    <div
                        key={index}
                        className="import-tile"
                        onClick={() => navigate(tile.link)}
                    >
                        <div className="tile-icon" style={{ color: tile.color }}>{tile.icon}</div>
                        <h3 className="tile-title">{tile.title}</h3>
                        <p className="tile-description">{tile.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BulkImports;
