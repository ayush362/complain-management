import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const NormalUser = () => {
    const { user } = useContext(AuthContext);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [complaints, setComplaints] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const response = await fetch("http://localhost:5000/complaints", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ description }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            setDescription(""); // Clear the input field
            setSuccess("Complaint submitted successfully!");
            fetchUserComplaints(); // Fetch complaints after submitting a new one
        } catch (err) {
            setError("Failed to raise complaint");
        }
    };

    const fetchUserComplaints = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/user/complaints",
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            const data = await response.json();
            if (response.ok) {
                setComplaints(data);
            } else {
                setError("Failed to fetch complaints");
            }
        } catch (err) {
            setError("Failed to fetch complaints");
        }
    };

    useEffect(() => {
        fetchUserComplaints();
    }, []);

    return (
        <section className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-col gap-10 mt-20 w-2/3 bg-white rounded-3xl p-20">
                <h2 className="text-center font-bold text-2xl">
                    Raise Complaint
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-5">
                        <label>Description:</label>
                        <textarea
                            className="border-2 border-black"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                    <button type="submit" className="blue-btn mt-5">
                        Submit
                    </button>
                </form>
                <h2 className="text-center font-bold text-2xl">
                    Your Complaints
                </h2>{" "}
                <table>
                    <tr className="flex justify-between text-2xl mb-5">
                        <th className="px-20">Description</th>
                        <th className="px-10">Status</th>
                    </tr>
                    <ul className="text-xl flex flex-col gap-5">
                        {complaints.map((complaint) => (
                            <li key={complaint.id}>
                                <tr className="flex justify-between">
                                    <td className="px-20">
                                        {complaint.description}{" "}
                                    </td>
                                    <td
                                        className={`${
                                            complaint.status === "resolved"
                                                ? "bg-green-200"
                                                : "bg-yellow-200"
                                        } px-2 py-1 rounded-3xl`}
                                    >
                                        {complaint.status}
                                    </td>
                                </tr>
                            </li>
                        ))}
                    </ul>
                </table>
            </div>
        </section>
    );
};

export default NormalUser;
