import React, { useState } from 'react';
import ViewEntityDataTableChecks from './ViewEntityDataTableChecks';
import CreateEntityDataTableCheck from './CreateEntityDataTableCheck';
import { Link } from 'react-router-dom';

const EntityDataTableChecks = () => {
    const [activeTab, setActiveTab] = useState('view');

    return (
        <div className="tab-products-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Entity Data Table Checks
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
                    onClick={() => setActiveTab('view')}
                >
                    View Entity Data Table Checks
                </button>
                <button
                    className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => setActiveTab('create')}
                >
                    Create Entity Data Table Check
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'view' && <ViewEntityDataTableChecks />}
                {activeTab === 'create' && <CreateEntityDataTableCheck />}
            </div>
        </div>
    );
};

export default EntityDataTableChecks;
