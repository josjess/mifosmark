import React, { useState } from 'react';
import ViewProvisioningEntries from './ProvisioningEntriesTable';
import CreateProvisioningEntry from './CreateProvisioningEntryForm';
import './ProvisioningEntries.css';
import { Link } from 'react-router-dom';

const ProvisioningEntriesPage = () => {
    const [activeTab, setActiveTab] = useState('view');

    return (
        <div className="provisioning-entries-screen neighbor-element">
            <h2 className="provisioning-head">
                <Link to="/accounting" className="breadcrumb-link">Accounting</Link> . Provisioning Entries
            </h2>

            <div className="tab-container">
                <button
                    onClick={() => setActiveTab('view')}
                    className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
                >
                    View Provisioning Entries
                </button>
                <button
                    onClick={() => setActiveTab('create')}
                    className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
                >
                    Create Provisioning Entry
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'view' ? <ViewProvisioningEntries /> : <CreateProvisioningEntry />}
            </div>
        </div>
    );
};

export default ProvisioningEntriesPage;
