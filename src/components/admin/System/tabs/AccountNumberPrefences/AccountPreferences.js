import React, { useState } from 'react';
import ViewAccountPreferences from './ViewAccountPreferences';
import CreateAccountPreference from './CreateAccountPreferences';
import './AccountPreferences.css';
import { Link } from 'react-router-dom';

const AccountNumberPreferences = () => {
    const [activeTab, setActiveTab] = useState('viewPreferences');

    return (
        <div className="account-number-preferences-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/system" className="breadcrumb-link">System</Link> . Account Number Preferences
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewPreferences' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewPreferences')}
                >
                    View Preferences
                </button>
                <button
                    className={`tab-button ${activeTab === 'addPreference' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addPreference')}
                >
                    Add Preference
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewPreferences' ? (
                    <ViewAccountPreferences />
                ) : (
                    <CreateAccountPreference />
                )}
            </div>
        </div>
    );
};

export default AccountNumberPreferences;
