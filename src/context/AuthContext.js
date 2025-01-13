import React, { createContext, useState, useEffect } from 'react';
import bcrypt from "bcryptjs";

export const AuthContext = createContext();

const AUTH_DURATION_SHORT = 3 * 60 * 60 * 1000;
const AUTH_DURATION_LONG = 10 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [baseURL, setBaseURL] = useState(null);
    const [authInitialized, setAuthInitialized] = useState(false);
    const [isBaseURLChanged, setIsBaseURLChanged] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    const [isSuperAdminFirstLogin, setIsSuperAdminFirstLogin] = useState(false);

    const [superAdmin, setSuperAdmin] = useState(() => {
        const storedAdmin = JSON.parse(localStorage.getItem("superAdmin"));
        return (
            storedAdmin || {
                username: "SuperAdmin",
                password: null,
                securityQuestions: [],
            }
        );
    });

    useEffect(() => {
        const initializeAuth = async () => {
            const savedUser = JSON.parse(localStorage.getItem('user'));
            const savedTimestamp = localStorage.getItem('loginTimestamp');
            const customBaseURL = localStorage.getItem('customBaseURL');

            if (customBaseURL) {
                setBaseURL(customBaseURL);
            }

            if (savedUser && savedTimestamp) {
                const now = new Date().getTime();
                const authDuration = savedUser.rememberMe ? AUTH_DURATION_LONG : AUTH_DURATION_SHORT;

                if (now - savedTimestamp < authDuration) {
                    setIsAuthenticated(true);
                    setUser(savedUser);

                    const remainingTime = authDuration - (now - savedTimestamp);
                    setTimeout(() => {
                        logout(true);
                    }, remainingTime);
                } else {
                    localStorage.removeItem('user');
                    localStorage.removeItem('loginTimestamp');
                }
            }

            if (!superAdmin.password) {
                setIsSuperAdminFirstLogin(true);
            }

            setAuthInitialized(true);
        };

        initializeAuth();
    }, []);

    const login = (userData, rememberMe) => {
        const timestamp = new Date().getTime();
        const authDuration = rememberMe ? AUTH_DURATION_LONG : AUTH_DURATION_SHORT;
        setUser({ ...userData, rememberMe });
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify({ ...userData, rememberMe }));
        localStorage.setItem('loginTimestamp', timestamp);

        setTimeout(() => {
            logout(true);
        }, authDuration);

        setRedirectToLogin(false);
        setIsBaseURLChanged(false);
    };

    const superAdminLogin = async (username, password) => {
        if (username === superAdmin.username) {
            if (isSuperAdminFirstLogin) {
                return { firstLogin: true };
            }

            const isValidPassword = await bcrypt.compare(password, superAdmin.password);
            if (isValidPassword) {

                const superAdminData = {
                    username: superAdmin.username,
                    userId: "1",
                    roles: ["Super Admin"],
                    permissions: ["ALL"],
                    isSuperAdmin: true,
                    authenticated: true,
                };

                login(superAdminData, true);
                return { success: true };
            }

            return { success: false, message: "Invalid Super Admin credentials" };
        }
        return null;
    };

    const updateSuperAdminCredentials = async (username, password, securityQuestions = []) => {
        const hashedSecurityQuestions = await Promise.all(
            securityQuestions.map(async (q) => ({
                question: q.question,
                answer: await bcrypt.hash(q.answer, 10),
            }))
        );

        const updatedAdmin = {
            username: username || superAdmin.username,
            password: password ? await bcrypt.hash(password, 10) : superAdmin.password,
            securityQuestions: hashedSecurityQuestions.length ? hashedSecurityQuestions : superAdmin.securityQuestions,
        };

        setSuperAdmin(updatedAdmin);
        localStorage.setItem("superAdmin", JSON.stringify(updatedAdmin));

        if (username && password && securityQuestions.length > 0) {
            setIsSuperAdminFirstLogin(false);
        }
    };

    const logout = (notify = false) => {
        setUser(null);
        setIsAuthenticated(false);
        setRedirectToLogin(true);
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        if (notify) {
            alert('Your session has expired. Please log in again.');
        }
    };

    const updateBaseURL = (newURL) => {
        setBaseURL(newURL);
        localStorage.setItem('customBaseURL', newURL);
        setIsBaseURLChanged(true);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            login,
            logout,
            baseURL,
            updateBaseURL,
            isBaseURLChanged,
            redirectToLogin,
            authInitialized,
            superAdmin,
            isSuperAdminFirstLogin,
            superAdminLogin,
            updateSuperAdminCredentials,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
