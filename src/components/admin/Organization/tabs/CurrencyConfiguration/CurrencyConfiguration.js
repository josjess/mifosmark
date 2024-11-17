import React, { useState } from 'react';
import ViewCurrencyConfiguration from './ViewCurrencyConfiguration';
import CreateCurrencyConfiguration from './CreateCurrencyConfiguration';
import { Link } from 'react-router-dom';

const CurrencyConfiguration = () => {
    const [activeTab, setActiveTab] = useState('viewCurrencies');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Currency Configuration
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewCurrencies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewCurrencies')}
                >
                    View Currencies
                </button>
                <button
                    className={`tab-button ${activeTab === 'createCurrency' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createCurrency')}
                >
                    Create/Edit Currency
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewCurrencies' && <ViewCurrencyConfiguration />}
                {activeTab === 'createCurrency' && <CreateCurrencyConfiguration />}
            </div>
        </div>
    );
};

export default CurrencyConfiguration;
