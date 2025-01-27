import React, { useState } from 'react';
import DataTableView from './ViewDataTables';
import DataTableForm from './DataTablesForm';
import DataTableDetail from './DataTableDetail';
import './ManageDataTables.css';
import { Link } from 'react-router-dom';

const ManageDataTables = () => {
    const [activeTab, setActiveTab] = useState('viewTables');
    const [dynamicTabs, setDynamicTabs] = useState([]);

    const handleOpenDataTableDetail = (table) => {
        const tabId = `dataTableDetail-${table.registeredTableName}`;
        const formattedLabel = `Associated With ${table.applicationTableName}`;
        if (!dynamicTabs.some((tab) => tab.id === tabId)) {
            setDynamicTabs((prevTabs) => [
                ...prevTabs,
                {
                    id: tabId,
                    label: formattedLabel,
                    component: <DataTableDetail dataTable={table} onCloseTab={handleCloseTab} tabId={tabId} />,
                },
            ]);
        }
        setActiveTab(tabId);
    };

    const handleCloseTab = (tabId) => {
        setDynamicTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
        setActiveTab('viewTables');
    };

    const renderTabContent = () => {
        if (activeTab === 'viewTables')
            return <DataTableView onRowClick={handleOpenDataTableDetail} />;
        if (activeTab === 'addTable') return <DataTableForm />;
        const activeDynamicTab = dynamicTabs.find((tab) => tab.id === activeTab);
        return activeDynamicTab ? activeDynamicTab.component : null;
    };

    return (
        <div className="manage-data-tables-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/system" className="breadcrumb-link">System </Link>. Manage Data Tables
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewTables' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewTables')}
                >
                    View Data Tables
                </button>
                <button
                    className={`tab-button ${activeTab === 'addTable' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addTable')}
                >
                    Create Data Table
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

export default ManageDataTables;
