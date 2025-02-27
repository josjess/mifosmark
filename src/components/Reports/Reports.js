import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaUser, FaFileInvoice, FaPiggyBank, FaChartPie, FaCogs, FaBalanceScale } from 'react-icons/fa';
import './Reports.css';
import {AuthContext} from "../../context/AuthContext";

const Reports = () => {
    const navigate = useNavigate();
    const { componentVisibility } = useContext(AuthContext);

    const options = [
        { id: "sidebar-reports-all", label: 'All', description: 'All available reports', icon: FaFileAlt, path: '/reports/all', color: '#6a82fb' },
        { id: "sidebar-reports-clients", label: 'Clients', description: 'Client-focused reports', icon: FaUser, path: '/reports/clients', color: '#70bc0e' },
        { id: "sidebar-reports-loans", label: 'Loans', description: 'Loan reports and insights', icon: FaFileInvoice, path: '/reports/loans', color: '#ff7b42' },
        { id: "sidebar-reports-savings", label: 'Savings', description: 'Savings data reports', icon: FaPiggyBank, path: '/reports/savings', color: '#4a90e2' },
        { id: "sidebar-reports-funds", label: 'Funds', description: 'Fund allocations', icon: FaChartPie, path: '/reports/funds', color: '#fbb03b' },
        { id: "sidebar-reports-accounting", label: 'Accounting', description: 'Financial accounts', icon: FaCogs, path: '/reports/accounting', color: '#1abc9c' },
        { id: "sidebar-reports-XBRL", label: 'XBRL', description: 'Financial statements', icon: FaBalanceScale, path: '/report/XBRL', color: '#3498db' }
    ];

    const columns = [
        options.slice(0, 4),
        options.slice(4, 7)
    ];

    return (
        <div className="reports-layout neighbor-element">
            <header className="reports-header">
                <h1>Reports Dashboard</h1>
                <p>Generate various financial and client reports</p>
            </header>
            <div className="reports-cards">
                {columns.map((column, index) => (
                    <div key={index} className="reports-card">
                        {column.map(({ id, label, description, icon: Icon, path, color }) => (
                            <div key={label}
                                 className={`reports-item ${componentVisibility[id] ? "" : "hidden"}`} onClick={() => navigate(path)}>
                                <div className="icon-container" style={{ backgroundColor: color }}>
                                    <Icon className="reports-icon" />
                                </div>
                                <div className="text-content">
                                    <h3>{label}</h3>
                                    <p>{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
