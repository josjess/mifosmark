import React from 'react';
import './Products.css';
import {
    FaPiggyBank, FaWallet, FaChartPie, FaMoneyCheckAlt, FaPercentage, FaBoxes,
    FaUniversity, FaRecycle, FaBalanceScale, FaChartLine
} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';

const Products = () => {
    const navigate = useNavigate();

    const tiles = [
        { title: 'Loan Products', icon: <FaWallet />, description: 'Various loan options', color: '#3498db', link: '#/loan-products' },
        { title: 'Savings Products', icon: <FaPiggyBank />, description: 'Savings schemes', color: '#27ae60', link: '#/savings-products' },
        { title: 'Share Products', icon: <FaChartPie />, description: 'Share options', color: '#8e44ad', link: '#/share-products' },
        { title: 'Charges', icon: <FaMoneyCheckAlt />, description: 'Service fees', color: '#e67e22', link: '#/charges' },
        { title: 'Rates', icon: <FaPercentage />, description: 'Interest rates', color: '#c0392b', link: '#/rates' },
        { title: 'Products Mix', icon: <FaBoxes />, description: 'Combined offerings', color: '#2980b9', link: '#/products-mix' },
        { title: 'Fixed Deposit Products', icon: <FaUniversity />, description: 'Fixed deposits', color: '#f39c12', link: '#/fixed-deposit-products' },
        { title: 'Recurring Deposit Products', icon: <FaRecycle />, description: 'Recurring deposits', color: '#d35400', link: '#/recurring-deposit-products' },
        { title: 'Manage Tax Configurations', icon: <FaBalanceScale />, description: 'Tax settings', color: '#1abc9c', link: '/tax-configurations' },
        { title: 'Floating Rates', icon: <FaChartLine />, description: 'Flexible rates', color: '#9b59b6', link: '/floating-rates' }
    ];

    return (
        <div className="products-page">
            <h2 className="page-heading">
                <Link to="/admin" className="breadcrumb-link">Admin</Link> . Products
            </h2>
            <div className="products-tiles-grid">
                {tiles.map((tile, index) => (
                    <div
                        key={index}
                        className="products-tile"
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
