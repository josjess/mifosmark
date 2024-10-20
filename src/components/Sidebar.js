import React, {useContext} from 'react';
import { FaUser, FaBuilding, FaHome, FaChartBar, FaClipboardList, FaFileInvoiceDollar, FaFileContract, FaShieldAlt, FaUsers, FaWallet, FaCog, FaSignOutAlt } from 'react-icons/fa';
import {AuthContext} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {NotificationContext} from "../context/NotificationContext";
import './Dashboard.css';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showNotification } = useContext(NotificationContext);

    const handleLogout = () => {
        logout();
        showNotification('You have successfully logged out!', 'success');
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <ul className="nav-links">
                <li onClick={() => navigate('/')}>
                    <FaHome/> Home
                </li>
                <li onClick={() => navigate('/dashboard')}>
                    <FaUser/> Dashboard
                </li>
                <li onClick={() => navigate('/#office')}>
                    <FaBuilding/> Office
                </li>
                <li onClick={() => navigate('/#reports')}>
                    <FaChartBar/> Reports
                </li>
                <li onClick={() => navigate('/#tasks')}>
                    <FaClipboardList/> Tasks
                </li>
                <li onClick={() => navigate('/#invoices')}>
                    <FaFileInvoiceDollar/> Invoices
                </li>
                <li onClick={() => navigate('/#contracts')}>
                    <FaFileContract/> Contracts
                </li>
                <li onClick={() => navigate('/#security')}>
                    <FaShieldAlt/> Security
                </li>
                <li onClick={() => navigate('/#users')}>
                    <FaUsers/> Users
                </li>
                <li onClick={() => navigate('/#accounts')}>
                    <FaWallet/> Accounts
                </li>
                <li onClick={() => navigate('/#settings')}>
                    <FaCog/> Settings
                </li>
                <li onClick={handleLogout}>
                    <FaSignOutAlt/> Logout
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
