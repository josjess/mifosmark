import React, { useContext, useEffect, useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { useLoading } from '../context/LoadingContext';
import {FaUser, FaExclamationTriangle, FaChartLine, FaBalanceScale, FaHandHoldingUsd, FaMoneyCheckAlt, FaUsers, FaUserPlus} from 'react-icons/fa';
import './Dashboard.css';
import {API_CONFIG} from "../config";
import Sidebar from "./Navigation/Sidebar";
import axios from "axios";
import Insights from "../components/Insights";

const Dashboard = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading();
    const [dashboardData, setDashboardData] = useState({
        totalClients: 0, activeClients: 0, inactiveClients: 0, newClients: 0,
        principalOutstanding: 0, interestOutstanding: 0, totalOutstanding: 0, interestThisMonth: 0,
        principalOverdue: 0, interestOverdue: 0, totalOverdue: 0, nonPerformingAssets: 0,
        loansForApproval: 0, loansForDisapproval: 0, portfolioAtRisk: 0,
        borrowersPerLoanOfficer: 0, averageLoanDisbursed: 0, clientsPerPersonnel: 0,
    });
    const [selectedOffice, setSelectedOffice] = useState(user?.officeId || null);
    const [officeOptions, setOfficeOptions] = useState([]);
    const [activeTab, setActiveTab] = useState('metrics');

    useEffect(() => {
        if (!isAuthenticated) {
            showNotification('Kindly Login to access our services!', 'error');
            navigate('/login');
        }
    }, [isAuthenticated, navigate, showNotification]);

    useEffect(() => {
        const fetchOffices = async () => {
            startLoading();
            try {
                const API_BASE_URL = API_CONFIG.baseURL;
                const AUTH_TOKEN = user.base64EncodedAuthenticationKey;
                const headers = {
                    'Authorization': `Basic ${AUTH_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Fineract-Platform-TenantId': 'default',
                };

                const response = await axios.get(`${API_BASE_URL}/offices`, { headers });
                const offices = response.data || [];
                setOfficeOptions(offices);

                if (user.officeId === 1) {
                    setSelectedOffice("all");
                }
            } catch (error) {
                console.error("Error fetching offices:", error);
            } finally {
                stopLoading();
            }
        };

        if (user?.officeId === 1) {
            fetchOffices();
        }
    }, [user]);

    const formatCurrency = (value, currencyCode, currencySymbol, decimalPlaces) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: decimalPlaces
        }).format(value).replace(currencyCode, currencySymbol);
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
                    const officeFilter = selectedOffice && selectedOffice !== "all" ? `&officeId=${selectedOffice}` : "";
                    const response = await axios.get(`${API_BASE_URL}/clients?${officeFilter}`, { headers });
                    const clients = response.data.pageItems;

                    const filteredClients =
                        selectedOffice && selectedOffice !== "all"
                            ? clients.filter(client => client.officeId === parseInt(selectedOffice))
                            : clients;

                    const activeClients = filteredClients.filter(client => client.status.value === "Active").length;
                    const inactiveClients = filteredClients.filter(client => client.status.value === "Inactive").length;
                    const newClients = filteredClients.filter(client => client.status.value === "Pending").length;

                    const borrowersPerLoanOfficer =
                        officeOptions.length > 0
                            ? Math.round(activeClients / officeOptions.length)
                            : 'N/A';

                    const clientsPerPersonnel =
                        officeOptions.length > 0
                            ? Math.round(filteredClients.length / officeOptions.length)
                            : 'N/A';

                    return {
                        totalClients: filteredClients.length,
                        activeClients,
                        inactiveClients,
                        newClients,
                        borrowersPerLoanOfficer,
                        clientsPerPersonnel,
                    };
                } catch (error) {
                    console.error("Error fetching client data:", error);
                    throw error;
                }
            };

            const fetchLoanData = async () => {
                try {
                    const officeFilter = selectedOffice && selectedOffice !== "all" ? `&officeId=${selectedOffice}` : "";
                    const response = await axios.get(`${API_BASE_URL}/loans?${officeFilter}`, { headers });
                    const loans = response.data.pageItems;

                    const filteredLoans =
                        selectedOffice && selectedOffice !== "all"
                            ? loans.filter(loan => loan.clientOfficeId === parseInt(selectedOffice))
                            : loans;

                    const currency = loans[0].currency || {};
                    const { code: currencyCode, displaySymbol: currencySymbol, decimalPlaces } = currency;

                    let portfolioAtRiskAmount = 0;
                    let totalDisbursedAmount = 0;
                    let disbursedLoansCount = 0;

                    let totalPrincipalOutstanding = 0;
                    let totalInterestOutstanding = 0;
                    let totalPrincipalOverdue = 0;
                    let totalInterestOverdue = 0;
                    let totalInterestThisMonth = 0;
                    let totalOverdue = 0;
                    let nonPerformingAssets = 0;
                    let loansForApproval = 0;
                    let loansForDisapproval = 0;

                    filteredLoans.forEach(loan => {
                        const summary = loan.summary || {};
                        totalPrincipalOutstanding += summary.principalOutstanding || 0;
                        totalInterestOutstanding += summary.interestOutstanding || 0;
                        totalPrincipalOverdue += summary.principalOverdue || 0;
                        totalInterestOverdue += summary.interestOverdue || 0;
                        totalInterestThisMonth += summary.interestCharged || 0;
                        totalOverdue += summary.principalOverdue || 0 + summary.interestOverdue || 0;

                        if (loan.isNPA) nonPerformingAssets++;
                        if (loan.status.pendingApproval) loansForApproval++;
                        if (loan.status.value === "Rejected") loansForDisapproval++;

                        if (loan.isNPA) {
                            portfolioAtRiskAmount += summary.principalOutstanding || 0;
                        }

                        totalDisbursedAmount += loan.principal || 0;
                        disbursedLoansCount++;
                    });

                    const portfolioAtRisk =
                        totalPrincipalOutstanding > 0
                            ? ((portfolioAtRiskAmount / totalPrincipalOutstanding) * 100).toFixed(2) + '%'
                            : '';

                    const averageLoanDisbursed =
                        disbursedLoansCount > 0
                            ? formatCurrency(totalDisbursedAmount / disbursedLoansCount, currencyCode, currencySymbol, decimalPlaces)
                            : formatCurrency(0, currencyCode, currencySymbol, decimalPlaces);

                    return {
                        principalOutstanding: formatCurrency(totalPrincipalOutstanding, currencyCode, currencySymbol, decimalPlaces),
                        interestOutstanding: formatCurrency(totalInterestOutstanding, currencyCode, currencySymbol, decimalPlaces),
                        totalOutstanding: formatCurrency(totalPrincipalOutstanding + totalInterestOutstanding, currencyCode, currencySymbol, decimalPlaces),
                        interestThisMonth: formatCurrency(totalInterestThisMonth, currencyCode, currencySymbol, decimalPlaces),
                        principalOverdue: formatCurrency(totalPrincipalOverdue, currencyCode, currencySymbol, decimalPlaces),
                        interestOverdue: formatCurrency(totalInterestOverdue, currencyCode, currencySymbol, decimalPlaces),
                        totalOverdue: formatCurrency(totalOverdue, currencyCode, currencySymbol, decimalPlaces),
                        nonPerformingAssets,
                        loansForApproval,
                        loansForDisapproval,
                        portfolioAtRisk,
                        averageLoanDisbursed,
                    };
                } catch (error) {
                    console.error("Error fetching loan data:", error);
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
                    console.error("Error fetching data:", error);
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
    }, [user, selectedOffice]);


    const {
        totalClients, activeClients, inactiveClients, newClients,
        principalOutstanding, interestOutstanding, totalOutstanding, interestThisMonth,
        principalOverdue, interestOverdue, totalOverdue, nonPerformingAssets, loansForApproval, loansForDisapproval,
        portfolioAtRisk, borrowersPerLoanOfficer, averageLoanDisbursed, clientsPerPersonnel
    } = dashboardData;

    return (
        <div className="dashboard-layout">
            <div>
                <Sidebar />
            </div>

            <main className="main-content">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1 className="dashboard-title">Dashboard</h1>
                        <div className="title-section">
                            <p>Key metrics and insights</p>
                            <div className="office-selector-row">
                                <select
                                    id="office-dropdown"
                                    value={selectedOffice}
                                    onChange={(e) => setSelectedOffice(e.target.value)}
                                    disabled={user?.officeId !== 1}
                                >
                                    {user?.officeId === 1 ? (
                                        <>
                                            <option value="all">All Offices</option>
                                            {officeOptions.map((office) => (
                                                <option key={office.id} value={office.id}>
                                                    {office.name}
                                                </option>
                                            ))}
                                        </>
                                    ) : (
                                        <option value={user?.officeId}>
                                            {officeOptions.find((office) => office.id === user?.officeId)?.name || "Current Office"}
                                        </option>
                                    )}
                                </select>
                            </div>
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
                <div className="dashboard-tabs">
                    <button
                        className={`tab-button ${activeTab === 'metrics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('metrics')}
                    >
                        Key Metrics
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
                        onClick={() => setActiveTab('insights')}
                    >
                        Insights
                    </button>
                </div>
                {activeTab === 'metrics' ? (
                    <section className="card-grid">
                        <div className="card">
                            <div className="card-header">
                                <div className="icon-container">
                                    <FaExclamationTriangle className="card-icon"/>
                                </div>
                                <h3>Portfolio at Risk</h3>
                            </div>
                            <p>{portfolioAtRisk}</p>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <div className="icon-container">
                                    <FaUsers className="card-icon"/>
                                </div>
                                <h3>Borrowers Per Loan Officer</h3>
                            </div>
                            <p>{borrowersPerLoanOfficer}</p>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <div className="icon-container">
                                    <FaHandHoldingUsd className="card-icon"/>
                                </div>
                                <h3>Average Loan Disbursed</h3>
                            </div>
                            <p>{averageLoanDisbursed}</p>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <div className="icon-container">
                                    <FaUser className="card-icon"/>
                                </div>
                                <h3>Clients Per Personnel</h3>
                            </div>
                            <p>{clientsPerPersonnel}</p>
                        </div>

                        <div className="card" onClick={() => navigate('/clients')}>
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
                        <div className="card">
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
                ) : (
                    <Insights selectedOffice={selectedOffice} officeOptions={officeOptions}/>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
