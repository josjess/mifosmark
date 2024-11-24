import React from 'react';
import { Link } from 'react-router-dom';
import '../FrequentPosting/FrequentPosting.css';

const SearchJournalEntries = () => {
    return (
        <div className="form-container-client">
            <h2>
                <Link to="/accounting" className="breadcrumb-link">Accounting</Link> / Search Journal Entries
            </h2>
            <div className="client-form">
                {/* Filters: Office, Account Name/Code, Date Range, Transaction ID */}
                {/* Display results in a paginated table */}
            </div>
        </div>
    );
};

export default SearchJournalEntries;
