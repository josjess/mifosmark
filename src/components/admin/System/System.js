import React from 'react';
import './System.css';
import {FaDatabase, FaCode, FaUserShield, FaTasks, FaLink, FaProjectDiagram, FaPoll, FaClipboardList, FaCalendarCheck, FaCogs, FaCalendarAlt, FaServer, FaKey, FaCloud} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {FaGauge} from "react-icons/fa6";

const System = () => {
    const navigate = useNavigate();

    const systemTiles = [
        { title: 'Manage Data Tables', icon: <FaDatabase />, description: 'Manage custom tables', color: '#3498db', link: '/manage-data-tables' },
        { title: 'Manage Codes', icon: <FaCode />, description: 'Define dropdown values', color: '#27ae60', link: '/manage-codes' },
        { title: 'Manage Roles and Permissions', icon: <FaUserShield />, description: 'Access control', color: '#8e44ad', link: '/manage-roles-permissions' },
        { title: 'Configure Maker and Checker Tasks', icon: <FaTasks />, description: 'Task configuration', color: '#e67e22', link: '/configure-maker-checker' },
        { title: 'Manage Hooks', icon: <FaLink />, description: 'Hooks setup', color: '#c0392b', link: '/manage-hooks' },
        { title: 'Entity to Entity Mapping', icon: <FaProjectDiagram />, description: 'Mapping entities', color: '#2980b9', link: '/entity-mappings' },
        { title: 'Manage Surveys', icon: <FaPoll />, description: 'Survey configurations', color: '#f39c12', link: '/manage-surveys' },
        { title: 'Manage External Events', icon: <FaGauge />, description: 'External Events Configuration', color: '#f39c12', link: '/manage-external-events' },
        { title: 'Audit Trails', icon: <FaClipboardList />, description: 'Track changes', color: '#d35400', link: '/audit-trails' },
        { title: 'Manage Reports', icon: <FaCalendarCheck />, description: 'Reports setup', color: '#1abc9c', link: '/manage-reports' },
        { title: 'Manage Jobs/ Scheduler Jobs', icon: <FaCogs />, description: 'Automated tasks', color: '#9b59b6', link: '/manage-scheduler-jobs' },
        { title: 'Configurations', icon: <FaCalendarAlt />, description: 'System settings', color: '#8398ff', link: '/configurations' },
        { title: 'Account Number Preferences', icon: <FaServer />, description: 'Account preferences', color: '#5a84b5', link: '/account-preferences' },
        { title: 'External Services', icon: <FaCloud />, description: 'Integrate services', color: '#e74c3c', link: '/external-services' },
        { title: 'Two-Factor Configuration', icon: <FaKey />, description: '2FA setup', color: '#2ecc71', link: '/two-factor' }
    ];

    return (
        <div className="system-page">
            <h2 className="system-page-heading">
                <Link to="/admin" className="breadcrumb-link">Admin</Link> . System
            </h2>
            <div className="system-tiles-grid">
                {systemTiles.map((tile, index) => (
                    <div
                        key={index}
                        className="system-tile"
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
