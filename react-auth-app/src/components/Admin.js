import React, { useState, useEffect } from "react";

const Admin = () => {
    const [activeComplaints, setActiveComplaints] = useState([]);
    const [resolvedComplaints, setResolvedComplaints] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState("");
    const [selectedTechnician, setSelectedTechnician] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch complaints
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch("http://localhost:5000/complaints", {
                    headers: {
                        "Authorization": localStorage.getItem("token"),
                    },
                });
                const data = await response.json();
                setActiveComplaints(data.filter(complaint => complaint.status !== 'resolved'));
                setResolvedComplaints(data.filter(complaint => complaint.status === 'resolved'));
            } catch (err) {
                setError("Failed to fetch complaints");
            }
        };

        // Fetch technicians
        const fetchTechnicians = async () => {
            try {
                const response = await fetch("http://localhost:5000/technicians", {
                    headers: {
                        "Authorization": localStorage.getItem("token"),
                    },
                });
                const data = await response.json();
                setTechnicians(data);
            } catch (err) {
                setError("Failed to fetch technicians");
            }
        };

        fetchComplaints();
        fetchTechnicians();
    }, []);

    // Handle assigning technician to complaint
    const handleAssign = async () => {
        setError("");
        setSuccess("");
        if (!selectedComplaint || !selectedTechnician) {
            setError("Please select a complaint and a technician");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/complaints/${selectedComplaint}/assign`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                },
                body: JSON.stringify({ technicianId: selectedTechnician }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            setSuccess("Technician assigned successfully!");
            
            // Update the status of the assigned complaint locally
            setActiveComplaints(activeComplaints.map(complaint => 
                complaint.id === selectedComplaint ? { ...complaint, status: 'assigned' } : complaint
            ));
            setSelectedComplaint(""); // Reset the selected complaint
            setSelectedTechnician(""); // Reset the selected technician
        } catch (err) {
            setError("Failed to assign technician");
        }
    };

    return (
        <div>
            <h2>Assign Technician to Complaint</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <div>
                <label>Select Complaint:</label>
                <select
                    value={selectedComplaint}
                    onChange={(e) => setSelectedComplaint(e.target.value)}
                >
                    <option value="">--Select Complaint--</option>
                    {activeComplaints.map((complaint) => (
                        <option 
                            key={complaint.id} 
                            value={complaint.id} 
                            disabled={complaint.status === 'assigned'}
                        >
                            {complaint.description} ({complaint.status})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Select Technician:</label>
                <select
                    value={selectedTechnician}
                    onChange={(e) => setSelectedTechnician(e.target.value)}
                >
                    <option value="">--Select Technician--</option>
                    {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                            {tech.email}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleAssign}>Assign</button>

            <h2>Resolved Complaints</h2>
            <ul>
                {resolvedComplaints.map((complaint) => (
                    <li key={complaint.id}>
                        {complaint.description} - Status: {complaint.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;
