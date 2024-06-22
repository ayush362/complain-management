import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const Admin = () => {
    const [activeComplaints, setActiveComplaints] = useState([]);
    const { user } = useContext(AuthContext);
    const [resolvedComplaints, setResolvedComplaints] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState("");
    const [selectedTechnician, setSelectedTechnician] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    console.log(user);
    // Fetch complaints
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/complaints",
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );
                const data = await response.json();
                setActiveComplaints(
                    data.filter((complaint) => complaint.status !== "resolved")
                );
                setResolvedComplaints(
                    data.filter((complaint) => complaint.status === "resolved")
                );
            } catch (err) {
                setError("Failed to fetch complaints");
            }
        };

        // Fetch technicians
        const fetchTechnicians = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/technicians",
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );
                const data = await response.json();
                setTechnicians(data);
            } catch (err) {
                setError("Failed to fetch technicians");
            }
        };

        fetchComplaints();
        fetchTechnicians();
    }, []);

    // assigning technician to complaint
    const handleAssign = async () => {
        setError("");
        setSuccess("");
        if (!selectedComplaint || !selectedTechnician) {
            setError("Please select a complaint and a technician");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/complaints/${selectedComplaint}/assign`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ technicianId: selectedTechnician }),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            setSuccess("Technician assigned successfully!");

            // Update the status of the assigned complaint locally
            setActiveComplaints(
                activeComplaints.map((complaint) =>
                    complaint.id === selectedComplaint
                        ? { ...complaint, status: "assigned" }
                        : complaint
                )
            );
            setSelectedComplaint(""); // Reset the selected complaint
            setSelectedTechnician(""); // Reset the selected technician
        } catch (err) {
            setError("Failed to assign technician");
        }
    };

    return (
        <section>
            <div className="flex gap-5">
                <div className="w-1/2 py-10 flex flex-col gap-10 bg-white h-[70vh] mt-20 px-32 rounded-3xl text-start">
                    <h2 className="mb-20 text-4xl font-bold text-center">
                        Admin
                    </h2>
                    <h2 className="text-2xl font-serif font-semibold">
                        Assign Technician to Complaint
                    </h2>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                    {/* Display all the compalint */}
                    <div>
                        <label>Select Complaint:</label>
                        <select
                            value={selectedComplaint}
                            onChange={(e) =>
                                setSelectedComplaint(e.target.value)
                            }
                        >
                            <option value="">--Select Complaint--</option>
                            {activeComplaints.map((complaint) => (
                                <option
                                    key={complaint.id}
                                    value={complaint.id}
                                    disabled={complaint.status === "assigned"}
                                >
                                    {complaint.description} ({complaint.status})
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Displays all the techinician */}
                    <div>
                        <label>Select Technician:</label>
                        <select
                            value={selectedTechnician}
                            onChange={(e) =>
                                setSelectedTechnician(e.target.value)
                            }
                        >
                            <option value="">--Select Technician--</option>
                            {technicians.map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                    {tech.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button onClick={handleAssign} className="blue-btn">
                        Assign
                    </button>
                </div>
                {/* Displays All the reslved complaints */}
                <div className="flex flex-col py-10 bg-white mt-20 rounded-3xl px-5">
                    <h2 className="text-center text-2xl font-bold mb-20">
                        Resolved Complaints
                    </h2>
                    <ul className="flex flex-col gap-4 font-serif text-xl">
                        {resolvedComplaints.map((complaint) => (
                            <li key={complaint.id}>
                                {complaint.description} - Status:{" "}
                                <span
                                    className={`${complaint.status}: bg-green-200 ? "" px-2 py-1 rounded-3xl`}
                                >
                                    {complaint.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Admin;
