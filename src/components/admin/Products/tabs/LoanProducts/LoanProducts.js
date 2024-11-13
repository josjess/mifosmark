import React, { useState } from 'react';
import ViewLoanProducts from './ViewLoanProducts';
import CreateLoanProducts from './CreateLoanProducts';
import './LoanProducts.css';
import {Link} from "react-router-dom";

const LoanProducts = () => {
    const [activeTab, setActiveTab] = useState('viewLoanProducts');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/products" className="breadcrumb-link">Products</Link> . Loan Products
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewLoanProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewLoanProducts')}
                >
                    View Loan Products
                </button>
                <button
                    className={`tab-button ${activeTab === 'createLoanProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createLoanProducts')}
                >
                    Create Loan Product
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewLoanProducts' ? (
                    <ViewLoanProducts />
                ) : (
                    <CreateLoanProducts />
                )}
            </div>
        </div>
    );
};

export default LoanProducts;
