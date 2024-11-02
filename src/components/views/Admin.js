import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaBuilding, FaBoxes, FaClipboard, FaCog } from 'react-icons/fa';
import './Admin.css';

const Admin = () => {
    const navigate = useNavigate();

    const options = [
        { label: 'Users', description: 'Manage user roles', icon: FaUserShield, path: '/users', color: '#6a82fb' },
        { label: 'Organization', description: 'Structure & hierarchy', icon: FaBuilding, path: '/organization', color: '#70bc0e' },
        { label: 'Products', description: 'Product catalog', icon: FaBoxes, path: '/products', color: '#ff7b42' },
        { label: 'Templates', description: 'Document templates', icon: FaClipboard, path: '#/#admin/templates', color: '#4a90e2' },
        { label: 'System', description: 'System settings', icon: FaCog, path: '/system', color: '#1abc9c' }
    ];

    const columns = [
        options.slice(0, 3),
        options.slice(3, 5)
    ];

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage administrative settings and tasks</p>
            </header>
            <div className="admin-cards">
                {columns.map((column, index) => (
                    <div key={index} className="admin-card">
                        {column.map(({ label, description, icon: Icon, path, color }) => (
                            <div key={label} className="admin-item" onClick={() => navigate(path)}>
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
