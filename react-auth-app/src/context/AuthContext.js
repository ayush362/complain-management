// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
