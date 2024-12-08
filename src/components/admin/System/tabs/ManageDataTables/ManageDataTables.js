import React, { useState } from 'react';
import DataTableView from './ViewDataTables';
import DataTableForm from './DataTablesForm';
import './ManageDataTables.css';
import {Link} from "react-router-dom";

const ManageDataTables = () => {
    const [activeTab, setActiveTab] = useState('viewTables');
    const [newTableIdentifier, setNewTableIdentifier] = useState(null);

    const handleTabChange = (tab, data = {}) => {
        setActiveTab(tab);
        if (tab === 'viewTables' && data.resourceIdentifier) {
            setNewTableIdentifier(data.resourceIdentifier);
        }
    };

    return (
        <div className="manage-data-tables-page">
            <h2 className="page-heading">
                <Link to="/system" className="breadcrumb-link">System </Link>. Manage Data Tables
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewTables' ? 'active' : ''}`}
                    onClick={() => handleTabChange('viewTables')}
                >
                    View Data Tables
                </button>
                <button
                    className={`tab-button ${activeTab === 'addTable' ? 'active' : ''}`}
                    onClick={() => handleTabChange('addTable')}
                >
                    Create Data Table
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewTables' ? (
                    <DataTableView newTableIdentifier={newTableIdentifier} />
                ) : (
                    <DataTableForm setActiveTab={handleTabChange} />
                )}
            </div>
        </div>
    );
};

export default ManageDataTables;
