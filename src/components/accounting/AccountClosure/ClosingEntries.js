import React, { useState } from 'react';
import AccountClosure from './AccountClosure';
import CreateClosure from './CreateClosure';
import './ClosingEntries.css';
import {Link} from "react-router-dom";

const ClosingEntries = () => {
    const [activeTab, setActiveTab] = useState('accountClosure');

    return (
        <div className="closing-entries-screen">
            <h2 className="closing-entries-head">
                <Link to="/accounting" className="breadcrumb-link">Accounting </Link> . Closing Entries
            </h2>
            <div className="closing-tab-container">
                <button
                    className={`closing-tab-button ${activeTab === 'accountClosure' ? 'active' : ''}`}
                    onClick={() => setActiveTab('accountClosure')}
                >
                    Account Closure
                </button>
                <button
                    className={`closing-tab-button ${activeTab === 'createClosure' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createClosure')}
                >
                    Create Closure
                </button>
            </div>
            <div className="closing-tab-content">
                {activeTab === 'accountClosure' ? <AccountClosure/> : <CreateClosure/>}
            </div>
        </div>
    );
};

export default ClosingEntries;
