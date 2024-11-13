import React, { useState } from 'react';
import ViewCharges from './ViewCharges';
import CreateCharges from './CreateCharges';
import { Link } from 'react-router-dom';

const Charges = () => {
    const [activeTab, setActiveTab] = useState('viewCharges');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/products" className="breadcrumb-link">Products</Link> . Charges
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewCharges' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewCharges')}
                >
                    View Charges
                </button>
                <button
                    className={`tab-button ${activeTab === 'createCharges' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createCharges')}
                >
                    Create Charge
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewCharges' ? <ViewCharges /> : <CreateCharges />}
            </div>
        </div>
    );
};

export default Charges;
