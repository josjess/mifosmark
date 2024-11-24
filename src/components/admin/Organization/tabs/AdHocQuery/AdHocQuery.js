import React, { useState } from 'react';
import ViewAdHocQuery from './ViewAdHocQuery';
import CreateAdHocQuery from './CreateAdHocQuery';
import { Link } from 'react-router-dom';

const AdHocQuery = () => {
    const [activeTab, setActiveTab] = useState('viewAdHocQuery');

    const handleFormSubmitSuccess = () => {
        setActiveTab('viewAdHocQuery');
    };

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Ad Hoc Query
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewAdHocQuery' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewAdHocQuery')}
                >
                    View Ad Hoc Query
                </button>
                <button
                    className={`tab-button ${activeTab === 'createAdHocQuery' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createAdHocQuery')}
                >
                    Create Ad Hoc Query
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewAdHocQuery' && <ViewAdHocQuery />}
                {activeTab === 'createAdHocQuery' && (
                    <CreateAdHocQuery onFormSubmitSuccess={handleFormSubmitSuccess} />
                )}
            </div>
        </div>
    );
};

export default AdHocQuery;
