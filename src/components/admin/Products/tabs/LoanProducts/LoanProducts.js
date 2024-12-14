import React, { useState } from 'react';
import ViewLoanProducts from './ViewLoanProducts';
import CreateLoanProducts from './CreateLoanProducts';
import LoanProductDetails from './LoanProductDetails';
import './LoanProducts.css';
import {Link} from "react-router-dom";

const LoanProducts = () => {
    const [activeTab, setActiveTab] = useState('viewLoanProducts');
    const [dynamicTabs, setDynamicTabs] = useState([]);

    const handleOpenLoanProductDetails = (product) => {
        const tabId = `LoanProductDetail-${product.id}`;
        const tabLabel = product.name;

        setDynamicTabs([
            {
                id: tabId,
                label: tabLabel,
                component: (
                    <LoanProductDetails
                        loanProductId={product.id}
                        onClose={() => handleCloseTab(tabId)}
                    />
                ),
            },
        ]);
        setActiveTab(tabId);
    };

    const handleCloseTab = (tabId) => {
        setDynamicTabs([]);
        if (activeTab === tabId) {
            setActiveTab('viewLoanProducts');
        }
    };

    const renderTabContent = () => {
        if (activeTab === 'viewLoanProducts') {
            return <ViewLoanProducts onRowClick={handleOpenLoanProductDetails} />;
        } else if (activeTab === 'createLoanProducts') {
            return <CreateLoanProducts />;
        } else {
            const activeDynamicTab = dynamicTabs.find((tab) => tab.id === activeTab);
            return activeDynamicTab ? activeDynamicTab.component : null;
        }
    };

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
                {dynamicTabs.map((tab) => (
                    <div key={tab.id} className="dynamic-tab">
                        <button
                            className={`users-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                        <button
                            className="close-dynamic-tab"
                            onClick={() => handleCloseTab(tab.id)}
                        >
                            Close
                        </button>
                    </div>
                ))}
                <button
                    className={`tab-button ${activeTab === 'createLoanProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createLoanProducts')}
                >
                    Create Loan Product
                </button>
            </div>

            <div className="users-tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default LoanProducts;
