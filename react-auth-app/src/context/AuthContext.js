import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if there's a token in localStorage when the app initializes
        const token = localStorage.getItem("token");
        if (token) {
            // Decode the token to get the user details
            const decoded = JSON.parse(atob(token.split(".")[1]));
            console.log("Setting user from localStorage:", decoded); // Log the decoded user details
            setUser(decoded);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                const decoded = JSON.parse(atob(data.token.split(".")[1]));
                console.log("Login successful, setting user:", decoded); // Log the decoded user details
                setUser(decoded);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        console.log("Logging out user:", user); // Log the current user details before logging out
        localStorage.removeItem("token");
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem("token");
    };

    return (
        <AuthContext.Provider
            value={{ user, login,  logout, isAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
