import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // Focus the input element when the component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/header");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <section className="bg-blue-100">
            <div className="h-screen container mx-auto flex justify-center items-center flex-col">
                <div className="flex gap-10  bg-white w-[1000px] rounded-3xl h-full mb-40 justify-around p-5 mt-32">
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
                                <p className=" justify-center mt-8 text-2xl cursor-pointer poppins-semibold">
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
                            <h2 className="text-center mb-5 mt-  text-6xl font-bold">
                                Sign In
                            </h2>

                            <h2 className="text-center font-semibold text-2xl">
                                Welcome back
                            </h2>
                            <div className="flex gap-6 border-2 py-2 px-3 rounded-3xl w-[70%] self-center">
                                <label>Email:</label>
                                <input
                                    className="bg-transparent border-b-2 border-black w-full"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    ref={inputRef}
                                />
                            </div>
                            <div className="flex gap-2  border-2 py-2 px-3 rounded-3xl w-[70%] self-center">
                                <label>Password:</label>
                                <input
                                    className="bg-transparent border-b-2 border-black"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="blue-btn w-[70%] self-center"
                            >
                                Login
                            </button>
                            <div className="self-center">
                                <p>
                                    Don't have an account?{" "}
                                    <span
                                        onClick={() => navigate("/register")}
                                        className="blue-btn ml-4"
                                    >
                                        Register
                                    </span>
                                </p>
                            </div>
                            {error && (
                                <p
                                    className="text-center text-2xl font-bold"
                                    style={{ color: "red" }}
                                >
                                    {error}
                                </p>
                            )}
                        </form>
                    </div>
                    <div className=" w-1/2">
                        <img
                            src="./login-bg.jpg"
                            alt="hello"
                            className="h-full rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
