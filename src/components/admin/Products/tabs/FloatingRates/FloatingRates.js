import React, { useState } from 'react';
import ViewFloatingRates from './ViewFloatingRates';
import CreateFloatingRates from './CreateFloatingRates';
import { Link } from 'react-router-dom';

const FloatingRates = () => {
    const [activeTab, setActiveTab] = useState('viewFloatingRates');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/products" className="breadcrumb-link">Products</Link> . Floating Rates
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewFloatingRates' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewFloatingRates')}
                >
                    View Floating Rates
                </button>
                <button
                    className={`tab-button ${activeTab === 'createFloatingRates' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createFloatingRates')}
                >
                    Create Floating Rate
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewFloatingRates' ? <ViewFloatingRates /> : <CreateFloatingRates />}
            </div>
        </div>
    );
};

export default FloatingRates;
