import React, { useState } from 'react';
import ViewTemplates from './ViewTemplates';
import CreateTemplateForm from './CreateTemplate';
import { Link } from 'react-router-dom';
import './Templates.css';

const TemplatesPage = () => {
    const [activeTab, setActiveTab] = useState('viewTemplates');

    return (
        <div className="templates-page-screen">
            <h2 className="templates-page-head">
                <Link to="/admin" className="breadcrumb-link">Admin</Link> . Templates
            </h2>

            <div className="templates-tab-container">
                <button
                    className={`templates-tab-button ${activeTab === 'viewTemplates' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewTemplates')}
                >
                    View Templates
                </button>
                <button
                    className={`templates-tab-button ${activeTab === 'createTemplate' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createTemplate')}
                >
                    Create Template
                </button>
            </div>

            <div className="templates-tab-content">
                {activeTab === 'viewTemplates' ? <ViewTemplates /> : <CreateTemplateForm />}
            </div>
        </div>
    );
};

export default TemplatesPage;
