import React, { useState } from 'react';
import ViewHolidays from './ViewHolidays';
import CreateHoliday from './CreateHoliday';
import { Link } from 'react-router-dom';

const ManageHolidays = () => {
    const [activeTab, setActiveTab] = useState('viewHolidays');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Manage Holidays
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewHolidays' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewHolidays')}
                >
                    View Holidays
                </button>
                <button
                    className={`tab-button ${activeTab === 'createHoliday' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createHoliday')}
                >
                    Create Holiday
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewHolidays' && <ViewHolidays />}
                {activeTab === 'createHoliday' && <CreateHoliday />}
            </div>
        </div>
    );
};

export default ManageHolidays;
