import React, { useState } from 'react';
import ViewOffices from './ViewOffices';
import CreateOffice from './CreateOffice';
import { Link } from 'react-router-dom';
import ImportOffices from './ImportOffices';

const ManageOffices = () => {
    const [activeTab, setActiveTab] = useState('viewOffices');

    const handleFormSubmitSuccess = () => {
        setActiveTab('viewOffices');
    };

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Manage Offices
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewOffices' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewOffices')}
                >
                    View Offices
                </button>
                <button
                    className={`tab-button ${activeTab === 'createOffice' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createOffice')}
                >
                    Create Office
                </button>
                <button
                    className={`tab-button ${activeTab === 'importOffices' ? 'active' : ''}`}
                    onClick={() => setActiveTab('importOffices')}
                >
                    Import Offices
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewOffices' && <ViewOffices />}
                {activeTab === 'createOffice' && <CreateOffice onFormSubmitSuccess={handleFormSubmitSuccess} />}
                {activeTab === 'importOffices' && <ImportOffices />}
            </div>
        </div>
    );
};

export default ManageOffices;
