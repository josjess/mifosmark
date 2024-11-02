import React, { useState } from 'react';
import ChartOfAccountsTable from './ViewChartofAccounts';
import AddAccountForm from './AddGlAccountForm';
import './ChartofAccounts.css';
import {Link} from "react-router-dom";

const ChartOfAccounts = () => {
    const [activeTab, setActiveTab] = useState('table');

    return (
        <div className="chart-accounts-container">
            <h2 className="chart-accounts-head">
                <Link to="/accounting" className="breadcrumb-link">Accounting. </Link> <span>Chart of Accounts </span>
            </h2>
            <div className="chart-tab-container">
                <button
                    className={`chart-tab-button ${activeTab === 'table' ? 'active' : ''}`}
                    onClick={() => setActiveTab('table')}
                >
                    Chart of Accounts
                </button>
                <button
                    className={`chart-tab-button ${activeTab === 'form' ? 'active' : ''}`}
                    onClick={() => setActiveTab('form')}
                >
                    Add New GL Account
                </button>
            </div>
            <div className="chart-tab-content">
                {activeTab === 'table' ? <ChartOfAccountsTable/> : <AddAccountForm/>}
            </div>
        </div>
    );
};

export default ChartOfAccounts;
