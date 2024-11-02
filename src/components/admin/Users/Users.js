import React, { useState } from 'react';
import ViewUsers from './ViewUsers';
import CreateUserForm from './CreateUser';
import './Users.css';
import { Link } from 'react-router-dom';

const UsersPage = () => {
    const [activeTab, setActiveTab] = useState('viewUsers');

    return (
        <div className="users-page-screen">
            <h2 className="users-page-head">
                <Link to="/admin" className="breadcrumb-link">Admin </Link> . Users
            </h2>

            <div className="users-tab-container">
                <button
                    className={`users-tab-button ${activeTab === 'viewUsers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('viewUsers')}
                >
                    View Users
                </button>
                <button
                    className={`users-tab-button ${activeTab === 'createUser' ? 'active' : ''}`}
                    onClick={() => setActiveTab('createUser')}
                >
                    Create User
                </button>
            </div>

            <div className="users-tab-content">
                {activeTab === 'viewUsers' ? <ViewUsers /> : <CreateUserForm />}
            </div>
        </div>
    );
};

export default UsersPage;
