import React, { useState } from 'react';
import Centers from './Centers';
import AddCenterForm from './AddCenter';
import CenterDetails from './CenterDetails';
import { Link, useNavigate } from 'react-router-dom';

const CentersPage = () => {
    const [activeTab, setActiveTab] = useState('viewCenters');
    const [dynamicTabs, setDynamicTabs] = useState([]);
    const navigate = useNavigate();

    const handleOpenCenterDetails = (center) => {
        const tabId = `centerDetail-${center.id}`;
        const tabLabel = center.name;

        setDynamicTabs([
            {
                id: tabId,
                label: tabLabel,
                component: (
                    <CenterDetails
                        centerId={center.id}
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
            setActiveTab('viewCenters');
        }
    };

    const renderTabContent = () => {
        if (activeTab === 'viewCenters') {
            return <Centers onRowClick={handleOpenCenterDetails} />;
        } else if (activeTab === 'addCenter') {
            return <AddCenterForm />;
        } else if (activeTab === 'importCenters') {
            navigate('/bulk-imports/centers');
            return null;
        } else {
            const activeDynamicTab = dynamicTabs.find((tab) => tab.id === activeTab);
            return activeDynamicTab ? activeDynamicTab.component : null;
        }
    };

    return (
        <div className="users-page-screen">
            <h2 className="users-page-head">
                <Link to="/dashboard" className="breadcrumb-link">Dashboard </Link> . Centers
            </h2>

            <div className="users-tab-container">
                <button
                    className={`users-tab-button ${activeTab === 'viewCenters' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewCenters')}
                >
                    View Centers
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
                    className={`users-tab-button ${activeTab === 'addCenter' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addCenter')}
                >
                    Add Center
                </button>
                <button
                    className={`users-tab-button ${activeTab === 'importCenters' ? 'active' : ''}`}
                    onClick={() => setActiveTab('importCenters')}
                >
                    Import Centers
                </button>
            </div>

            <div className="users-tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default CentersPage;