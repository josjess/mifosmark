import React, { useState } from 'react';
import FinancialActivityMappingsTable from './ViewFinancialActivityMappings';
import AddFinancialActivityMappingForm from './AddFinancialActivityMapping';
import './FinancialActivityMappings.css';
import { Link } from 'react-router-dom';

const FinancialActivityMappings = () => {
    const [activeTab, setActiveTab] = useState('table');

    return (
        <div className="financial-mappings-container">
            <h2 className="financial-mappings-head">
                <Link to="/accounting" className="breadcrumb-link">Accounting .</Link> <span> Financial Activity Mappings</span>
            </h2>
            <div className="financial-tab-container">
                <button
                    className={`financial-tab-button ${activeTab === 'table' ? 'active' : ''}`}
                    onClick={() => setActiveTab('table')}
                >
                    Financial Activity Mappings
                </button>
                <button
                    className={`financial-tab-button ${activeTab === 'form' ? 'active' : ''}`}
                    onClick={() => setActiveTab('form')}
                >
                    Add New Mapping
                </button>
            </div>
            <div className="financial-tab-content">
                {activeTab === 'table' ? <FinancialActivityMappingsTable /> : <AddFinancialActivityMappingForm />}
            </div>
        </div>
    );
};

export default FinancialActivityMappings;
