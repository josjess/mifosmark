import React, { useState } from 'react';
import ViewRecurringDepositProducts from './ViewRecurringDepositProducts';
import CreateRecurringDepositProducts from './CreateRecurringDepositProducts';
import { Link } from 'react-router-dom';

const RecurringDepositProducts = () => {
    const [activeTab, setActiveTab] = useState('viewRecurringDepositProducts');

    return (
        <div className="tab-products-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/products" className="breadcrumb-link">Products</Link> . Recurring Deposit Products
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewRecurringDepositProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewRecurringDepositProducts')}
                >
                    View Recurring Deposit Products
                </button>
                <button
                    className={`tab-button ${activeTab === 'createRecurringDepositProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createRecurringDepositProducts')}
                >
                    Create Recurring Deposit Product
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewRecurringDepositProducts' ? (
                    <ViewRecurringDepositProducts />
                ) : (
                    <CreateRecurringDepositProducts />
                )}
            </div>
        </div>
    );
};

export default RecurringDepositProducts;
