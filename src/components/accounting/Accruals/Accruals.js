import React from 'react';
import AccrualForm from './AccrualForm';
import { Link } from 'react-router-dom';
import './Accruals.css';

const AccrualsPage = () => {
    return (
        <div className="accruals-screen neighbor-element">
            <h2 className="accruals-head">
                <Link to="/accounting" className="breadcrumb-link">Accounting </Link> . Periodic Accruals
            </h2>
            <div className="accruals-tab-content">
                <AccrualForm />
            </div>
        </div>
    );
};

export default AccrualsPage;
