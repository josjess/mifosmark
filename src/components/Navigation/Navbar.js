import React, {useContext, useState} from 'react';
import { FaBell, FaCog } from 'react-icons/fa';
import './Navbar.css';
import { AuthContext } from '../../context/AuthContext';
import {useNavigate} from "react-router-dom";
import {NotificationContext} from "../../context/NotificationContext";
import EditBaseURLModal from "../utilities/EditBaseURLModal";

const Navbar = () => {

    const navigateTo = (route) => {
        window.location = route;
    };
    const navigate = useNavigate();
    const { showNotification } = useContext(NotificationContext);

    const { logout } = useContext(AuthContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        showNotification('You have successfully logged out!', 'success');
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const openAppConfiguration = () => {
        setIsModalOpen(true);
        setIsDropdownOpen(false);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-left">
                        <h2 className="nav-company-name" onClick={() => navigateTo('/')}>Mifos</h2>
                    </div>
                    <div className="navbar-right">
                        <button className="icon-button" aria-label="Notifications"
                                onClick={() => navigateTo('/#notifications')}>
                            <FaBell style={{ color: '#efab3c', fontSize: '24px', cursor: 'pointer'}} />

                        </button>
                        <div className="nav-dropdown-container">
                            <button
                                className="icon-button"
                                aria-label="Settings"
                                onClick={toggleDropdown}
                            >
                                <FaCog style={{ color: '#d3e6f5', fontSize: '24px', cursor: 'pointer'}} />

                            </button>
                            {isDropdownOpen && (
                                <div className="nav-dropdown-menu">
                                    <button className="nav-dropdown-item" onClick={openAppConfiguration}>
                                        App Configuration
                                    </button>
                                    {/* Add more settings items here */}
                                </div>
                            )}
                        </div>
                        <button className="logout-button" onClick={handleLogout}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>
            {isModalOpen && (
                <EditBaseURLModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    );
};

export default Navbar;
