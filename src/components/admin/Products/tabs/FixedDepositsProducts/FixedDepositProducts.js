import React, { useState } from 'react';
import ViewFixedDepositProducts from './ViewFixedDepositProducts';
import CreateFixedDepositProducts from './CreateFixedDepositProducts';
import { Link } from 'react-router-dom';

const FixedDepositProducts = () => {
    const [activeTab, setActiveTab] = useState('viewFixedDepositProducts');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/products" className="breadcrumb-link">Products</Link> . Fixed Deposit Products
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewFixedDepositProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewFixedDepositProducts')}
                >
                    View Fixed Deposit Products
                </button>
                <button
                    className={`tab-button ${activeTab === 'createFixedDepositProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createFixedDepositProducts')}
                >
                    Create Fixed Deposit Product
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewFixedDepositProducts' ? (
                    <ViewFixedDepositProducts />
                ) : (
                    <CreateFixedDepositProducts />
                )}
            </div>
        </div>
    );
};

export default FixedDepositProducts;
