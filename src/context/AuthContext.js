import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AUTH_DURATION_SHORT = 3 * 60 * 60 * 1000;
const AUTH_DURATION_LONG = 10 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [baseURL, setBaseURL] = useState(null);
    const [authInitialized, setAuthInitialized] = useState(false);

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
    };

    const logout = (notify = false) => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        if (notify) {
            alert('Your session has expired. Please log in again.');
        }
    };

    const updateBaseURL = (newURL) => {
        setBaseURL(newURL);
        localStorage.setItem('customBaseURL', newURL);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, baseURL, updateBaseURL, authInitialized }}>
            {children}
        </AuthContext.Provider>
    );
};
