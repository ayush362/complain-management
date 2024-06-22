import React, { useState, useEffect } from "react";

const Technician = () => {
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [resolvedComplaints, setResolvedComplaints] = useState([]);
    const [error, setError] = useState("");
    const [photo, setPhoto] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    // It will fetch all the complaints to the user
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/technician/complaints",
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );
                const data = await response.json();
                setAssignedComplaints(
                    data.filter((complaint) => complaint.status === "assigned")
                );
                setResolvedComplaints(
                    data.filter((complaint) => complaint.status === "resolved")
                );
            } catch (err) {
                setError("Failed to fetch complaints");
            }
        };

        fetchComplaints();
    }, []);
    // it will fetch all the resolved compalints
    const handleResolve = async (complaintId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/complaints/${complaintId}/resolve`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ resolutionPhoto: photo }),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            setSuccess("Complaint resolved successfully!");
            setAssignedComplaints(
                assignedComplaints.filter(
                    (complaint) => complaint.id !== complaintId
                )
            );
            setResolvedComplaints([
                ...resolvedComplaints,
                {
                    id: complaintId,
                    description: selectedComplaint.description,
                    status: "resolved",
                },
            ]);
            setPhoto(""); // Reset the photo URL input
            setSelectedComplaint(null); // Reset the selected complaint
        } catch (err) {
            setError("Failed to resolve complaint");
        }
    };

    return (
        <section className="flex gap-10 ">
            <div className="flex flex-col bg-white  py-20 w-2/3 px-20 mt-20 rounded-3xl justify-center">
                <h2 className="mb-20 text-center font-bold text-2xl">
                    Assigned Complaints
                </h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}
                <ul className="flex flex-col gap-10">
                    {assignedComplaints.map((complaint) => (
                        <li key={complaint.id} className="flex flex-col gap-10">
                            <span className="text-xl font-sans">
                                {complaint.description} (Status:{" "}
                                {complaint.status})
                            </span>
                            <button
                                onClick={() => setSelectedComplaint(complaint)}
                                className="blue-btn"
                            >
                                Resolve
                            </button>
                        </li>
                    ))}
                </ul>
                {selectedComplaint && (
                    <div className="mt-10 text-2xl flex flex-col gap-10">
                        <h3 className="text-center mb-10">Resolve Complaint</h3>
                        <input
                            className="border-2"
                            type="text"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            placeholder="Photo URL:"
                        />
                        <button
                            onClick={() => handleResolve(selectedComplaint.id)}
                            className="blue-btn"
                        >
                            Submit Resolution
                        </button>
                    </div>
                )}
            </div>
            <div className="bg-white rounded-3xl py-24 px-28 mt-20">
                <h2 className="mb-10 font-bold text-center text-2xl">
                    Resolved Complaints
                </h2>
                <ul className="flex flex-col gap-5 text-xl">
                    {resolvedComplaints.map((complaint) => (
                        <li key={complaint.id}>
                            {complaint.description} (Status: {complaint.status})
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Technician;
