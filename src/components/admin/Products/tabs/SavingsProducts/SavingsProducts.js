import React, { useState } from 'react';
import ViewSavingsProducts from './ViewSavingsProducts';
import CreateSavingsProducts from './CreateSavingsProducts';
import SavingsProductDetails from './SavingsProductDetails';
import { Link } from 'react-router-dom';

const SavingsProducts = () => {
    const [activeTab, setActiveTab] = useState('viewSavingsProducts');
    const [dynamicTabs, setDynamicTabs] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleEditSavingsProduct = (product) => {
        setSelectedProduct(product);
        setActiveTab('createSavingsProducts');
    };

    const handleOpenSavingsProductDetails = (product) => {
        const tabId = `SavingsProductDetail-${product.id}`;
        const tabLabel = product.name;

        setDynamicTabs([
            {
                id: tabId,
                label: tabLabel,
                component: (
                    <SavingsProductDetails
                        savingsProductId={product.id}
                        onClose={() => handleCloseTab(tabId)}
                        onEdit={handleEditSavingsProduct}
                    />
                ),
            },
        ]);
        setActiveTab(tabId);
    };

    const handleCloseTab = (tabId) => {
        setDynamicTabs([]);
        if (activeTab === tabId) {
            setActiveTab('viewSavingsProducts');
        }
    };

    const renderTabContent = () => {
        if (activeTab === 'viewSavingsProducts') {
            return <ViewSavingsProducts onRowClick={handleOpenSavingsProductDetails} />;
        } else if (activeTab === 'createSavingsProducts') {
            return <CreateSavingsProducts
                onSuccess={handleOpenSavingsProductDetails}
                productToEdit={selectedProduct}
            />;
        } else {
            const activeDynamicTab = dynamicTabs.find((tab) => tab.id === activeTab);
            return activeDynamicTab ? activeDynamicTab.component : null;
        }
    };

    return (
        <div className="tab-products-page neighbor-element">
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
                    className={`tab-button ${activeTab === 'createSavingsProducts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createSavingsProducts')}
                >
                    Create Savings Product
                </button>
            </div>

            <div className="users-tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default SavingsProducts;
