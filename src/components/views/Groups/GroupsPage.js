import React, {useEffect, useState} from 'react';
import Groups from './Groups';
import AddGroupForm from './AddGroup';
import GroupDetails from './GroupDetails';
import {Link, useLocation, useNavigate} from 'react-router-dom';

const GroupsPage = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('viewGroups');
    const [dynamicTabs, setDynamicTabs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.openGroupDetails) {
            const group = location.state.openGroupDetails;
            handleOpenGroupDetails(group);

            navigate(location.pathname, { replace: true });
        }
    }, [location]);

    useEffect(() => {
        const state = location.state;

        if (state?.groupId) {
            const tabId = `groupDetail-${state.groupId}`;
            const tabLabel = state.groupName || `Group #${state.groupId}`;

            setDynamicTabs((prevTabs) => {
                const existingTab = prevTabs.find((tab) => tab.id === tabId);
                if (existingTab) {
                    if (existingTab.label !== tabLabel) {
                        return prevTabs.map((tab) =>
                            tab.id === tabId ? { ...tab, label: tabLabel } : tab
                        );
                    }
                    return prevTabs;
                }
                return [
                    ...prevTabs,
                    {
                        id: tabId,
                        label: tabLabel,
                        component: (
                            <GroupDetails
                                groupId={state.groupId}
                                onClose={() => handleCloseTab(tabId)}
                            />
                        ),
                    },
                ];
            });

            setActiveTab(tabId);
        }
    }, [location.state]);

    const handleOpenGroupDetails = (group) => {
        const tabId = `groupDetail-${group.id}`;
        const tabLabel = group.name;

        setDynamicTabs([
            {
                id: tabId,
                label: tabLabel,
                component: (
                    <GroupDetails
                        groupId={group.id}
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
            setActiveTab('viewGroups');
        }
    };

    const renderTabContent = () => {
        if (activeTab === 'viewGroups') {
            return <Groups onRowClick={handleOpenGroupDetails} />;
        } else if (activeTab === 'addGroup') {
            return <AddGroupForm />;
        } else if (activeTab === 'importGroups') {
            navigate('/bulk-imports/groups');
            return null;
        } else {
            const activeDynamicTab = dynamicTabs.find((tab) => tab.id === activeTab);
            return activeDynamicTab ? activeDynamicTab.component : null;
        }
    };

    return (
        <div className="neighbor-element users-page-screen">
            <h2 className="users-page-head">
                <Link to="/dashboard" className="breadcrumb-link">Dashboard </Link> . Groups
            </h2>

            <div className="users-tab-container">
                <button
                    className={`users-tab-button ${activeTab === 'viewGroups' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewGroups')}
                >
                    View Groups
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
                    className={`users-tab-button ${activeTab === 'addGroup' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addGroup')}
                >
                    Add Group
                </button>
                <button
                    className={`users-tab-button ${activeTab === 'importGroups' ? 'active' : ''}`}
                    onClick={() => setActiveTab('importGroups')}
                >
                    Import Groups
                </button>
            </div>

            <div className="users-tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default GroupsPage;
