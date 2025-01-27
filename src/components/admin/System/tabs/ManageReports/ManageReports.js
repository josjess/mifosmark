import React, { useState } from 'react';
import ViewReportsTable from './ViewReports';
import ReportForm from './CreateReport';
import './ManageReports.css';
import { Link } from 'react-router-dom';

const ManageReports = () => {
    const [activeTab, setActiveTab] = useState('viewReports');

    return (
        <div className="manage-reports-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/system" className="breadcrumb-link">System</Link> . Manage Reports
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewReports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewReports')}
                >
                    View Reports
                </button>
                <button
                    className={`tab-button ${activeTab === 'addReport' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addReport')}
                >
                    Create Report
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewReports' ? (
                    <ViewReportsTable />
                ) : (
                    <ReportForm />
                )}
            </div>
        </div>
    );
};

export default ManageReports;
