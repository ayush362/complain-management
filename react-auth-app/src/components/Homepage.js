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
        <section className="bg-black text-white">
            <div className="container mx-auto flex h-screen justify-around items-center">
                <div>
                    <h1 className="text-8xl font-bold">Welcome</h1>
                </div>
                    <div className="flex gap-10 text-2xl">
                        <a href="/login" className="blue-btn">
                            Login
                        </a>
                        <a href="/register" className="blue-btn">
                            Register
                        </a>
                </div>
            </div>
        </section>
    );
};

export default Homepage;
