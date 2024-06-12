import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    if (user) {
        navigate("/header");
    }
    return (
        <div>
            welcome buddy
            <a href="/login">Login</a>
            <br />
            <br />
            <a href="/register">Register</a>
        </div>
    );
};

export default Homepage;