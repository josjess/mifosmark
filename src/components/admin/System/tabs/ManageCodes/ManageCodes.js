import React, {useEffect, useState} from 'react';
import CodeTableView from './ViewCodesTable';
import CodeForm from './CodeForm';
import CodeDetail from './CodeDetail';
import './ManageCodes.css';
import {Link, useLocation} from 'react-router-dom';

const ManageCodes = () => {
    const [activeTab, setActiveTab] = useState('viewCodes');
    const [dynamicTabs, setDynamicTabs] = useState([]);
    const location = useLocation();

    useEffect(() => {
        if (activeTab !== 'viewCodes' && !location.pathname.includes('manage-codes')) {
            setDynamicTabs([]);
            setActiveTab('viewCodes');
        }
    }, [location, activeTab]);

    const formatCodeName = (name) => {
        return name
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/_/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase()
            .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
    };

    const handleOpenCodeDetail = (code) => {
        const tabId = `codeDetail-${code.id}`;
        const formattedName = formatCodeName(code.name);
        setDynamicTabs([{ id: tabId, label: formattedName, component: <CodeDetail code={code} /> }]);
        setActiveTab(tabId);
    };

    const handleCloseTab = (tabId) => {
        setDynamicTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
        setActiveTab('viewCodes');
    };

    const renderTabContent = () => {
        if (activeTab === 'viewCodes') return <CodeTableView onRowClick={handleOpenCodeDetail} />;
        if (activeTab === 'addCode') return <CodeForm />;
        const activeDynamicTab = dynamicTabs.find((tab) => tab.id === activeTab);
        return activeDynamicTab ? activeDynamicTab.component : null;
    };

    return (
        <div className="manage-codes-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/system" className="breadcrumb-link">
                    System
                </Link>
                . Manage Codes
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewCodes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewCodes')}
                >
                    View Codes
                </button>
                <button
                    className={`tab-button ${activeTab === 'addCode' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addCode')}
                >
                    Add Code
                </button>
                {dynamicTabs.map((tab) => (
                    <div key={tab.id} className="dynamic-tab">
                        <button
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                        <button
                            className="close-dynamic-tab"
                            onClick={() => handleCloseTab(tab.id)}
                        >
                            close
                        </button>
                    </div>
                ))}
            </div>
            <div className="tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default ManageCodes;
