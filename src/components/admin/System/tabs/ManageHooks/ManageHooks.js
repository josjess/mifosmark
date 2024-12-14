import React, { useState } from 'react';
import ViewHooksTable from './ViewHooks';
import HookForm from './HookForm';
import './ManageHooks.css';
import { Link } from 'react-router-dom';

const ManageHooks = () => {
    const [activeTab, setActiveTab] = useState('viewHooks');

    return (
        <div className="manage-hooks-page">
            <h2 className="page-heading">
                <Link to="/system" className="breadcrumb-link">System </Link>. Manage Hooks
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewHooks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewHooks')}
                >
                    View Hooks
                </button>
                <button
                    className={`tab-button ${activeTab === 'createHook' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createHook')}
                >
                    Create Hook
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewHooks' ? <ViewHooksTable /> : <HookForm />}
            </div>
        </div>
    );
};

export default ManageHooks;
