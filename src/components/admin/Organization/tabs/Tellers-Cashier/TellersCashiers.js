import React, { useState } from 'react';
import ViewTellers from './ViewTellers';
import CreateTeller from './CreateTeller';
import { Link } from 'react-router-dom';

const TellersCashiers = () => {
    const [activeTab, setActiveTab] = useState('viewTellers');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Tellers/Cashiers
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewTellers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewTellers')}
                >
                    View Tellers
                </button>
                <button
                    className={`tab-button ${activeTab === 'createTeller' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createTeller')}
                >
                    Create Teller
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewTellers' && <ViewTellers />}
                {activeTab === 'createTeller' && <CreateTeller />}
            </div>
        </div>
    );
};

export default TellersCashiers;
