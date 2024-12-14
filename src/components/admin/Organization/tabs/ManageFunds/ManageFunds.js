import React, { useState } from 'react';
import ViewFunds from './ViewFunds';
import CreateFund from './CreateFund';
import { Link } from 'react-router-dom';

const ManageFunds = () => {
    const [activeTab, setActiveTab] = useState('viewFunds');

    const handleTabSwitch = () => {
        setActiveTab('viewFunds');
    };

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Manage Funds
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewFunds' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewFunds')}
                >
                    View Funds
                </button>
                <button
                    className={`tab-button ${activeTab === 'createFund' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createFund')}
                >
                    Create Fund
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewFunds' && <ViewFunds />}
                {activeTab === 'createFund' &&
                    <CreateFund onFormSubmitSuccess={handleTabSwitch} />}
            </div>
        </div>
    );
};

export default ManageFunds;
