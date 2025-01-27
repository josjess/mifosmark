import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaBuilding, FaBoxes, FaClipboard, FaCog } from 'react-icons/fa';
import './Admin.css';
import {AuthContext} from "../../context/AuthContext";

const Admin = () => {
    const navigate = useNavigate();
    const { componentVisibility } = useContext(AuthContext);

    const options = [
        { id: "admin-users", label: 'Users', description: 'Manage user roles', icon: FaUserShield, path: '/users', color: '#6a82fb' },
        { id: "admin-organization", label: 'Organization', description: 'Structure & hierarchy', icon: FaBuilding, path: '/organization', color: '#70bc0e' },
        { id: "admin-products",label: 'Products', description: 'Product catalog', icon: FaBoxes, path: '/products', color: '#ff7b42' },
        { id: "admin-templates",label: 'Templates', description: 'Document templates', icon: FaClipboard, path: '/templates', color: '#4a90e2' },
        { id: "admin-system", label: 'System', description: 'System settings', icon: FaCog, path: '/system', color: '#1abc9c' }
    ];

    const columns = [
        options.slice(0, 3),
        options.slice(3, 5)
    ];

    return (
        <div className="admin-layout neighbor-element">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage administrative settings and tasks</p>
            </header>
            <div className="admin-cards">
                {columns.map((column, index) => (
                    <div key={index} className="admin-card">
                        {column.map(({ id, label, description, icon: Icon, path, color }) => (
                            <div key={id}
                                 className={`admin-item ${componentVisibility[id] ? "" : "hidden"}`}
                                 onClick={() => navigate(path)}>
                                <div className="icon-container" style={{ backgroundColor: color }}>
                                    <Icon className="admin-icon" />
                                </div>
                                <div className="text-content">
                                    <h3>{label}</h3>
                                    <p>{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;
