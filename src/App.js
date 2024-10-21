import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import { loadConfig } from './config';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Clients from './components/views/Clients';
import Groups from './components/views/Groups';
import Centers from './components/views/Centers';
import Accounting from './components/views/Accounting';
import Reports from './components/views/Reports';
import Admin from './components/views/Admin';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoadingProvider } from './context/LoadingContext';
import Notification from './components/Notification';
import './App.css';
import Navbar from "./components/Navbar";
import LoadingOverlay from "./components/LoadingOverlay";
import Sidebar from "./components/Sidebar";

const App = () => {
    useEffect(() => {
        loadConfig().then();
    }, []);

    const location = useLocation();

    const isLoginPage = location.pathname === '/login';

    return (
        <AuthProvider>
            <LoadingProvider>
                <NotificationProvider>
                    <LoadingOverlay />
                    <Notification />
                    {!isLoginPage && <Navbar />}
                    {!isLoginPage && <Sidebar className="sidebar" />}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/groups" element={<Groups />} />
                        <Route path="/centers" element={<Centers />} />
                        <Route path="/accounting" element={<Accounting />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </NotificationProvider>
            </LoadingProvider>
        </AuthProvider>
    );
};

const AppWrapper = () => {
    return (
        <Router>
            <App />
        </Router>
    );
};

export default AppWrapper;
