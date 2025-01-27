import React, { useState } from 'react';
import ViewProductsMix from './ViewProductsMix';
import CreateProductsMix from './CreateProductsMix';
import { Link } from 'react-router-dom';

const ProductsMix = () => {
    const [activeTab, setActiveTab] = useState('viewProductsMix');

    return (
        <div className="tab-products-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/products" className="breadcrumb-link">Products</Link> . Products Mix
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewProductsMix' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewProductsMix')}
                >
                    View Products Mix
                </button>
                <button
                    className={`tab-button ${activeTab === 'createProductsMix' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createProductsMix')}
                >
                    Add Products Mix
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewProductsMix' ? (
                    <ViewProductsMix />
                ) : (
                    <CreateProductsMix />
                )}
            </div>
        </div>
    );
};

export default ProductsMix;
