import React, { useState } from 'react';
import ViewUsers from './ViewUsers';
import CreateUserForm from './CreateUser';
import ViewUserDetails from './ViewUserDetails';
import './Users.css';
import { Link } from 'react-router-dom';

const UsersPage = () => {
    const [activeTab, setActiveTab] = useState('viewUsers');
    const [dynamicTabs, setDynamicTabs] = useState([]);

    const handleOpenUserDetails = (user) => {
        const tabId = `userDetail-${user.id}`;
        const tabLabel = `${user.firstname} ${user.lastname}`;
        setDynamicTabs([{ id: tabId, label: tabLabel, component: <ViewUserDetails selectedUser={user} onClose={handleCloseTab} /> }]);
        setActiveTab(tabId);
    };

    const handleCloseTab = (tabId) => {
        setDynamicTabs([]);
        setActiveTab('viewUsers');
    };

    const renderTabContent = () => {
        if (activeTab === 'viewUsers') {
            return <ViewUsers onRowClick={handleOpenUserDetails} />;
        } else if (activeTab === 'createUser') {
            return <CreateUserForm onUserCreated={handleOpenUserDetails}/>;
        } else {
            const activeDynamicTab = dynamicTabs.find((tab) => tab.id === activeTab);
            return activeDynamicTab ? activeDynamicTab.component : null;
        }
    };

    return (
        <div className="users-page-screen neighbor-element">
            <h2 className="users-page-head">
                <Link to="/admin" className="breadcrumb-link">Admin </Link> . Users
            </h2>

            <div className="users-tab-container">
                <button
                    className={`users-tab-button ${activeTab === 'viewUsers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewUsers')}
                >
                    View Users
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
                            close
                        </button>
                    </div>
                ))}
                <button
                    className={`users-tab-button ${activeTab === 'createUser' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createUser')}
                >
                    Create User
                </button>
            </div>

            <div className="users-tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default UsersPage;
