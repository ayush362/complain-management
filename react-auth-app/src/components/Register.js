import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/register",
                { email, password }
            );
            setMessage("Registered successfully");
            setError(""); // Clear error if registration is successful
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error);
            } else {
                setError("Internal server error");
            }
        }
    };

    return (
        <section className="bg-blue-100">
            <div className="h-screen container mx-auto flex justify-center items-center flex-col">
                <div className="flex gap-10  bg-white w-[1000px] rounded-3xl h-full mb-40 justify-around p-5 mt-32">
                    <div className=" w-1/2">
                        <img
                            src="./login-bg.jpg"
                            alt="hello"
                            className="h-full rounded-2xl"
                        />
                    </div>
                    <div className="w-1/2">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-10 text-black"
                        >
                            <div className="flex justify-center items-center">
                                <img
                                    src="./logo.png"
                                    alt="logo"
                                    className="mt-10 ml-5 self-start"
                                />
                                <p className=" justify-center mt-8 text-2xl cursor-pointer  poppins-semibold">
                                    <h2 onClick={() => navigate("/")}>
                                        Welcome to
                                    </h2>
                                    <span
                                        className="text-blue-700 cursor-pointer"
                                        onClick={() => navigate("/")}
                                    >
                                        Accura
                                    </span>
                                </p>
                            </div>
                            <h2 className="text-center font-bold text-6xl">
                                Sign up
                            </h2>
                            <h2 className="text-center font-semibold text-2xl">
                                Get Started
                            </h2>
                            <div className="flex justify-between">
                                <label>Email:</label>
                                <input
                                    className="border-b-2 border-black w-full ml-16"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <label>Password:</label>
                                <input
                                    className="border-b-2 border-black w-full ml-10"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <label>
                                    Confirm Password:&nbsp;&nbsp;&nbsp;&nbsp;
                                </label>
                                <input
                                    className="border-b-2 border-black w-full"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="blue-btn w-[70%] self-center"
                            >
                                Register
                            </button>
                            <p className="self-center">
                                Already a User?{" "}
                                <span
                                    onClick={() => navigate("/login")}
                                    className="ml-5 blue-btn"
                                >
                                    Login
                                </span>
                            </p>
                            {error && (
                                <div
                                    className="text-center text-4xl font-bold"
                                    style={{ color: "red" }}
                                >
                                    {error}
                                </div>
                            )}
                            {message && (
                                <div
                                    className="text-center text-4xl font-bold"
                                    style={{ color: "green" }}
                                >
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;
