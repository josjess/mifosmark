import React, { useState } from 'react';
import SchedulerJobs from './SchedulerJobs';
import WorkflowJobs from './WorkflowJobs';
import COB from './COB';
import ViewJobDetails from './ViewJobDetails';
import './ManageSchedulerJobs.css';
import { Link } from 'react-router-dom';

const ManageSchedulerJobs = () => {
    const [activeTab, setActiveTab] = useState('schedulerJobs');
    const [dynamicTabs, setDynamicTabs] = useState([]);

    const handleOpenJobDetail = (job) => {
        const tabId = `jobDetail-${job.jobId}`;
        setDynamicTabs([
            {
                id: tabId,
                label: job.displayName,
                component: <ViewJobDetails job={job} />,
            },
        ]);
        setActiveTab(tabId);
    };

    const handleCloseTab = (tabId) => {
        setDynamicTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
        setActiveTab('schedulerJobs');
    };

    const renderTabContent = () => {
        if (activeTab === 'schedulerJobs') return <SchedulerJobs onRowClick={handleOpenJobDetail} />;
        if (activeTab === 'workflowJobs') return <WorkflowJobs />;
        if (activeTab === 'cob') return <COB />;
        const activeDynamicTab = dynamicTabs.find((tab) => tab.id === activeTab);
        return activeDynamicTab ? activeDynamicTab.component : null;
    };

    return (
        <div className="manage-scheduler-jobs-page neighbor-element">
            <div className="page-header-container">
                <h2 className="page-heading">
                    <Link to="/system" className="breadcrumb-link">System </Link>. Manage Scheduler and COB Jobs
                </h2>
            </div>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'schedulerJobs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schedulerJobs')}
                >
                    Scheduler Jobs
                </button>
                {dynamicTabs.map((tab) => (
                    <div key={tab.id} className="dynamic-tab">
                        <button
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                        <button className="close-dynamic-tab" onClick={() => handleCloseTab(tab.id)}>
                            Close
                        </button>
                    </div>
                ))}
                <button
                    className={`tab-button ${activeTab === 'workflowJobs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('workflowJobs')}
                >
                    Workflow Jobs
                </button>
                <button
                    className={`tab-button ${activeTab === 'cob' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cob')}
                >
                    COB
                </button>
            </div>
            <div className="tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default ManageSchedulerJobs;
