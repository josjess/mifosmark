import React, { useState } from 'react';
import ViewTellers from './ViewTellers';
import CreateTeller from './CreateTeller';
import ViewCashiers from './ViewCashiers';
import CreateCashier from './CreateCashier';
import { Link } from 'react-router-dom';

const TellersCashiers = () => {
    const [activeTab, setActiveTab] = useState('viewTellers');
    const [currentTeller, setCurrentTeller] = useState(null);

    const handleFormSubmitSuccess = () => {
        setActiveTab('viewTellers');
    };

    const handleViewCashiers = (teller) => {
        setCurrentTeller(teller);
        setActiveTab('viewCashiers');
    };

    return (
        <div className="tab-products-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Tellers/Cashiers
            </h2>
            <div className="tabs-container">
                {activeTab === 'viewTellers' || activeTab === 'createTeller' ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <button
                            className={`tab-button ${activeTab === 'viewCashiers' ? 'active' : ''}`}
                            onClick={() => setActiveTab('viewCashiers')}
                        >
                            View Cashiers
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'createCashier' ? 'active' : ''}`}
                            onClick={() => setActiveTab('createCashier')}
                        >
                            Create Cashier
                        </button>
                    </>
                )}
            </div>
            <div className="tab-content">
                {activeTab === 'viewTellers' && (
                    <ViewTellers onViewCashiers={handleViewCashiers} />
                )}
                {activeTab === 'createTeller' && (
                    <CreateTeller onFormSubmitSuccess={handleFormSubmitSuccess} />
                )}
                {activeTab === 'viewCashiers' && currentTeller && (
                    <ViewCashiers teller={currentTeller} setActiveTab={setActiveTab} />
                )}
                {activeTab === 'createCashier' && (
                    <CreateCashier teller={currentTeller} />
                )}
            </div>
        </div>
    );
};

export default TellersCashiers;
