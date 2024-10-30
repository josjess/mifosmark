import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaFileInvoiceDollar,
    FaJournalWhills,
    FaChartLine,
    FaBook,
    FaMapSigns,
    FaExchangeAlt,
    FaCogs,
    FaMoneyCheck,
    FaBalanceScale
} from 'react-icons/fa';
import './Accounting.css';

const Accounting = () => {
    const navigate = useNavigate();

    const options = [
        { label: 'Frequent Postings', description: 'Quick access entries', icon: FaFileInvoiceDollar, path: '/frequent-postings', color: '#6a82fb' },
        { label: 'Add Journal Entries', description: 'Create new records', icon: FaJournalWhills, path: '/journal-entries', color: '#70bc0e' },
        { label: 'Closing Entries', description: 'End-of-period actions', icon: FaChartLine, path: '/accounting#closing-entries', color: '#ff7b42' },
        { label: 'Chart of Accounts', description: 'Manage accounts', icon: FaBook, path: '/accounting#chart-of-accounts', color: '#4a90e2' },
        { label: 'Financial Activity Mappings', description: 'Map transactions', icon: FaMapSigns, path: '/accounting#financial-activity-mappings', color: '#fbb03b' },
        { label: 'Migrate Opening Balances', description: 'Transfer balances', icon: FaExchangeAlt, path: '/accounting#migrate-opening-balances', color: '#9b51e0' },
        { label: 'Accounting Rules', description: 'Set up rules', icon: FaCogs, path: '/accounting#accounting-rules', color: '#1abc9c' },
        { label: 'Accruals', description: 'Deferred revenue', icon: FaMoneyCheck, path: '/accounting#accruals', color: '#f67280' },
        { label: 'Provisioning Entries', description: 'Allowance records', icon: FaBalanceScale, path: '/accounting#provisioning-entries', color: '#3498db' }
    ];

    const columns = [
        options.slice(0, 5),
        options.slice(5, 6),
        options.slice(6, 9)
    ];

    return (
        <div className="accounting-layout">
            <header className="accounting-header">
                <h1>Accounting Dashboard</h1>
                <p>Key accounting options and financial entries</p>
            </header>
            <div className="accounting-cards">
                <div className="accounting-card">
                    {columns[0].map(({ label, description, icon: Icon, path, color }) => (
                        <div key={label} className="accounting-item" onClick={() => navigate(path)}>
                            <div className="icon-container" style={{ backgroundColor: color }}>
                                <Icon className="accounting-icon" />
                            </div>
                            <div className="text-content">
                                <h3>{label}</h3>
                                <p>{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="accounting-card">
                    {columns[1].map(({ label, description, icon: Icon, path, color }) => (
                        <div key={label} className="accounting-item" onClick={() => navigate(path)}>
                            <div className="icon-container" style={{ backgroundColor: color }}>
                                <Icon className="accounting-icon" />
                            </div>
                            <div className="text-content">
                                <h3>{label}</h3>
                                <p>{description}</p>
                            </div>
                        </div>
                    ))}
                    {columns[2].map(({ label, description, icon: Icon, path, color }) => (
                        <div key={label} className="accounting-item" onClick={() => navigate(path)}>
                            <div className="icon-container" style={{ backgroundColor: color }}>
                                <Icon className="accounting-icon" />
                            </div>
                            <div className="text-content">
                                <h3>{label}</h3>
                                <p>{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Accounting;
