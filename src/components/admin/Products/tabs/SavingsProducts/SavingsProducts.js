import React, { useState } from 'react';
import ViewSavingsProducts from './ViewSavingsProducts';
import CreateSavingsProducts from './CreateSavingsProducts';
import { Link } from 'react-router-dom';

const SavingsProducts = () => {
    const [activeTab, setActiveTab] = useState('viewSavingsProducts');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/products" className="breadcrumb-link">Products</Link> . Savings Products
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewSavingsProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewSavingsProducts')}
                >
                    View Savings Products
                </button>
                <button
                    className={`tab-button ${activeTab === 'createSavingsProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createSavingsProducts')}
                >
                    Create Savings Product
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewSavingsProducts' ? (
                    <ViewSavingsProducts />
                ) : (
                    <CreateSavingsProducts />
                )}
            </div>
        </div>
    );
};

export default SavingsProducts;
