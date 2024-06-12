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
                    "Authorization": localStorage.getItem("token")
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
            const response = await fetch("http://localhost:5000/user/complaints", {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
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
        <div>
            <h2>Raise Complaint</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {success && <p style={{color: 'green'}}>{success}</p>}
                <button type="submit">Submit</button>
            </form>
            <h2>Your Complaints</h2>
            <ul>
                {complaints.map(complaint => (
                    <li key={complaint.id}>
                        {complaint.description} - Status: {complaint.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NormalUser;
