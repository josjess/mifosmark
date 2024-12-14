import React, { useContext, useEffect, useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { useLoading } from '../context/LoadingContext';
import {FaUser, FaExclamationTriangle, FaChartLine, FaBalanceScale, FaHandHoldingUsd, FaMoneyCheckAlt, FaUsers, FaUserPlus} from 'react-icons/fa';
import './Dashboard.css';
import {API_CONFIG} from "../config";
import Sidebar from "./Navigation/Sidebar";

const Dashboard = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();
    const [dashboardData, setDashboardData] = useState({
        totalClients: 0, activeClients: 0, inactiveClients: 0, newClients: 0,
        principalOutstanding: 0, interestOutstanding: 0, totalOutstanding: 0, interestThisMonth: 0,
        principalOverdue: 0, interestOverdue: 0, totalOverdue: 0, nonPerformingAssets: 0,
        loansForApproval: 0, loansForDisapproval: 0,
    });

    useEffect(() => {
        if (!isAuthenticated) {
            showNotification('Kindly Login to access our services!', 'error');
            navigate('/login');
        }
    }, [isAuthenticated, navigate, showNotification]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    useEffect(() => {
        let isMounted = true;

        if (user) {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;
            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            const fetchClientData = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/clients`, { headers });
                    const data = await response.json();

                    const activeClients = data.pageItems.filter(client => client.active === true).length;
                    const inactiveClients = data.pageItems.filter(client => client.active === false).length;
                    const newClients = data.pageItems.filter(client => client.status.value === "Pending").length;

                    return {
                        totalClients: data.totalFilteredRecords,
                        activeClients,
                        inactiveClients,
                        newClients
                    };
                } catch (error) {
                    console.log("Error fetching client data:", error);
                    throw error;
                }
            };

            const fetchLoanData = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/loans`, { headers });
                    const data = await response.json();
                    const loans = data.pageItems;

                    let totalPrincipalOutstanding = 0;
                    let totalInterestOutstanding = 0;
                    let totalPrincipalOverdue = 0;
                    let totalInterestOverdue = 0;
                    let totalInterestThisMonth = 0;
                    let totalOverdue = 0;
                    let nonPerformingAssets = 0;
                    let loansForApproval = 0;
                    let loansForDisapproval = 0;

                    loans.forEach(loan => {
                        const summary = loan.summary || {};
                        totalPrincipalOutstanding += summary.principalOutstanding || 0;
                        totalInterestOutstanding += summary.interestOutstanding || 0;
                        totalPrincipalOverdue += summary.principalOverdue || 0;
                        totalInterestOverdue += summary.interestOverdue || 0;
                        totalInterestThisMonth += summary.interestCharged || 0;
                        totalOverdue = totalPrincipalOverdue + totalInterestOverdue;

                        if (loan.status.value === "Non-Performing") nonPerformingAssets++;
                        if (loan.status.pendingApproval) loansForApproval++;
                        if (loan.status.value === "Rejected") loansForDisapproval++;
                    });

                    return {
                        principalOutstanding: formatCurrency(totalPrincipalOutstanding),
                        interestOutstanding: formatCurrency(totalInterestOutstanding),
                        totalOutstanding: formatCurrency(totalPrincipalOutstanding + totalInterestOutstanding),
                        interestThisMonth: formatCurrency(totalInterestThisMonth),
                        principalOverdue: formatCurrency(totalPrincipalOverdue),
                        interestOverdue: formatCurrency(totalInterestOverdue),
                        totalOverdue: formatCurrency(totalOverdue),
                        nonPerformingAssets,
                        loansForApproval,
                        loansForDisapproval
                    };
                } catch (error) {
                    console.log("Error fetching loan data:", error);
                    throw error;
                }
            };

            const fetchData = async () => {
                startLoading();
                try {
                    const [clientData, loanData] = await Promise.all([fetchClientData(), fetchLoanData()]);
                    if (isMounted) {
                        setDashboardData(prev => ({
                            ...prev,
                            ...clientData,
                            ...loanData,
                        }));
                    }
                } catch (error) {
                    console.log("Error fetching data:", error);
                } finally {
                    if (isMounted) {
                        stopLoading();
                    }
                }
            };

            fetchData();

            return () => {
                isMounted = false;
            };
        }
        // eslint-disable-next-line
    }, [user]);


    const {
        totalClients, activeClients, inactiveClients, newClients,
        principalOutstanding, interestOutstanding, totalOutstanding, interestThisMonth,
        principalOverdue, interestOverdue, totalOverdue, nonPerformingAssets, loansForApproval, loansForDisapproval
    } = dashboardData;



    return (
        <div className="dashboard-layout">
            <div>
                <Sidebar />
            </div>

            <main className="main-content">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="title-section">
                            <h1>Dashboard</h1>
                            <p>Key metrics and insights</p>
                        </div>
                        <div className="top-right-buttons">
                            <button className="action-button" onClick={() => navigate('/manage-roles-permissions')}>
                                <FaUsers className="button-icon"/> Manage Users & Roles
                            </button>
                            <button className="action-button" onClick={() => navigate('/clients')}>
                                <FaUserPlus className="button-icon"/> Onboard a New Client
                            </button>
                        </div>
                    </div>
                </header>

                <section className="card-grid">
                    <div className="card">
                        <div className="card-header">
                            <div className="icon-container">
                                <FaUser className="card-icon"/>
                            </div>
                            <h3>Total Clients</h3>
                        </div>
                        <p>{totalClients}</p>
                    </div>
                    <div className="card" onClick={() => navigate('/clients')}>
                        <div className="card-header">
                            <div className="icon-container">
                                <FaUser className="card-icon"/>
                            </div>
                            <h3>Active Clients</h3>
                        </div>
                        <p>{activeClients}</p>
                    </div>
                    <div className="card" onClick={() => navigate('/clients')}>
                        <div className="card-header">
                            <div className="icon-container">
                                <FaUser className="card-icon"/>
                            </div>
                            <h3>Inactive Clients</h3>
                        </div>
                        <p>{inactiveClients}</p>
                    </div>
                    <div className="card" onClick={() => navigate('/clients')}>
                        <div className="card-header">
                            <div className="icon-container">
                                <FaUser className="card-icon"/>
                            </div>
                            <h3>Pending Clients</h3>
                        </div>
                        <p>{newClients}</p>
                    </div>
                    <div className="card" >
                        <div className="card-header">
                            <div className="icon-container">
                                <FaMoneyCheckAlt className="card-icon"/>
                            </div>
                            <h3>Principal Outstanding</h3>
                        </div>
                        <p>{principalOutstanding}</p>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <div className="icon-container">
                                <FaHandHoldingUsd className="card-icon"/>
                            </div>
                            <h3>Interest Outstanding</h3>
                        </div>
                        <p>{interestOutstanding}</p>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <div className="icon-container">
                                <FaBalanceScale className="card-icon"/>
                            </div>
                            <h3>Total Outstanding</h3>
                        </div>
                        <p>{totalOutstanding}</p>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <div className="icon-container">
                                <FaChartLine className="card-icon"/>
                            </div>
                            <h3>Interest This Month</h3>
                        </div>
                        <p>{interestThisMonth}</p>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <div className="icon-container">
                                <FaExclamationTriangle className="card-icon"/>
                            </div>
                            <h3>Principal Overdue</h3>
                        </div>
                        <p>{principalOverdue}</p>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <div className="icon-container">
                                <FaExclamationTriangle className="card-icon"/>
                            </div>
                            <h3>Interest Overdue</h3>
                        </div>
                        <p>{interestOverdue}</p>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <div className="icon-container">
                                <FaBalanceScale className="card-icon"/>
                            </div>
                            <h3>Total Overdue</h3>
                        </div>
                        <p>{totalOverdue}</p>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <div className="icon-container">
                                <FaExclamationTriangle className="card-icon"/>
                            </div>
                            <h3>Non-Performing Assets</h3>
                        </div>
                        <p>{nonPerformingAssets}</p>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <div className="icon-container">
                                <FaBalanceScale className="card-icon"/>
                            </div>
                            <h3>Loans for Approval</h3>
                        </div>
                        <p>{loansForApproval}</p>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <div className="icon-container">
                                <FaBalanceScale className="card-icon"/>
                            </div>
                            <h3>Loans for Disapproval</h3>
                        </div>
                        <p>{loansForDisapproval}</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
