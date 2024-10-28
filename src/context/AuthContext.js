import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AUTH_DURATION = 30 * 60 * 10000;

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        const savedTimestamp = localStorage.getItem('loginTimestamp');

        if (savedUser && savedTimestamp) {
            const now = new Date().getTime();

            if (now - savedTimestamp < AUTH_DURATION) {
                setIsAuthenticated(true);
                setUser(savedUser);

                const remainingTime = AUTH_DURATION - (now - savedTimestamp);
                setTimeout(() => {
                    logout();
                }, remainingTime);
            } else {
                localStorage.removeItem('user');
                localStorage.removeItem('loginTimestamp');
            }
        }
    }, []);

    const login = (userData) => {
        const timestamp = new Date().getTime();
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('loginTimestamp', timestamp);

        setTimeout(() => {
            logout();
        }, AUTH_DURATION);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
