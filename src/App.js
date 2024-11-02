import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import { loadConfig } from './config';
// import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Clients from './components/views/Clients';
import Groups from './components/views/Groups';
import Centers from './components/views/Centers';
import Accounting from './components/views/Accounting';
import Reports from './components/views/Reports';
import Admin from './components/views/Admin';
import AddClient from "./components/views/AddClient";
import AddGroup from "./components/views/AddGroup";
import AddCenter from "./components/views/AddCenter";
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoadingProvider } from './context/LoadingContext';
import Notification from './components/Notification';
import './App.css';
import Navbar from "./components/Navbar";
import LoadingOverlay from "./components/LoadingOverlay";
import Sidebar from "./components/Sidebar";
import ProtectedLayout from './ProtectedLayout';

/* Accounting */
import FrequentPosting from "./components/accounting/FrequentPosting";
// import AddJournalEntries from "./components/accounting/AddJournalEntries";
import SearchJournalEntries from "./components/accounting/SearchJournalEntries";
import FinancialActivityMappings from "./components/accounting/FinancialActivityMappings";
import JournalEntries from "./components/accounting/JournalEntries"
import ClosingEntries from "./components/accounting/ClosingEntries";
import ChartofAccounts from "./components/accounting/ChartofAccounts";
import AccountingTabs from "./components/accounting/AccountingRules";
import Accruals from "./components/accounting/Accruals";
import ProvisioningEntries from "./components/accounting/ProvisioningEntries";

/* Admin */
import Users from "./components/admin/Users/Users";
import Organization from "./components/admin/Organization/Organization";
import Products from "./components/admin/Products/Products"
import System from "./components/admin/System/System";

const App = () => {
    useEffect(() => {
        loadConfig().then();
    }, []);

    const location = useLocation();

    const isLoginPage = location.pathname === '/login';

    return (
        <AuthProvider>
            <LoadingProvider>
                <NotificationProvider>
                    <LoadingOverlay />
                    <Notification />
                    {!isLoginPage && <Navbar />}
                    {!isLoginPage && <Sidebar className="sidebar" />}
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route element={<ProtectedLayout />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/clients" element={<Clients />} />
                            <Route path="/groups" element={<Groups />} />
                            <Route path="/centers" element={<Centers />} />
                            <Route path="/accounting" element={<Accounting />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/addclient" element={<AddClient />} />
                            <Route path="/addgroup" element={<AddGroup />} />
                            <Route path="/addcenter" element={<AddCenter />} />

                            {/* Accounting */}
                            <Route path="/frequent-postings" element={<FrequentPosting />} />
                            <Route path="/journal-entries" element={<JournalEntries />} />
                            <Route path="/search-journal-entries" element={<SearchJournalEntries />} />
                            <Route path="/financial-activity-mappings" element={<FinancialActivityMappings />} />
                            <Route path="/closing-entries" element={<ClosingEntries />} />
                            <Route path="/chart-of-accounts" element={<ChartofAccounts />} />
                            <Route path="/accounting-rules" element={<AccountingTabs />} />
                            <Route path="/accruals" element={<Accruals />} />
                            <Route path="/provisioning-entries" element={<ProvisioningEntries />} />

                            {/* Admin */}
                            <Route path="/users" element={<Users />} />
                            <Route path="/organization" element={<Organization />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/system" element={<System />} />

                        </Route>
                    </Routes>
                </NotificationProvider>
            </LoadingProvider>
        </AuthProvider>
    );
};

const AppWrapper = () => {
    return (
        <Router>
            <App />
        </Router>
    );
};

export default AppWrapper;
