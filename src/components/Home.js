import React from 'react';
import Sidebar from './Sidebar';
import './Home.css';

const Home = () => {
    return (
        <div className="home-layout">
            <div>
                <Sidebar />
            </div>

            <main className="main-content">
                <section className="banner">
                    <h1>Welcome to Our Platform!</h1>
                    <p>Explore our features and services, manage clients, loans, and much more.</p>
                </section>

                <section className="info-section">
                    <div className="info-card">
                        <h3>Manage Your Profile</h3>
                        <p>Keep your information up to date and secure.</p>
                    </div>
                    <div className="info-card">
                        <h3>Check Reports</h3>
                        <p>Generate detailed reports of your data with just a few clicks.</p>
                    </div>
                    <div className="info-card">
                        <h3>Loan Management</h3>
                        <p>Handle all client loans, repayments, and overdue tracking with ease.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;
