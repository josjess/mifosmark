import React, { useState } from 'react';
import ViewCollaterals from './ViewCollaterals';
import CreateCollaterals from './CreateCollaterals';
import { Link } from 'react-router-dom';

const Collaterals = () => {
    const [activeTab, setActiveTab] = useState('viewCollaterals');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/products" className="breadcrumb-link">Products</Link> . Collaterals
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewCollaterals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewCollaterals')}
                >
                    View Collaterals
                </button>
                <button
                    className={`tab-button ${activeTab === 'createCollaterals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createCollaterals')}
                >
                    Create Collateral
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewCollaterals' ? <ViewCollaterals /> : <CreateCollaterals />}
            </div>
        </div>
    );
};

export default Collaterals;
