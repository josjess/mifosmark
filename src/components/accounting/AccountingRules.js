import React, { useState } from 'react';
import AccountingRulesTable from './ViewAccountingRules';
import AddAccountingRule from './AddAccountingRule';
import './AccountingRules.css';
import { Link } from "react-router-dom";

const AccountingRulesTabs = () => {
    const [activeTab, setActiveTab] = useState('viewRules');

    return (
        <div className="accounting-rules-screen">
            <h2 className="accounting-rules-head">
                <Link to="/accounting" className="breadcrumb-link">Accounting </Link> . Accounting Rules
            </h2>
            <div className="accounting-tab-container">
                <button
                    className={`accounting-tab-button ${activeTab === 'viewRules' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewRules')}
                >
                    View Rules
                </button>
                <button
                    className={`accounting-tab-button ${activeTab === 'addRule' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addRule')}
                >
                    Add New Rule
                </button>
            </div>
            <div className="accounting-tab-content">
                {activeTab === 'viewRules' ? <AccountingRulesTable /> : <AddAccountingRule />}
            </div>
        </div>
    );
};

export default AccountingRulesTabs;
