// components/accounting/FinancialActivityMappings.js
import React from 'react';
import { Link } from 'react-router-dom';
import './FrequentPosting.css';

const FinancialActivityMappings = () => {
    return (
        <div className="form-container-client">
            <h2>
                <Link to="/accounting" className="breadcrumb-link">Accounting</Link> / Financial Activity Mappings
            </h2>
            <div className="client-form">
                {/* Table structure with Financial Activity and Account Name columns */}
                {/* Button to define a new mapping */}
            </div>
        </div>
    );
};

export default FinancialActivityMappings;
