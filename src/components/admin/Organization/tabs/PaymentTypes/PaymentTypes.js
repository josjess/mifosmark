import React, { useState } from 'react';
import ViewPaymentTypes from './ViewPaymentTypes';
import CreatePaymentType from './CreatePaymentType';
import { Link } from 'react-router-dom';

const PaymentTypes = () => {
    const [activeTab, setActiveTab] = useState('viewPaymentTypes');

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/organization" className="breadcrumb-link">Organization</Link> . Payment Types
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === 'viewPaymentTypes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewPaymentTypes')}
                >
                    View Payment Types
                </button>
                <button
                    className={`tab-button ${activeTab === 'createPaymentType' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createPaymentType')}
                >
                    Create Payment Type
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'viewPaymentTypes' && <ViewPaymentTypes />}
                {activeTab === 'createPaymentType' && <CreatePaymentType />}
            </div>
        </div>
    );
};

export default PaymentTypes;
