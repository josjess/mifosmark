import React, { useState } from 'react';
import ViewProvisioningCriteria from './ViewProvisioningCriteria';
import CreateProvisioningCriteria from './CreateProvisioningCriteria';
import { Link } from 'react-router-dom';

const LoanProvisioningCriteria = () => {
    const [activeTab, setActiveTab] = useState('viewProvisioningCriteria');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Loan Provisioning Criteria
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewProvisioningCriteria' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewProvisioningCriteria')}
                >
                    View Provisioning Criteria
                </button>
                <button
                    className={`tab-button ${activeTab === 'createProvisioningCriteria' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createProvisioningCriteria')}
                >
                    Create Provisioning Criteria
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewProvisioningCriteria' && <ViewProvisioningCriteria />}
                {activeTab === 'createProvisioningCriteria' && <CreateProvisioningCriteria />}
            </div>
        </div>
    );
};

export default LoanProvisioningCriteria;
