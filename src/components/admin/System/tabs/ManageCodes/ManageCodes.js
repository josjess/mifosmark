import React, { useState } from 'react';
import CodeTableView from './ViewCodesTable';
import CodeForm from './CodeForm';
import './ManageCodes.css';
import {Link} from "react-router-dom";

const ManageCodes = () => {
    const [activeTab, setActiveTab] = useState('viewCodes');

    return (
        <div className="manage-codes-page">
            <h2 className="page-heading">
                <Link to="/system" className="breadcrumb-link">System </Link>. Manage Codes
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewCodes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewCodes')}
                >
                    View Codes
                </button>
                <button
                    className={`tab-button ${activeTab === 'addCode' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addCode')}
                >
                    Add Code
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewCodes' ? <CodeTableView/> : <CodeForm/>}
            </div>
        </div>
    );
};

export default ManageCodes;
