import React, { useState } from 'react';
import ViewShareProducts from './ViewShareProducts';
import CreateShareProducts from './CreateShareProducts';
import { Link } from 'react-router-dom';

const ShareProducts = () => {
    const [activeTab, setActiveTab] = useState('viewShareProducts');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/products" className="breadcrumb-link">Products</Link> . Share Products
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewShareProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewShareProducts')}
                >
                    View Share Products
                </button>
                <button
                    className={`tab-button ${activeTab === 'createShareProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createShareProducts')}
                >
                    Create Share Product
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewShareProducts' ? (
                    <ViewShareProducts />
                ) : (
                    <CreateShareProducts />
                )}
            </div>
        </div>
    );
};

export default ShareProducts;
