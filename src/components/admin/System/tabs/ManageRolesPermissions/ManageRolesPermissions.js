import React, { useState } from 'react';
import ViewRolesTable from './ViewRoles';
import RoleForm from './RolesForm';
import './ManageRolesPermissions.css';
import { Link } from 'react-router-dom';

const ManageRolesPermissions = () => {
    const [activeTab, setActiveTab] = useState('viewRoles');
    const [rolesRefresh, setRolesRefresh] = useState(false);

    const refreshRoles = () => {
        setRolesRefresh((prev) => !prev);
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
                <button
                    className={`tab-button ${activeTab === 'addRole' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addRole')}
                >
                    Add Role
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewRoles' ? (
                    <ViewRolesTable refreshTrigger={rolesRefresh} />
                ) : (
                    <RoleForm setActiveTab={setActiveTab} onRolesUpdate={refreshRoles} />
                )}
            </div>
        </div>
    );
};

export default ManageRolesPermissions;
