import React, { useState } from 'react';
import ViewSMSCampaigns from './ViewSMSCampaigns';
import CreateSMSCampaign from './CreateSMSCampaign';
import { Link } from 'react-router-dom';

const ManageSMSCampaigns = () => {
    const [activeTab, setActiveTab] = useState('viewSMSCampaigns');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Manage SMS Campaigns
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewSMSCampaigns' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewSMSCampaigns')}
                >
                    View SMS Campaigns
                </button>
                <button
                    className={`tab-button ${activeTab === 'createSMSCampaign' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createSMSCampaign')}
                >
                    Create SMS Campaign
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewSMSCampaigns' && <ViewSMSCampaigns />}
                {activeTab === 'createSMSCampaign' && <CreateSMSCampaign />}
            </div>
        </div>
    );
};

export default ManageSMSCampaigns;
