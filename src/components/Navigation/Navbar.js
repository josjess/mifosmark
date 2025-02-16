import React, {useContext, useEffect, useRef, useState} from 'react';
import {FaBell, FaCog, FaWrench} from 'react-icons/fa';
import './Navbar.css';
import { AuthContext } from '../../context/AuthContext';
import {Link, useNavigate} from "react-router-dom";
import {NotificationContext} from "../../context/NotificationContext";
import EditBaseURLModal from "../utilities/EditBaseURLModal";
import NotificationModal from "../utilities/Notification";
import TimeoutSettingsModal from "../utilities/TimeoutSettingsModal";

const Navbar = () => {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { showNotification } = useContext(NotificationContext);

    const { logout, user, unreadCount } = useContext(AuthContext);
    const [showTimeoutModal, setShowTimeoutModal] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const hasPermission = user && user.isSuperAdmin && user.roles.includes("System-Configuration-Manager");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = () => {
        logout();
        showNotification('You have successfully logged out!', 'success');
        navigate('/login');
    };

    const handleManagement = () => {
        navigate('/management');
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const openAppConfiguration = () => {
        setIsModalOpen(true);
        setIsDropdownOpen(false);
    };

    const openInactivityModal = () => {
        setShowTimeoutModal(true);
        setIsDropdownOpen(false);
    }

    const openNotifications = () => {
        setIsNotificationsModalOpen(true);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-content">
                    <div onClick={ () => navigate('/')} className="navbar-left">
                        <img
                            src={`${process.env.PUBLIC_URL}/Images/fincore.jpg`}
                            alt="Fincore Logo"
                            className="nav-logo"

                        />
                        <h2 className="nav-company-name">
                            Fincore
                        </h2>
                    </div>

                    <div className="navbar-right">
                        {hasPermission && (
                            <button className="icon-button" aria-label="management" onClick={handleManagement}>
                                <FaWrench style={{color: '#d3e6f5', fontSize: '24px', cursor: 'pointer'}}/>
                            </button>
                        )}
                        {hasPermission && (
                            <div className="nav-dropdown-container" ref={dropdownRef}>
                                <button
                                    className="icon-button"
                                    aria-label="Settings"
                                    onClick={toggleDropdown}
                                >
                                    <FaCog style={{color: '#d3e6f5', fontSize: '24px', cursor: 'pointer'}}/>
                                </button>
                                {isDropdownOpen && (
                                    <div className="nav-dropdown-menu">
                                        <button className="nav-dropdown-item" onClick={openAppConfiguration}>
                                            App Configuration
                                        </button>
                                        <button className="nav-dropdown-item" onClick={openInactivityModal}>
                                            Inactivity Timeout
                                        </button>
                                        {/* more settings items here */}
                                    </div>
                                )}
                            </div>
                        )}
                        <button className="icon-button" aria-label="Notifications" onClick={openNotifications}>
                            <FaBell style={{color: '#efab3c', fontSize: '24px', cursor: 'pointer'}}/>
                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                        </button>
                        <button className="logout-button" onClick={handleLogout}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>
            {isModalOpen && (
                <EditBaseURLModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
            )}
            {isNotificationsModalOpen && (
                <NotificationModal isOpen={isNotificationsModalOpen} onClose={() => setIsNotificationsModalOpen(false)}/>
            )}
            {showTimeoutModal && (
                <TimeoutSettingsModal isOpen={showTimeoutModal} onClose={() => setShowTimeoutModal(false)} />
            )}
        </>
    );
};

export default Navbar;
