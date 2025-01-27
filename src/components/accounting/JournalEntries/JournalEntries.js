import React, { useState } from 'react';
import AddJournalEntries from './AddJournalEntries';
import ViewJournalEntries from './ViewJournalEntries';
import MigrateOpeningBalances from './MigrateOpeningBalances';
import './JournalEntries.css';
import { Link } from "react-router-dom";

const JournalEntries = () => {
    const [activeTab, setActiveTab] = useState('add');

    return (
        <div className="journal-entries-screen neighbor-element">
            <h2 className="journal-head">
                <Link to="/accounting" className="breadcrumb-link">Accounting</Link> . Journal Entries
            </h2>

            <div className="tab-container">
                <button
                    onClick={() => setActiveTab('add')}
                    className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
                >
                    Add Journal Entries
                </button>
                <button
                    onClick={() => setActiveTab('view')}
                    className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
                >
                    View/Search Journal Entries
                </button>
                <button
                    onClick={() => setActiveTab('migrate')}
                    className={`tab-button ${activeTab === 'migrate' ? 'active' : ''}`}
                >
                    Migrate Opening Balances
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'add' && <AddJournalEntries />}
                {activeTab === 'view' && <ViewJournalEntries />}
                {activeTab === 'migrate' && <MigrateOpeningBalances />}
            </div>
        </div>
    );
};

export default JournalEntries;
