import React, { useState } from 'react';
import SchedulerJobs from './SchedulerJobs';
import WorkflowJobs from './WorkflowJobs';
import COB from './COB';
import './ManageSchedulerJobs.css';
import { Link } from 'react-router-dom';

const ManageSchedulerJobs = () => {
    const [activeTab, setActiveTab] = useState('schedulerJobs');

    return (
        <div className="manage-scheduler-jobs-page">
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
            <div className="tab-content">
                {activeTab === 'schedulerJobs' && <SchedulerJobs />}
                {activeTab === 'workflowJobs' && <WorkflowJobs />}
                {activeTab === 'cob' && <COB />}
            </div>
        </div>
    );
};

export default ManageSchedulerJobs;
