import React, {useContext, useEffect, useState} from 'react';
import { FaUser, FaBuilding, FaUsers, FaSignOutAlt, FaWallet, FaCog, FaClipboardList} from 'react-icons/fa';
import {useLocation, useNavigate} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import { TbChevronDown, TbChevronRight } from 'react-icons/tb';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showNotification } = useContext(NotificationContext);
    const { componentVisibility } = useContext(AuthContext);

    const [openDropdown, setOpenDropdown] = useState(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
        return localStorage.getItem('isSidebarExpanded') === 'true';
    });

    const handleLogout = () => {
        logout();
        showNotification('You have successfully logged out!', 'success');
        navigate('/login');
    };

    const toggleDropdown = (dropdownName) => {
        setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    };

    const location = useLocation();

    const username = user?.username || "User";
    const officeName = user?.officeName || "Office";

    const toggleSidebar = () => {
        const newSidebarState = !isSidebarExpanded;
        setIsSidebarExpanded(newSidebarState);

        localStorage.setItem('isSidebarExpanded', newSidebarState);

        const marginValue = isSidebarExpanded ? '0' : '250px';
        const neighboringElements = document.querySelectorAll('.neighbor-element');
        neighboringElements.forEach((element) => {
            element.style.marginLeft = marginValue;
        });
    };

    useEffect(() => {
        const marginValue = isSidebarExpanded ? '250px' : '0';
        const neighboringElements = document.querySelectorAll('.neighbor-element');
        neighboringElements.forEach((element) => {
            element.style.marginLeft = marginValue;
        });
    }, [isSidebarExpanded, location]);

    return (
        <aside className={`sidebar ${isSidebarExpanded ? '' : 'collapsed'}`}>
            <button onClick={toggleSidebar} className="toggle-sidebar-btn">
                {isSidebarExpanded ? 'Collapse' : 'Expand'}
            </button>
            <div className={`user-info ${isSidebarExpanded ? '' : 'hidden'}`}>
                <div className="user-icon">
                    {user ? username.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="user-details">
                    <h2>{username}</h2>
                    <p>Office: {officeName}</p>
                </div>
            </div>
            <ul className={`side-nav-links ${isSidebarExpanded ? '' : 'hidden'}`}>
                {componentVisibility['sidebar-dashboard'] && (
                    <li onClick={() => navigate('/dashboard')} className="side-nav-item">
                        <div className="nav-left">
                            <FaUser className="nav-icon"/> Dashboard
                        </div>
                    </li>
                )}
                {componentVisibility['sidebar-clients'] && (
                    <li onClick={() => navigate('/clients')} className="side-nav-item">
                        <div className="nav-left">
                            <FaUsers className="nav-icon"/> Clients
                        </div>
                    </li>
                )}
                {componentVisibility['sidebar-groups'] && (
                    <li onClick={() => navigate('/groups')} className="side-nav-item">
                        <div className="nav-left">
                            <FaUsers className="nav-icon"/> Groups
                        </div>
                    </li>
                )}
                {componentVisibility['sidebar-centers'] && (
                    <li onClick={() => navigate('/centers')} className="side-nav-item">
                        <div className="nav-left">
                            <FaBuilding className="nav-icon"/> Centers
                        </div>
                    </li>
                )}
                {componentVisibility['sidebar-reports'] && (
                    <li className="side-nav-item" onClick={() => toggleDropdown('reports')}>
                        <div className="nav-left">
                            <FaClipboardList className="nav-icon"/> Reports
                            <span className="dropdown-arrow">
                                {openDropdown === 'reports' ? <TbChevronDown/> : <TbChevronRight/>}
                            </span>
                        </div>
                        {openDropdown === 'reports' && (
                            <ul className="dropdown">
                                {componentVisibility['sidebar-reports-all'] && (
                                    <li onClick={() => navigate('/reports/all')}>All</li>
                                )}
                                {componentVisibility['sidebar-reports-clients'] && (
                                    <li onClick={() => navigate('/reports/clients')}>Clients</li>
                                )}
                                {componentVisibility['sidebar-reports-loans'] && (
                                    <li onClick={() => navigate('/reports/loans')}>Loans</li>
                                )}
                                {componentVisibility['sidebar-reports-savings'] && (
                                    <li onClick={() => navigate('/reports/savings')}>Savings</li>
                                )}
                                {componentVisibility['sidebar-reports-funds'] && (
                                    <li onClick={() => navigate('/reports/funds')}>Funds</li>
                                )}
                                {componentVisibility['sidebar-reports-accounting'] && (
                                    <li onClick={() => navigate('/reports/accounting')}>Accounting</li>
                                )}
                                {componentVisibility['sidebar-reports-XBRL'] && (
                                    <li onClick={() => navigate('/report/XBRL')}>XBRL</li>
                                )}
                            </ul>
                        )}
                    </li>
                )}
                {componentVisibility['sidebar-accounting'] && (
                    <li className="side-nav-item" onClick={() => toggleDropdown('accounting')}>
                        <div className="nav-left">
                            <FaWallet className="nav-icon"/> Accounting
                            <span className="dropdown-arrow">
                                {openDropdown === 'accounting' ? <TbChevronDown/> : <TbChevronRight/>}
                            </span>
                        </div>
                        {openDropdown === 'accounting' && (
                            <ul className="dropdown">
                                {componentVisibility['sidebar-accounting-frequent-postings'] && (
                                    <li onClick={() => navigate('/frequent-postings')}>Frequent Postings</li>
                                )}
                                {componentVisibility['sidebar-accounting-journal-entries'] && (
                                    <li onClick={() => navigate('/journal-entries')}>Journal Entries</li>
                                )}
                                {componentVisibility['sidebar-accounting-closing-entries'] && (
                                    <li onClick={() => navigate('/closing-entries')}>Closing Entries</li>
                                )}
                                {componentVisibility['sidebar-accounting-charts-of-accounts'] && (
                                    <li onClick={() => navigate('/chart-of-accounts')}>Chart of Accounts</li>
                                )}
                                {componentVisibility['sidebar-accounting-financial-activity-mappings'] && (
                                    <li onClick={() => navigate('/financial-activity-mappings')}>Financial Activity Mappings
                                    </li>
                                )}
                                {/*<li onClick={() => navigate('/#migrate-balances')}>Migrate Opening Balances</li>*/}
                                {componentVisibility['sidebar-accounting-rules'] && (
                                    <li onClick={() => navigate('/accounting-rules')}>Accounting Rules</li>
                                )}
                                {componentVisibility['sidebar-accounting-accruals'] && (
                                    <li onClick={() => navigate('/accruals')}>Accruals</li>
                                )}
                                {componentVisibility['sidebar-accounting-provisioning-entries'] && (
                                    <li onClick={() => navigate('/provisioning-entries')}>Provisioning Entries</li>
                                )}
                            </ul>
                        )}
                    </li>
                )}
                {componentVisibility['sidebar-admin'] && (
                    <li className="side-nav-item" onClick={() => toggleDropdown('admin')}>
                        <div className="nav-left">
                            <FaCog className="nav-icon"/> Admin
                            <span className="dropdown-arrow">
                                {openDropdown === 'admin' ? <TbChevronDown/> : <TbChevronRight/>}
                            </span>
                        </div>
                        {openDropdown === 'admin' && (
                            <ul className="dropdown">
                                {componentVisibility['sidebar-admin-users'] && (
                                    <li onClick={() => navigate('/users')}>Users</li>
                                )}
                                {componentVisibility['sidebar-admin-organization'] && (
                                    <li onClick={() => navigate('/organization')}>Organization</li>
                                )}
                                {componentVisibility['sidebar-admin-products'] && (
                                    <li onClick={() => navigate('/products')}>Products</li>
                                )}
                                {componentVisibility['sidebar-admin-templates'] && (
                                    <li onClick={() => navigate('/templates')}>Templates</li>
                                )}
                                {componentVisibility['sidebar-admin-system'] && (
                                    <li onClick={() => navigate('/system')}>System</li>
                                )}
                            </ul>
                        )}
                    </li>
                )}
                <li onClick={handleLogout} className="side-nav-item logout-item">
                    <div className="nav-left">
                        <FaSignOutAlt className="nav-icon"/> Logout
                    </div>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
