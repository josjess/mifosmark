import React, {useContext} from 'react';
import './Products.css';
import {
    FaPiggyBank, FaWallet, FaChartPie, FaMoneyCheckAlt, FaPercentage, FaBoxes,
    FaUniversity, FaRecycle, FaBalanceScale, FaChartLine, FaShieldAlt, FaCalendarTimes
} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from "../../../context/AuthContext";

const Products = () => {
    const navigate = useNavigate();
    const { componentVisibility } = useContext(AuthContext);

    const tiles = [
        { id: 'admin-products-loan-products', title: 'Loan Products', icon: <FaWallet />, description: 'Various loan options', color: '#3498db', link: '/loan-products' },
        { id: 'admin-products-savings-products', title: 'Savings Products', icon: <FaPiggyBank />, description: 'Savings schemes', color: '#27ae60', link: '/savings-products' },
        { id: 'admin-products-share-products', title: 'Share Products', icon: <FaChartPie />, description: 'Share options', color: '#8e44ad', link: '/share-products' },
        { id: 'admin-products-charges', title: 'Charges', icon: <FaMoneyCheckAlt />, description: 'Service fees', color: '#e67e22', link: '/charges' },
        { id: 'admin-products-collateral-management', title: 'Collateral Management', icon: <FaShieldAlt />, description: 'Define collaterals for Collateral Management', color: '#e67e22', link: '/collateral' },
        { id: 'admin-products-delinquency-buckets', title: 'Delinquency Buckets', icon: <FaCalendarTimes />, description: 'Define delinquency day ranges', color: '#e67e22', link: '/manage-delinquency' },
        { id: 'admin-products-products-mix', title: 'Products Mix', icon: <FaBoxes />, description: 'Combined offerings', color: '#2980b9', link: '/products-mix' },
        { id: 'admin-products-fixed-deposit-products', title: 'Fixed Deposit Products', icon: <FaUniversity />, description: 'Fixed deposits', color: '#f39c12', link: '/fixed-deposit-products' },
        { id: 'admin-products-recurring-deposit-products', title: 'Recurring Deposit Products', icon: <FaRecycle />, description: 'Recurring deposits', color: '#d35400', link: '/recurring-deposit-products' },
        { id: 'admin-products-manage-tax-configurations', title: 'Manage Tax Configurations', icon: <FaBalanceScale />, description: 'Tax settings', color: '#1abc9c', link: '/manage-tax-configurations' },
        { id: 'admin-products-floating-rates', title: 'Floating Rates', icon: <FaChartLine />, description: 'Configure Floating rates', color: '#9b59b6', link: '/floating-rates' }
    ];

    return (
        <div className="products-page neighbor-element">
            <h2 className="system-page-heading">
                <Link to="/admin" className="breadcrumb-link">Admin</Link> . Products
            </h2>
            <div className="products-tiles-grid">
                {tiles.map((tile, index) => (
                    <div
                        key={index}
                        className={`products-tile ${componentVisibility[tile.id] ? "" : "hidden"}`}
                        onClick={() => navigate(tile.link)}
                    >
                        <div className="products-tile-icon" style={{color: tile.color}}>{tile.icon}</div>
                        <h4 className="products-tile-title">{tile.title}</h4>
                        <p className="products-tile-description">{tile.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
