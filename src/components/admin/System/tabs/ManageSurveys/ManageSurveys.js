import React, { useState } from 'react';
import ViewSurveysTable from './ViewSurveys';
import SurveyForm from './SurveyForm';
import './ManageSurveys.css';
import { Link } from 'react-router-dom';

const ManageSurveys = () => {
    const [activeTab, setActiveTab] = useState('viewSurveys');

    return (
        <div className="manage-surveys-page">
            <h2 className="page-heading">
                <Link to="/system" className="breadcrumb-link">System </Link>. Manage Surveys
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewSurveys' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewSurveys')}
                >
                    View Surveys
                </button>
                <button
                    className={`tab-button ${activeTab === 'createSurvey' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createSurvey')}
                >
                    Create Survey
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewSurveys' ? <ViewSurveysTable /> : <SurveyForm />}
            </div>
        </div>
    );
};

export default ManageSurveys;
