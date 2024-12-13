import React, { useState } from 'react';
import ViewRolesTable from './ViewRoles';
import RoleForm from './RolesForm';
import RoleDetailTab from './RoleDetailTab';
import './ManageRolesPermissions.css';
import { Link } from 'react-router-dom';

const ManageRolesPermissions = () => {
    const [activeTab, setActiveTab] = useState('viewRoles');
    const [rolesRefresh, setRolesRefresh] = useState(false);
    const [dynamicTab, setDynamicTab] = useState(null); // Single dynamic tab state

    const refreshRoles = () => {
        setRolesRefresh((prev) => !prev);
    };

    const handleOpenDynamicTab = (role) => {
        const tabId = `roleDetail-${role.id}`;

        setDynamicTab({ id: tabId, label: role.name, component: <RoleDetailTab role={role} onClose={handleCloseDynamicTab}/> });
        setActiveTab(tabId);
    };

    const handleCloseDynamicTab = () => {
        setDynamicTab(null);
        setActiveTab('viewRoles');
    };

    const renderTabContent = () => {
        if (activeTab === 'viewRoles') {
            return <ViewRolesTable onRowClick={handleOpenDynamicTab} refreshTrigger={rolesRefresh} />;
        } else if (activeTab === 'addRole') {
            return <RoleForm setActiveTab={setActiveTab} onRolesUpdate={refreshRoles} />;
        } else if (dynamicTab && activeTab === dynamicTab.id) {
            return dynamicTab.component;
        }
        return null;
    };

    return (
        <div className="manage-roles-permissions-page">
            <h2 className="page-heading">
                <Link to="/system" className="breadcrumb-link">System </Link>. Manage Roles and Permissions
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewRoles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewRoles')}
                >
                    View Roles and Permissions
                </button>
                {dynamicTab && (
                    <div className="dynamic-tab">
                        <button
                            className={`tab-button ${activeTab === dynamicTab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(dynamicTab.id)}
                        >
                            {dynamicTab.label}
                        </button>
                        <button
                            className="close-dynamic-tab"
                            onClick={handleCloseDynamicTab}
                        >
                            close
                        </button>
                    </div>
                )}
                <button
                    className={`tab-button ${activeTab === 'addRole' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addRole')}
                >
                    Add Role
                </button>

            </div>
            <div className="tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default ManageRolesPermissions;
