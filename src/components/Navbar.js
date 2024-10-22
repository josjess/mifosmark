import React, {useContext} from 'react';
import { FaBell, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';
import { AuthContext } from '../context/AuthContext';
import {useNavigate} from "react-router-dom";
import {NotificationContext} from "../context/NotificationContext";

const Navbar = () => {

    const navigateTo = (route) => {
        window.location = route;
    };
    const navigate = useNavigate();
    const { showNotification } = useContext(NotificationContext);

    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        showNotification('You have successfully logged out!', 'success');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <h2 className="nav-company-name" onClick={() => navigateTo('/')}>Mifos</h2>
                </div>
                <div className="navbar-right">
                    <button className="icon-button" aria-label="Notifications" onClick={() => navigateTo('/#notifications')}>
                        <FaBell />
                    </button>
                    <button className="icon-button" aria-label="Settings" onClick={() => navigateTo('/#settings')}>
                        <FaCog />
                    </button>
                    <button className="logout-button" onClick={handleLogout} >
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
