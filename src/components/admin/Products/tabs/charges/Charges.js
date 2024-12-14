import React, { useState } from 'react';
import ViewCharges from './ViewCharges';
import CreateCharges from './CreateCharges';
import ChargeDetails from './ChargeDetails'
import { Link } from 'react-router-dom';

const Charges = () => {
    const [activeTab, setActiveTab] = useState('viewCharges');
    const [dynamicTabs, setDynamicTabs] = useState([]);

    const handleOpenChargeDetails = (charge) => {
        const tabId = `ChargeDetail-${charge.id}`;
        const tabLabel = charge.name;

        setDynamicTabs([
            {
                id: tabId,
                label: tabLabel,
                component: (
                    <ChargeDetails
                        chargeId={charge.id}
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
            setActiveTab('viewCharges');
        }
    };

    const renderTabContent = () => {
        if (activeTab === 'viewCharges') {
            return <ViewCharges onRowClick={handleOpenChargeDetails} />;
        } else if (activeTab === 'createCharges') {
            return <CreateCharges />;
        } else {
            const activeDynamicTab = dynamicTabs.find((tab) => tab.id === activeTab);
            return activeDynamicTab ? activeDynamicTab.component : null;
        }
    };

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
                    className={`tab-button ${activeTab === 'createCharges' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createCharges')}
                >
                    Create Charge
                </button>
            </div>

            <div className="users-tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default Charges;
