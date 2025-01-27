import React, {useContext} from 'react';
import './System.css';
import {FaDatabase, FaCode, FaUserShield, FaTasks, FaLink, FaProjectDiagram, FaPoll, FaClipboardList, FaCalendarCheck, FaCogs, FaCalendarAlt, FaServer, FaKey, FaCloud} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {FaGauge} from "react-icons/fa6";
import {AuthContext} from "../../../context/AuthContext";

const System = () => {
    const navigate = useNavigate();
    const { componentVisibility } = useContext(AuthContext);

    const systemTiles = [
        { id: "admin-system-manage-data-tables", title: 'Manage Data Tables', icon: <FaDatabase />, description: 'Manage custom tables', color: '#3498db', link: '/manage-data-tables' },
        { id: "admin-system-manage-codes", title: 'Manage Codes', icon: <FaCode />, description: 'Define dropdown values', color: '#27ae60', link: '/manage-codes' },
        { id: "admin-system-manage-roles-and-permissions", title: 'Manage Roles and Permissions', icon: <FaUserShield />, description: 'Access control', color: '#8e44ad', link: '/manage-roles-permissions' },
        { id: "admin-system-configure-maker-and-checker-tasks", title: 'Configure Maker and Checker Tasks', icon: <FaTasks />, description: 'Task configuration', color: '#e67e22', link: '/configure-maker-checker' },
        { id: "admin-system-manage-hooks", title: 'Manage Hooks', icon: <FaLink />, description: 'Hooks setup', color: '#c0392b', link: '/manage-hooks' },
        { id: 'admin-system-entity-to-entity-mapping', title: 'Entity to Entity Mapping', icon: <FaProjectDiagram />, description: 'Mapping entities', color: '#2980b9', link: '/entity-mappings' },
        { id: 'admin-system-manage-surveys', title: 'Manage Surveys', icon: <FaPoll />, description: 'Survey configurations', color: '#f39c12', link: '/manage-surveys' },
        { id: 'admin-system-manage-external-events', title: 'Manage External Events', icon: <FaGauge />, description: 'External Events Configuration', color: '#f39c12', link: '/manage-external-events' },
        { id: 'admin-system-audit-trails', title: 'Audit Trails', icon: <FaClipboardList />, description: 'Track changes', color: '#d35400', link: '/audit-trails' },
        { id: 'admin-system-manage-reports', title: 'Manage Reports', icon: <FaCalendarCheck />, description: 'Reports setup', color: '#1abc9c', link: '/manage-reports' },
        { id: 'admin-system-scheduler-jobs', title: 'Manage Jobs/ Scheduler Jobs', icon: <FaCogs />, description: 'Automated tasks', color: '#9b59b6', link: '/manage-scheduler-jobs' },
        { id: 'admin-system-configurations', title: 'Configurations', icon: <FaCalendarAlt />, description: 'System settings', color: '#8398ff', link: '/configurations' },
        { id: 'admin-system-account-number-preferences', title: 'Account Number Preferences', icon: <FaServer />, description: 'Account preferences', color: '#5a84b5', link: '/account-preferences' },
        { id: 'admin-system-external-services', title: 'External Services', icon: <FaCloud />, description: 'Integrate services', color: '#e74c3c', link: '/external-services' },
        { id: 'admin-system-two-factor', title: 'Two-Factor Configuration', icon: <FaKey />, description: '2FA setup', color: '#2ecc71', link: '/two-factor' }
    ];

    return (
        <div className="system-page neighbor-element">
            <h2 className="system-page-heading">
                <Link to="/admin" className="breadcrumb-link">Admin</Link> . System
            </h2>
            <div className="system-tiles-grid">
                {systemTiles.map(( tile, index) => (
                    <div
                        key={index}
                        className={`system-tile ${componentVisibility[tile.id] ? "" : "hidden"}`}
                        onClick={() => navigate(tile.link)}
                    >
                        <div className="system-tile-icon" style={{ color: tile.color }}>{tile.icon}</div>
                        <h4 className="system-tile-title">{tile.title}</h4>
                        <p className="system-tile-description">{tile.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default System;
