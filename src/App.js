import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { loadConfig } from './config';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoadingProvider } from './context/LoadingContext';
import Notification from './components/Notification';
import './App.css';
import Navbar from "./components/Navbar";
import LoadingOverlay from "./components/LoadingOverlay";
import Modal from "./components/Modal";
import CreateUserModal from './components/Modals/CreateUserModal';
import CreateClientModal from './components/Modals/CreateClientModal';

import AccountsModal from './components/Modals/Clients/AccountsModal';
import SavingsModal from './components/Modals/Clients/SavingsModal';
import GroupsModal from './components/Modals/Clients/GroupsModal';
import CentersModal from './components/Modals/Clients/CentersModal';
import FrequentPostingModal from './components/Modals/Accounting/FrequentPostingModal';
import MigrateOpeningBalanceModal from './components/Modals/Accounting/MigrateOpeningBalanceModal';
import ChartOfAccountsModal from './components/Modals/Accounting/ChartOfAccountsModal';
import AccountingRulesModal from './components/Modals/Accounting/AccountingRulesModal';
import AccrualsModal from './components/Modals/Accounting/AccrualsModal';
import ProvisioningEntriesModal from './components/Modals/Accounting/ProvisioningEntriesModal';
import CreateLoansModal from './components/Modals/Loans/CreateLoansModal';
import LoanAccountsListingModal from './components/Modals/Loans/LoanAccountsListingModal';
import BranchSetupModal from './components/Modals/Users/BranchSetupModal';
import ManageOfficesModal from './components/Modals/Organizations/ManageOfficesModal';
import ManageHolidaysModal from './components/Modals/Organizations/ManageHolidaysModal';
import ManageEmployeesModal from './components/Modals/Organizations/ManageEmployeesModal';
import PasswordChangesModal from './components/Modals/Organizations/PasswordChangesModal';
import ManageFundsModal from './components/Modals/Organizations/ManageFundsModal';
import ManagePaymentTypeModal from './components/Modals/Organizations/ManagePaymentTypeModal';
import BulkImportClientsOfficesModal from './components/Modals/BulkImport/BulkImportClientsOfficesModal';

const App = () => {
    const [isClientModalOpen, setClientModalOpen] = useState(false);
    const [isUserManagementModalOpen, setUserManagementModalOpen] = useState(false);
    const [isAccountsModalOpen, setAccountsModalOpen] = useState(false);
    const [isSavingsModalOpen, setSavingsModalOpen] = useState(false);
    const [isGroupsModalOpen, setGroupsModalOpen] = useState(false);
    const [isCentersModalOpen, setCentersModalOpen] = useState(false);
    const [isFrequentPostingModalOpen, setFrequentPostingModalOpen] = useState(false);
    const [isMigrateOpeningBalanceModalOpen, setMigrateOpeningBalanceModalOpen] = useState(false);
    const [isChartOfAccountsModalOpen, setChartOfAccountsModalOpen] = useState(false);
    const [isCreateLoansModalOpen, setCreateLoansModalOpen] = useState(false);
    const [isAccountingRulesModalOpen, setAccountingRulesModalOpen] = useState(false);
    const [isAccrualsModalOpen, setAccrualsModalOpen] = useState(false);
    const [isProvisioningEntriesModalOpen, setProvisioningEntriesModalOpen] = useState(false);
    const [isLoanAccountsListingModalOpen, setLoanAccountsListingModalOpen] = useState(false);
    const [isBranchSetupModalOpen, setBranchSetupModalOpen] = useState(false);
    const [isManageOfficesModalOpen, setManageOfficesModalOpen] = useState(false);
    const [isManageHolidaysModalOpen, setManageHolidaysModalOpen] = useState(false);
    const [isManageEmployeesModalOpen, setManageEmployeesModalOpen] = useState(false);
    const [isPasswordChangesModalOpen, setPasswordChangesModalOpen] = useState(false);
    const [isManageFundsModalOpen, setManageFundsModalOpen] = useState(false);
    const [isManagePaymentTypeModalOpen, setManagePaymentTypeModalOpen] = useState(false);
    const [isBulkImportClientsOfficesModalOpen, setBulkImportClientsOfficesModalOpen] = useState(false);

    useEffect(() => {
        loadConfig().then();
    }, []);

    const location = useLocation();

    const openClientModal = () => setClientModalOpen(true);
    const closeClientModal = () => setClientModalOpen(false);

    const openUserManagementModal = () => setUserManagementModalOpen(true);
    const closeUserManagementModal = () => setUserManagementModalOpen(false);

    const openAccountsModal = () => setAccountsModalOpen(true);
    const closeAccountsModal = () => setAccountsModalOpen(false);

    const openSavingsModal = () => setSavingsModalOpen(true);
    const closeSavingsModal = () => setSavingsModalOpen(false);

    const openGroupsModal = () => setGroupsModalOpen(true);
    const closeGroupsModal = () => setGroupsModalOpen(false);

    const openCentersModal = () => setCentersModalOpen(true);
    const closeCentersModal = () => setCentersModalOpen(false);

    const openFrequentPostingModal = () => setFrequentPostingModalOpen(true);
    const closeFrequentPostingModal = () => setFrequentPostingModalOpen(false);

    const openMigrateOpeningBalanceModal = () => setMigrateOpeningBalanceModalOpen(true);
    const closeMigrateOpeningBalanceModal = () => setMigrateOpeningBalanceModalOpen(false);

    const openChartOfAccountsModal = () => setChartOfAccountsModalOpen(true);
    const closeChartOfAccountsModal = () => setChartOfAccountsModalOpen(false);

    const openCreateLoansModal = () => setCreateLoansModalOpen(true);
    const closeCreateLoansModal = () => setCreateLoansModalOpen(false);

    const openLoanAccountsListingModal = () => setLoanAccountsListingModalOpen(true);
    const closeLoanAccountsListingModal = () => setLoanAccountsListingModalOpen(false);

    const openBranchSetupModal = () => setBranchSetupModalOpen(true);
    const closeBranchSetupModal = () => setBranchSetupModalOpen(false);

    const openManageOfficesModal = () => setManageOfficesModalOpen(true);
    const closeManageOfficesModal = () => setManageOfficesModalOpen(false);

    const openManageHolidaysModal = () => setManageHolidaysModalOpen(true);
    const closeManageHolidaysModal = () => setManageHolidaysModalOpen(false);

    const openManageEmployeesModal = () => setManageEmployeesModalOpen(true);
    const closeManageEmployeesModal = () => setManageEmployeesModalOpen(false);

    const openPasswordChangesModal = () => setPasswordChangesModalOpen(true);
    const closePasswordChangesModal = () => setPasswordChangesModalOpen(false);

    const openManageFundsModal = () => setManageFundsModalOpen(true);
    const closeManageFundsModal = () => setManageFundsModalOpen(false);

    const openManagePaymentTypeModal = () => setManagePaymentTypeModalOpen(true);
    const closeManagePaymentTypeModal = () => setManagePaymentTypeModalOpen(false);

    const openBulkImportClientsOfficesModal = () => setBulkImportClientsOfficesModalOpen(true);
    const closeBulkImportClientsOfficesModal = () => setBulkImportClientsOfficesModalOpen(false);

    const openAccountingRulesModal = () => setAccountingRulesModalOpen(true);
    const closeAccountingRulesModal = () => setAccountingRulesModalOpen(false);

    const openAccrualsModal = () => setAccrualsModalOpen(true);
    const closeAccrualsModal = () => setAccrualsModalOpen(false);

    const openProvisioningEntriesModal = () => setProvisioningEntriesModalOpen(true);
    const closeProvisioningEntriesModal = () => setProvisioningEntriesModalOpen(false);

    return (
        <AuthProvider>
            <LoadingProvider>
                <NotificationProvider>
                    <LoadingOverlay />
                    <Notification />
                    {location.pathname !== '/login' && (
                        <Navbar
                            onOpenClientModal={openClientModal}
                            onOpenUserManagementModal={openUserManagementModal}
                            onOpenAccountsModal={openAccountsModal}
                            onOpenSavingsModal={openSavingsModal}
                            onOpenGroupsModal={openGroupsModal}
                            onOpenCentersModal={openCentersModal}
                            onOpenFrequentPostingModal={openFrequentPostingModal}
                            onOpenMigrateOpeningBalanceModal={openMigrateOpeningBalanceModal}
                            onOpenChartOfAccountsModal={openChartOfAccountsModal}
                            onOpenAccountingRulesModal={openAccountingRulesModal}
                            onOpenAccrualsModal={openAccrualsModal}
                            onOpenProvisioningEntriesModal={openProvisioningEntriesModal}
                            onOpenCreateLoansModal={openCreateLoansModal}
                            onOpenLoanAccountsListingModal={openLoanAccountsListingModal}
                            onOpenBranchSetupModal={openBranchSetupModal}
                            onOpenManageOfficesModal={openManageOfficesModal}
                            onOpenManageHolidaysModal={openManageHolidaysModal}
                            onOpenManageEmployeesModal={openManageEmployeesModal}
                            onOpenPasswordChangesModal={openPasswordChangesModal}
                            onOpenManageFundsModal={openManageFundsModal}
                            onOpenManagePaymentTypeModal={openManagePaymentTypeModal}
                            onOpenBulkImportClientsOfficesModal={openBulkImportClientsOfficesModal}
                        />
                    )}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                    <Modal showModal={isClientModalOpen} closeModal={closeClientModal}>
                        <CreateClientModal />
                    </Modal>
                    <Modal showModal={isUserManagementModalOpen} closeModal={closeUserManagementModal}>
                        <CreateUserModal />
                    </Modal>
                    <Modal showModal={isAccountsModalOpen} closeModal={closeAccountsModal}>
                        <AccountsModal />
                    </Modal>
                    <Modal showModal={isSavingsModalOpen} closeModal={closeSavingsModal}>
                        <SavingsModal />
                    </Modal>
                    <Modal showModal={isGroupsModalOpen} closeModal={closeGroupsModal}>
                        <GroupsModal />
                    </Modal>
                    <Modal showModal={isCentersModalOpen} closeModal={closeCentersModal}>
                        <CentersModal />
                    </Modal>
                    <Modal showModal={isFrequentPostingModalOpen} closeModal={closeFrequentPostingModal}>
                        <FrequentPostingModal />
                    </Modal>
                    <Modal showModal={isMigrateOpeningBalanceModalOpen} closeModal={closeMigrateOpeningBalanceModal}>
                        <MigrateOpeningBalanceModal />
                    </Modal>
                    <Modal showModal={isChartOfAccountsModalOpen} closeModal={closeChartOfAccountsModal}>
                        <ChartOfAccountsModal />
                    </Modal>
                    <Modal showModal={isCreateLoansModalOpen} closeModal={closeCreateLoansModal}>
                        <CreateLoansModal />
                    </Modal>
                    <Modal showModal={isLoanAccountsListingModalOpen} closeModal={closeLoanAccountsListingModal}>
                        <LoanAccountsListingModal />
                    </Modal>
                    <Modal showModal={isBranchSetupModalOpen} closeModal={closeBranchSetupModal}>
                        <BranchSetupModal />
                    </Modal>
                    <Modal showModal={isManageOfficesModalOpen} closeModal={closeManageOfficesModal}>
                        <ManageOfficesModal />
                    </Modal>
                    <Modal showModal={isManageHolidaysModalOpen} closeModal={closeManageHolidaysModal}>
                        <ManageHolidaysModal />
                    </Modal>
                    <Modal showModal={isManageEmployeesModalOpen} closeModal={closeManageEmployeesModal}>
                        <ManageEmployeesModal />
                    </Modal>
                    <Modal showModal={isPasswordChangesModalOpen} closeModal={closePasswordChangesModal}>
                        <PasswordChangesModal />
                    </Modal>
                    <Modal showModal={isManageFundsModalOpen} closeModal={closeManageFundsModal}>
                        <ManageFundsModal />
                    </Modal>
                    <Modal showModal={isManagePaymentTypeModalOpen} closeModal={closeManagePaymentTypeModal}>
                        <ManagePaymentTypeModal />
                    </Modal>
                    <Modal showModal={isBulkImportClientsOfficesModalOpen} closeModal={closeBulkImportClientsOfficesModal}>
                        <BulkImportClientsOfficesModal />
                    </Modal>
                    <Modal showModal={isAccountingRulesModalOpen} closeModal={closeAccountingRulesModal}>
                        <AccountingRulesModal />
                    </Modal>
                    <Modal showModal={isAccrualsModalOpen} closeModal={closeAccrualsModal}>
                        <AccrualsModal />
                    </Modal>
                    <Modal showModal={isProvisioningEntriesModalOpen} closeModal={closeProvisioningEntriesModal}>
                        <ProvisioningEntriesModal />
                    </Modal>
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
