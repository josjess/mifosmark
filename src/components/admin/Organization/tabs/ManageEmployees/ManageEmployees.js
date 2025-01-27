import React, { useState } from 'react';
import ViewEmployees from './ViewEmployees';
import CreateEmployee from './CreateEmployee';
import ImportEmployees from './ImportEmployees';
import {Link, useNavigate} from 'react-router-dom';

const ManageEmployees = () => {
    const [activeTab, setActiveTab] = useState('viewEmployees');
    const navigate = useNavigate();

    const handleFormSubmitSuccess = () => {
        setActiveTab('viewEmployees');
    };

    return (
        <div className="tab-products-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Manage Employees
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewEmployees' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewEmployees')}
                >
                    View Employees
                </button>
                <button
                    className={`tab-button ${activeTab === 'createEmployee' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createEmployee')}
                >
                    Create Employee
                </button>
                <button
                    className={`tab-button ${activeTab === 'importEmployees' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('importEmployees');
                        navigate(`/bulk-imports/employees`);
                    }}
                >
                    Import Offices
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewEmployees' && <ViewEmployees/>}
                {activeTab === 'createEmployee' && (
                    <CreateEmployee onFormSubmitSuccess={handleFormSubmitSuccess}/>
                )}
                {activeTab === 'importEmployees' && <ImportEmployees/>}
            </div>
        </div>
    );
};

export default ManageEmployees;
