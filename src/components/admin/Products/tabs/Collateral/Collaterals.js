import React, { useState } from 'react';
import ViewCollaterals from './ViewCollaterals';
import CreateCollaterals from './CreateCollaterals';
import CollateralDetails from './CollateralDetails';
import { Link } from 'react-router-dom';

const Collaterals = () => {
    const [activeTab, setActiveTab] = useState('viewCollaterals');
    const [dynamicTabs, setDynamicTabs] = useState([]);

    const handleOpenCollateralDetails = (collateral) => {
        const tabId = `CollateralDetail-${collateral.id}`;
        const tabLabel = collateral.name;

        setDynamicTabs([
            {
                id: tabId,
                label: tabLabel,
                component: (
                    <CollateralDetails
                        collateralId={collateral.id}
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
            setActiveTab('viewCollaterals');
        }
    };

    const renderTabContent = () => {
        if (activeTab === 'viewCollaterals') {
            return <ViewCollaterals onRowClick={handleOpenCollateralDetails} />;
        } else if (activeTab === 'createCollaterals') {
            return <CreateCollaterals />;
        } else {
            const activeDynamicTab = dynamicTabs.find((tab) => tab.id === activeTab);
            return activeDynamicTab ? activeDynamicTab.component : null;
        }
    };

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
                    className={`tab-button ${activeTab === 'createCollaterals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createCollaterals')}
                >
                    Create Collateral
                </button>
            </div>

            <div className="users-tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default Collaterals;
