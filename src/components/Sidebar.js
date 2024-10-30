import React, { useContext, useState } from 'react';
import { FaUser, FaBuilding, FaUsers, FaSignOutAlt, FaWallet, FaCog, FaClipboardList} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { TbChevronDown, TbChevronRight } from 'react-icons/tb';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showNotification } = useContext(NotificationContext);

    const [openDropdown, setOpenDropdown] = useState(null);

    const handleLogout = () => {
        logout();
        showNotification('You have successfully logged out!', 'success');
        navigate('/login');
    };

    const toggleDropdown = (dropdownName) => {
        setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    };

    const username = user?.username || "User";
    const officeName = user?.officeName || "Office";

    return (
        <aside className="sidebar">
            <div className="user-info">
                <div className="user-icon">
                    {user ? username.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="user-details">
                    <h2>{username}</h2>
                    <p>Office: {officeName}</p>
                </div>
            </div>
            <ul className="side-nav-links">
                <li onClick={() => navigate('/dashboard')} className="side-nav-item">
                    <div className="nav-left">
                        <FaUser className="nav-icon"/> Dashboard
                    </div>
                </li>
                <li className="side-nav-item" onClick={() => toggleDropdown('accounting')}>
                    <div className="nav-left">
                        <FaWallet className="nav-icon"/> Accounting
                        <span className="dropdown-arrow">
                            {openDropdown === 'accounting' ? <TbChevronDown/> : <TbChevronRight/>}
                        </span>
                    </div>
                    {openDropdown === 'accounting' && (
                        <ul className="dropdown">
                            <li onClick={() => navigate('/frequent-postings')}>Frequent Postings</li>
                            <li onClick={() => navigate('/add-journal-entries')}>Add Journal Entries</li>
                            <li onClick={() => navigate('/#closing-entries')}>Closing Entries</li>
                            <li onClick={() => navigate('/#chart-of-accounts')}>Chart of Accounts</li>
                            <li onClick={() => navigate('/#financial-mappings')}>Financial Activity Mappings</li>
                            <li onClick={() => navigate('/#migrate-balances')}>Migrate Opening Balances</li>
                            <li onClick={() => navigate('/#accounting-rules')}>Accounting Rules</li>
                            <li onClick={() => navigate('/#accruals')}>Accruals</li>
                            <li onClick={() => navigate('/#provisioning-entries')}>Provisioning Entries</li>
                        </ul>
                    )}
                </li>

                <li className="side-nav-item" onClick={() => toggleDropdown('reports')}>
                    <div className="nav-left">
                        <FaClipboardList className="nav-icon"/> Reports
                        <span className="dropdown-arrow">
                            {openDropdown === 'reports' ? <TbChevronDown/> : <TbChevronRight/>}
                        </span>
                    </div>
                    {openDropdown === 'reports' && (
                        <ul className="dropdown">
                            <li onClick={() => navigate('/reports#reports/all')}>All</li>
                            <li onClick={() => navigate('/#reports/clients')}>Clients</li>
                            <li onClick={() => navigate('/#reports/loans')}>Loans</li>
                            <li onClick={() => navigate('/#reports/savings')}>Savings</li>
                            <li onClick={() => navigate('/#reports/funds')}>Funds</li>
                            <li onClick={() => navigate('/#reports/accounting')}>Accounting</li>
                            <li onClick={() => navigate('/#reports/xbrl')}>XBRL</li>
                        </ul>
                    )}
                </li>

                <li className="side-nav-item" onClick={() => toggleDropdown('admin')}>
                    <div className="nav-left">
                        <FaCog className="nav-icon"/> Admin
                        <span className="dropdown-arrow">
                            {openDropdown === 'admin' ? <TbChevronDown/> : <TbChevronRight/>}
                        </span>
                    </div>
                    {openDropdown === 'admin' && (
                        <ul className="dropdown">
                            <li onClick={() => navigate('/admin#admin/users')}>Users</li>
                            <li onClick={() => navigate('/#admin/organization')}>Organization</li>
                            <li onClick={() => navigate('/#admin/products')}>Products</li>
                            <li onClick={() => navigate('/#admin/templates')}>Templates</li>
                            <li onClick={() => navigate('/#admin/system')}>System</li>
                        </ul>
                    )}
                </li>
                <li onClick={() => navigate('/clients')} className="side-nav-item">
                    <div className="nav-left">
                        <FaUsers className="nav-icon"/> Clients
                    </div>
                </li>
                <li onClick={() => navigate('/centers')} className="side-nav-item">
                    <div className="nav-left">
                        <FaBuilding className="nav-icon"/> Centers
                    </div>
                </li>
                <li onClick={() => navigate('/groups')} className="side-nav-item">
                    <div className="nav-left">
                        <FaUsers className="nav-icon"/> Groups
                    </div>
                </li>
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
