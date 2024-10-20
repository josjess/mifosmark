import React, {useContext, useState} from 'react';
import { FaBars } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ onMenuClick, onOpenClientModal, onOpenUserManagementModal, onOpenAccountsModal, onOpenSavingsModal,
                    onOpenGroupsModal, onOpenCentersModal, onOpenFrequentPostingModal, onOpenMigrateOpeningBalanceModal,
                    onOpenChartOfAccountsModal, onOpenAccountingRulesModal, onOpenAccrualsModal,
                    onOpenProvisioningEntriesModal, onOpenCreateLoansModal, onOpenLoanAccountsListingModal,
                    onOpenBranchSetupModal, onOpenManageOfficesModal, onOpenManageHolidaysModal, onOpenManageEmployeesModal,
                    onOpenPasswordChangesModal, onOpenManageFundsModal, onOpenManagePaymentTypeModal,
                    onOpenBulkImportClientsOfficesModal, }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const { user } = useContext(AuthContext);

    const hasSuperUserRole = user?.roles?.some(role => role.name === 'Super user');

    const handleDropdownToggle = (dropdown) => {
        setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>Mifos</h2>
            </div>

            <div className="navbar-links">
                <div className="nav-item" onMouseEnter={() => handleDropdownToggle('clients')}
                     onMouseLeave={() => setOpenDropdown(null)}>
                    <span className="nav-link">Clients</span>
                    {openDropdown === 'clients' && (
                        <div className="dropdown-menu">
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenAccountsModal}>Accounts</a>
                            {/*<a href="/#loans" className="dropdown-item">Loans</a>*/}
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenSavingsModal}>Savings</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenGroupsModal}>Groups</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenCentersModal}>Centers</a>
                            {hasSuperUserRole && (
                                // eslint-disable-next-line
                                <a href="#" className="dropdown-item" onClick={onOpenClientModal}>Create New Client</a>
                            )}
                        </div>
                    )}
                </div>

                <div className="nav-item" onMouseEnter={() => handleDropdownToggle('accounting')}
                     onMouseLeave={() => setOpenDropdown(null)}>
                    <span className="nav-link">Accounting</span>
                    {openDropdown === 'accounting' && (
                        <div className="dropdown-menu">
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenFrequentPostingModal}>Frequent
                                Posting</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenMigrateOpeningBalanceModal}>Opening
                                Balance Migrations</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenChartOfAccountsModal}>Chart of
                                Accounts</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenAccountingRulesModal}>Accounting
                                Rules</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenAccrualsModal}>Accruals</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenProvisioningEntriesModal}>Provisioning
                                Entries</a>
                        </div>
                    )}
                </div>

                <div className="nav-item" onMouseEnter={() => handleDropdownToggle('loans')}
                     onMouseLeave={() => setOpenDropdown(null)}>
                    <span className="nav-link">Loans</span>
                    {openDropdown === 'loans' && (
                        <div className="dropdown-menu">
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenCreateLoansModal}>Create Loans &
                                Terms</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenLoanAccountsListingModal}>Loan Accounts
                                Listing</a>
                        </div>
                    )}
                </div>


                <div className="nav-item dropdown-right" onMouseEnter={() => handleDropdownToggle('users')}
                     onMouseLeave={() => setOpenDropdown(null)}>
                    <span className="nav-link">Users</span>
                    {openDropdown === 'users' && (
                        <div className="dropdown-menu dropdown-menu-right">
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenUserManagementModal}>Setup
                                Users</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenBranchSetupModal}>Branch Setup</a>
                            {hasSuperUserRole && (
                                // eslint-disable-next-line
                                <a href="#" className="dropdown-item" onClick={onOpenUserManagementModal}>Manage Users &
                                    Roles</a>
                            )}
                        </div>
                    )}
                </div>

                <div className="nav-item dropdown-right" onMouseEnter={() => handleDropdownToggle('organizations')}
                     onMouseLeave={() => setOpenDropdown(null)}>
                    <span className="nav-link">Organizations</span>
                    {openDropdown === 'organizations' && (
                        <div className="dropdown-menu dropdown-menu-right">
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenManageOfficesModal}>Manage
                                Offices/Branches</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenManageHolidaysModal}>Manage
                                Holidays</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenManageEmployeesModal}>Manage
                                Employees</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenPasswordChangesModal}>Password
                                Changes</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenManageFundsModal}>Manage Funds</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenManagePaymentTypeModal}>Manage Payment
                                Type</a>
                            {/* eslint-disable-next-line */}
                            <a href="#" className="dropdown-item" onClick={onOpenBulkImportClientsOfficesModal}>Bulk
                                Import Clients/Offices</a>
                        </div>
                    )}
                </div>
            </div>

            <div className="navbar-menu" onClick={onMenuClick}>
                <FaBars/>
            </div>
        </nav>
    );
};

export default Navbar;
