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
import Templates from "./components/admin/Templates/Templates";

/* Admin-System */
import ManageDataTables from "./components/admin/System/tabs/ManageDataTables/ManageDataTables";
import ManageCodes from "./components/admin/System/tabs/ManageCodes/ManageCodes";
import ManageRolesPermissions from "./components/admin/System/tabs/ManageRolesPermissions/ManageRolesPermissions";
import ConfigureMakerChecker from "./components/admin/System/tabs/ConfigureMakerChecker/ConfigureMakerChecker";
import ManageHooks from "./components/admin/System/tabs/ManageHooks/ManageHooks";
import ManageSurveys from "./components/admin/System/tabs/ManageSurveys/ManageSurveys";
import ManageReports from "./components/admin/System/tabs/ManageReports/ManageReports";
import AccountPreferences from "./components/admin/System/tabs/AccountNumberPrefences/AccountPreferences";
import ManageExternalEvents from "./components/admin/System/tabs/ManageExternalEvents/ManageExternalEvents";
import Configurations from "./components/admin/System/tabs/Configuration/Configurations";
import EntityMapping from "./components/admin/System/tabs/EntityToEntity/EntityMapping";
import ExternalServices from "./components/admin/System/tabs/ExternalServices/ExternalServices";
import TwoFactorAuthentication from "./components/admin/System/tabs/TwoFactor/TwoFactorConfig";
import AuditTrails from "./components/admin/System/tabs/AuditTrails/AuditTrails";
import ManageSchedulerJobs from "./components/admin/System/tabs/ManageSchedulerJobs/ManageSchedulerJobs";

/* Admin/ System / External-Services */
import AmazonS3Service from "./components/admin/System/tabs/ExternalServices/AmazonS3Service";
import EmailService from "./components/admin/System/tabs/ExternalServices/EmailService";
import SmsService from "./components/admin/System/tabs/ExternalServices/SmsService";
import NotificationService from "./components/admin/System/tabs/ExternalServices/NotificationService";

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
                            <Route path="/templates" element={<Templates />} />

                            {/* Admin/ System */}
                            <Route path="/manage-data-tables" element={<ManageDataTables />} />
                            <Route path="/manage-codes" element={<ManageCodes />} />
                            <Route path="/manage-roles-permissions" element={<ManageRolesPermissions />} />
                            <Route path="/configure-maker-checker" element={<ConfigureMakerChecker />} />
                            <Route path="/manage-hooks" element={<ManageHooks />} />
                            <Route path="/manage-surveys" element={<ManageSurveys />} />
                            <Route path="/manage-reports" element={<ManageReports />} />
                            <Route path="/account-preferences" element={<AccountPreferences />} />
                            <Route path="/manage-external-events" element={<ManageExternalEvents />} />
                            <Route path="/configurations" element={<Configurations />} />
                            <Route path="/entity-mappings" element={<EntityMapping />} />
                            <Route path="/external-services" element={<ExternalServices />} />
                            <Route path="/two-factor" element={<TwoFactorAuthentication />} />
                            <Route path="/audit-trails" element={<AuditTrails />} />
                            <Route path="/manage-scheduler-jobs" element={<ManageSchedulerJobs />} />

                            {/* Admin/ System / External-Services */}
                            <Route path="/amzons3" element={<AmazonS3Service />} />
                            <Route path="/email-service" element={<EmailService />} />
                            <Route path="/sms-service" element={<SmsService />} />
                            <Route path="/notification-service" element={<NotificationService />} />

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
