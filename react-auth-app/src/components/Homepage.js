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
        <section className="blue-bg text-white">
            <div className="container py-10 h-full mx-auto">
                <nav className="flex justify-between items-center text-lg">
                    <ul className="flex gap-5">
                        <li>Home</li>
                        <li>Features</li>
                        <li>Team</li>
                    </ul>
                    <div className="text-2xl font-bold">
                        Complaint Management
                    </div>
                    <ul className="flex gap-5">
                        <li>About</li>
                        <li>Instagram</li>
                        <li>Contact</li>
                    </ul>
                </nav>
                <div className="text-center mt-20">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                        Welcome to Accura's <br /> Complain management
                    </h1>
                    <div className="flex items-center justify-center gap-10 text-3xl py-20">
                        <a href="/login" className="blue-btn">
                            Login
                        </a>
                        <a href="/register" className="blue-btn">
                            Register
                        </a>
                    </div>
                    <div className="mt-10">
                        <img
                            src="home-bg.png"
                            alt="talking"
                            className="rounded-2xl mx-auto"
                        />
                    </div>
                    <p className="text-xl md:text-2xl lg:text-3xl mt-10">
                        Experience the ease of handling complaints with Accura's
                        Complaint Management.
                    </p>
                    <a
                        href="/Register"
                        className="mt-5 inline-block blue-btn text-white py-2 px-4 rounded"
                    >
                        Get Started
                    </a>
                </div>
                <div className="mt-20">
                    <h2 className="text-3xl font-bold  text-teal-500">
                        Our Mission
                    </h2>
                    <p className="text-xl md:text-2xl lg:text-3xl mt-5 w-2/6">
                        To provide a seamless and efficient complaint management
                        system from team Accura
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Homepage;
