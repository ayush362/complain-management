import React, { useState, useEffect } from "react";

const Technician = () => {
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [resolvedComplaints, setResolvedComplaints] = useState([]);
    const [error, setError] = useState("");
    const [photo, setPhoto] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch("http://localhost:5000/technician/complaints", {
                    headers: {
                        "Authorization": localStorage.getItem("token"),
                    },
                });
                const data = await response.json();
                setAssignedComplaints(data.filter(complaint => complaint.status === 'assigned'));
                setResolvedComplaints(data.filter(complaint => complaint.status === 'resolved'));
            } catch (err) {
                setError("Failed to fetch complaints");
            }
        };

        fetchComplaints();
    }, []);

    const handleResolve = async (complaintId) => {
        try {
            const response = await fetch(`http://localhost:5000/complaints/${complaintId}/resolve`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                },
                body: JSON.stringify({ resolutionPhoto: photo }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            setSuccess("Complaint resolved successfully!");
            setAssignedComplaints(assignedComplaints.filter(complaint => complaint.id !== complaintId));
            setResolvedComplaints([...resolvedComplaints, { id: complaintId, description: selectedComplaint.description, status: 'resolved' }]);
            setPhoto(""); // Reset the photo URL input
            setSelectedComplaint(null); // Reset the selected complaint
        } catch (err) {
            setError("Failed to resolve complaint");
        }
    };

    return (
        <div>
            <h2>Assigned Complaints</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <ul>
                {assignedComplaints.map((complaint) => (
                    <li key={complaint.id}>
                        {complaint.description} (Status: {complaint.status})
                        <button onClick={() => setSelectedComplaint(complaint)}>Resolve</button>
                    </li>
                ))}
            </ul>
            <h2>Resolved Complaints</h2>
            <ul>
                {resolvedComplaints.map((complaint) => (
                    <li key={complaint.id}>
                        {complaint.description} (Status: {complaint.status})
                    </li>
                ))}
            </ul>
            {selectedComplaint && (
                <div>
                    <h3>Resolve Complaint</h3>
                    <input
                        type="text"
                        value={photo}
                        onChange={(e) => setPhoto(e.target.value)}
                        placeholder="Photo URL"
                    />
                    <button onClick={() => handleResolve(selectedComplaint.id)}>Submit Resolution</button>
                </div>
            )}
        </div>
    );
};

export default Technician;
