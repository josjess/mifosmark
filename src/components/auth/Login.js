import React, { useState, useContext } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from "../../config";
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import { useLoading } from '../../context/LoadingContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { showNotification } = useContext(NotificationContext);
    const { login } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    const apiAccessUsername = 'mifos';
    const apiAccessPassword = 'password';

    const handleLogin = async (e) => {
        e.preventDefault();
        startLoading();
        const loginData = { username, password };
        const apiCredentials = btoa(`${apiAccessUsername}:${apiAccessPassword}`);

        try {
            const response = await fetch(`${API_CONFIG.baseURL}/authentication`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Fineract-Platform-TenantId': 'default',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();
            if (response.ok) {
                showNotification('Login successful!', 'success');

                const userData = {
                    username: data.username,
                    userId: data.userId,
                    base64EncodedAuthenticationKey: data.base64EncodedAuthenticationKey,
                    authenticated: data.authenticated,
                    officeId: data.officeId,
                    officeName: data.officeName,
                    roles: data.roles,
                    permissions: data.permissions,
                };

                login(userData);

                navigate('/');
            } else {
                showNotification(data.message || 'Login failed', 'error');
            }
        } catch (err) {
            showNotification('Error connecting to API', 'error');
        } finally {
            stopLoading();
        }
    };

    return (
        <div className="body">
            <div className="login-container">
                <header className="login-header">
                    <h1>Welcome Back!</h1>
                    <p>Please log in to continue</p>
                </header>

                <section className="login-form">
                    <form onSubmit={handleLogin}>
                        <div className="form-group-login">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group-login">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="login-btn">
                            Login
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default Login;
