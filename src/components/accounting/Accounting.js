import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {FaFileInvoiceDollar, FaJournalWhills, FaChartLine, FaBook, FaMapSigns, FaExchangeAlt, FaCogs, FaMoneyCheck, FaBalanceScale} from 'react-icons/fa';
import './Accounting.css';
import {AuthContext} from "../../context/AuthContext";

const Accounting = () => {
    const navigate = useNavigate();
    const { componentVisibility } = useContext(AuthContext);

    const options = [
        { id: "accounting-frequent-postings",  label: 'Frequent Postings', description: 'Quick access entries', icon: FaFileInvoiceDollar, path: '/frequent-postings', color: '#6a82fb' },
        { id: "accounting-journal-entries", label: 'Journal Entries', description: 'Create new records/view existing ones', icon: FaJournalWhills, path: '/journal-entries', color: '#70bc0e' },
        { id: "accounting-closing-entries", label: 'Closing Entries', description: 'End-of-period actions', icon: FaChartLine, path: '/closing-entries', color: '#ff7b42' },
        { id: "accounting-chart-of-accounts", label: 'Chart of Accounts', description: 'Manage accounts', icon: FaBook, path: '/chart-of-accounts', color: '#4a90e2' },
        { id: "accounting-financial-activity-mappings", label: 'Financial Activity Mappings', description: 'Map transactions', icon: FaMapSigns, path: '/financial-activity-mappings', color: '#fbb03b' },
        { id: "accounting-rules", label: 'Accounting Rules', description: 'Set up rules', icon: FaCogs, path: '/accounting-rules', color: '#1abc9c' },
        { id: "accounting-accruals",label: 'Accruals', description: 'Deferred revenue', icon: FaMoneyCheck, path: '/accruals', color: '#f67280' },
        { id: "accounting-provisioning-entries", label: 'Provisioning Entries', description: 'Allowance records', icon: FaBalanceScale, path: '/provisioning-entries', color: '#3498db' }
    ];

    const columns = [
        options.slice(0, 5),
        options.slice(5, 6),
        options.slice(6, 9)
    ];

    return (
        <div className="accounting-layout neighbor-element">
            <header className="accounting-header">
                <h1>Accounting Dashboard</h1>
                <p>Key accounting options and financial entries</p>
            </header>
            <div className="accounting-cards">
                <div className="accounting-card">
                    {columns[0].map(({ id, label, description, icon: Icon, path, color }) => (
                        <div key={id}
                             className={`accounting-item ${componentVisibility[id] ? "" : "hidden"}`}
                             onClick={() => navigate(path)}>
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
                    {columns[1].map(({ id,  label, description, icon: Icon, path, color }) => (
                        <div key={id}
                             className={`accounting-item ${componentVisibility[id] ? "" : "hidden"}`}
                             onClick={() => navigate(path)}>
                            <div className="icon-container" style={{ backgroundColor: color }}>
                                <Icon className="accounting-icon" />
                            </div>
                            <div className="text-content">
                                <h3>{label}</h3>
                                <p>{description}</p>
                            </div>
                        </div>
                    ))}
                    {columns[2].map(({ id,  label, description, icon: Icon, path, color }) => (
                        <div key={id}
                             className={`accounting-item ${componentVisibility[id] ? "" : "hidden"}`}
                             onClick={() => navigate(path)}>
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
