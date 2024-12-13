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
    const [rememberMe, setRememberMe] = useState(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
    const { showNotification } = useContext(NotificationContext);
    const { login } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        startLoading();
        const loginData = { username, password };

        try {
            const response = await fetch(`${API_CONFIG.baseURL}/authentication`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Fineract-Platform-TenantId": "default",
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();
            if (response.ok) {
                showNotification("Login successful!", "success");

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

                login(userData, rememberMe);
                navigate("/");
            } else {
                showNotification(data.message || "Login failed", "error");
            }
        } catch (err) {
            showNotification("Error connecting to API", "error");
        } finally {
            stopLoading();
        }
    };

    const toggleForgotPasswordModal = () => {
        setIsForgotPasswordModalOpen(!isForgotPasswordModalOpen);
    };

    return (
        <div className="body"
             style={{
                 background: `url(${process.env.PUBLIC_URL}/Images/microfinance.jpg) no-repeat center center/cover`,
             }}
        >
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
                        <div className="form-group-login remember-me">
                            <label htmlFor="rememberMe">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember Me
                            </label>
                        </div>

                        <button type="submit" className="login-btn">
                            Login
                        </button>
                    </form>

                    <p className="forgot-password-link" onClick={toggleForgotPasswordModal}>
                        Forgot Password?
                    </p>
                </section>
            </div>
            {isForgotPasswordModalOpen && (
                <div className="forgot-password-modal">
                    <div className="forgot-password-modal-content">
                        <h2 className="forgot-password-title">Reset Password(Coming Soon!)</h2>
                        {/*<p className="forgot-password-instructions">*/}
                        {/*    Enter your email address below, and we will send you a link to reset your password.*/}
                        {/*</p>*/}
                        {/*<input*/}
                        {/*    type="email"*/}
                        {/*    className="forgot-password-input"*/}
                        {/*    placeholder="Enter your email address"*/}
                        {/*/>*/}
                        <div className="forgot-password-actions">
                            <button
                                className="forgot-password-cancel"
                                onClick={toggleForgotPasswordModal}
                            >
                                Cancel
                            </button>
                            {/*<button className="forgot-password-submit">Submit</button>*/}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
