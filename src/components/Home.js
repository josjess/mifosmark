import React from 'react';
import {FaUsers, FaUserPlus, FaUserShield, FaChartBar} from 'react-icons/fa';
import './Home.css';
import {FaCalculator} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-layout">
            <div className="main-content-home">
                <div className="header-section">
                    <div className="company-info">
                        <h1 className="company-name">MIFOS</h1>
                        <p className="company-description">Empowering your financial future with our tools and
                            services</p>
                    </div>

                    <div className="top-right-buttons">
                        <button className="action-button">
                            <FaUsers className="button-icon"/> Manage Users & Roles
                        </button>
                        <button className="action-button">
                            <FaUserPlus className="button-icon"/> Onboard a New Client
                        </button>
                    </div>
                </div>

                <section className="card-section">
                    <div className="card-container short-cards">
                        <div className="card" onClick={() => navigate('/clients')}>
                            <h3>Clients</h3>
                        </div>
                        <div className="card" onClick={() => navigate('/groups')}>
                            <h3>Groups</h3>
                        </div>
                        <div className="card" onClick={() => navigate('/centers')}>
                            <h3>Centers</h3>
                        </div>
                    </div>

                    <div className="card-container tall-cards">
                        <div className="card" onClick={() => navigate('/accounting')}>
                            <div className="card-header">
                                <div className="icon-container">
                                    <FaCalculator className="home-icon"/>
                                </div>
                                <h3>Accounting</h3>
                            </div>
                            <p>Track financials and manage accounting processes.</p>
                        </div>
                        <div className="card" onClick={() => navigate('/admin')}>
                            <div className="card-header">
                                <div className="icon-container">
                                    <FaUserShield className="home-icon"/>
                                </div>
                                <h3>Administration</h3>
                            </div>
                            <p>Administer users, roles, and system configurations.</p>
                        </div>
                        <div className="card" onClick={() => navigate('/reports')}>
                            <div className="card-header">
                                <div className="icon-container">
                                    <FaChartBar className="home-icon"/>
                                </div>
                                <h3>Reports</h3>
                            </div>
                            <p>Generate reports and insights on your organization’s performance.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
