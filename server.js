const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5000;

const JWT_SECRET = "12345678";
app.use(bodyparser.json());
app.use(cors());
// Creating the connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "complain-management",
});
// Connection to the Database

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
    } else {
        console.log("Connected to the database");
    }
});
// The login for verification token using jwt
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send({ error: "No token provided" });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res
                .status(500)
                .send({ error: "Failed to authenticate token" });
        }
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        req.isAdmin = decoded.isAdmin;
        req.isTechnician = decoded.isTechnician;
        next();
    });
};
app.get("/", (req, res) => {
    res.send("Server is ready");
});
// Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .send({ error: "Email and password are required" });
    }

    const query = "SELECT * FROM user WHERE email = ? AND password = ?";
    connection.query(query, [email, password], (err, results) => {
        if (err) {
            console.error("Error querying MySQL:", err);
            return res.status(500).send({ error: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(401).send({ error: "Invalid email or password" });
        }

        const user = results[0];
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin,
                isTechnician: user.isTechnician,
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.send({ token });
    });
});
// Register Route
app.post("/register", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .send({ error: "Email and password are required" });
    }

    // Check if the user already exists
    const checkUserQuery = "SELECT * FROM user WHERE email = ?";
    connection.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            console.error("Error querying MySQL:", err);
            return res.status(500).send({ error: "Internal server error" });
        }

        if (results.length > 0) {
            return res.status(400).send({ error: "User already exists" });
        }

        // If user does not exist, insert new user
        const insertUserQuery =
            "INSERT INTO user (email, password) VALUES (?, ?)";
        connection.query(insertUserQuery, [email, password], (err, result) => {
            if (err) {
                console.error("Error inserting into MySQL:", err);
                return res.status(500).send({ error: "Internal server error" });
            }

            res.send({
                message: "User registered successfully",
                userId: result.insertId,
            });
        });
    });
});

// app.get("/protected", verifyToken, (req, res) => {
//     res.send({ message: "This is a protected route", user: req.userId });
// });

// Complaints routes
// Insert the compaints in the database
app.post("/complaints", verifyToken, (req, res) => {
    const { description } = req.body;
    const userId = req.userId;
    const query = "INSERT INTO complaints (user_id, description) VALUES (?, ?)";
    connection.query(query, [userId, description], (err, result) => {
        if (err)
            return res.status(500).send({ error: "Internal server error" });
        res.send({ id: result.insertId });
    });
});

// Fetch the complains
app.get("/complaints", verifyToken, (req, res) => {
    if (!req.isAdmin) return res.status(403).send({ error: "Unauthorized" });
    const query = "SELECT * FROM complaints";
    connection.query(query, (err, results) => {
        if (err)
            return res.status(500).send({ error: "Internal server error" });
        res.send(results);
    });
});
// Assinging the complain using techinician id
app.put("/complaints/:id/assign", verifyToken, (req, res) => {
    if (!req.isAdmin) return res.status(403).send({ error: "Unauthorized" });
    const { technicianId } = req.body;
    const complaintId = req.params.id;
    const query =
        "UPDATE complaints SET technician_id = ?, status = 'assigned' WHERE id = ?";
    connection.query(query, [technicianId, complaintId], (err) => {
        if (err)
            return res.status(500).send({ error: "Internal server error" });
        res.send({ message: "Technician assigned successfully" });
    });
});
// Resolving the complain from techinician side
app.put("/complaints/:id/resolve", verifyToken, (req, res) => {
    if (!req.isTechnician)
        return res.status(403).send({ error: "Unauthorized" });
    const complaintId = req.params.id;
    const { resolutionPhoto } = req.body; // This should be the URL of the uploaded photo
    const query =
        "UPDATE complaints SET resolution_photo = ?, status = 'resolved' WHERE id = ?";
    connection.query(query, [resolutionPhoto, complaintId], (err) => {
        if (err)
            return res.status(500).send({ error: "Internal server error" });
        res.send({ message: "Complaint resolved successfully" });
    });
});
// Approving the complain
app.put("/complaints/:id/approve", verifyToken, (req, res) => {
    if (!req.isAdmin) return res.status(403).send({ error: "Unauthorized" });
    const complaintId = req.params.id;
    const query = "UPDATE complaints SET status = 'approved' WHERE id = ?";
    connection.query(query, [complaintId], (err) => {
        if (err)
            return res.status(500).send({ error: "Internal server error" });
        res.send({ message: "Complaint approved successfully" });
    });
});
// Fetching the details of the techinician
app.get("/technicians", (req, res) => {
    const query = "SELECT id, email FROM user WHERE isTechnician = 1";
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error querying MySQL:", err);
            return res.status(500).send({ error: "Internal server error" });
        }
        res.send(results);
    });
});
// Fetching the complaints assigned to the particular techinician
app.get("/technician/complaints", verifyToken, (req, res) => {
    if (!req.isTechnician)
        return res.status(403).send({ error: "Unauthorized" });
    const technicianId = req.userId;
    const query = "SELECT * FROM complaints WHERE technician_id = ?";
    connection.query(query, [technicianId], (err, results) => {
        if (err)
            return res.status(500).send({ error: "Internal server error" });
        res.send(results);
    });
});
// Add this route to fetch complaints for a specific user
app.get("/user/complaints", verifyToken, (req, res) => {
    const userId = req.userId; // Get the user ID from the token
    const query = "SELECT * FROM complaints WHERE user_id = ?";
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error querying MySQL:", err);
            return res.status(500).send({ error: "Internal server error" });
        }
        res.send(results);
    });
});
// this route to fetch resolved complaints for admin
app.get("/admin/resolved-complaints", verifyToken, (req, res) => {
    if (!req.isAdmin) return res.status(403).send({ error: "Unauthorized" });
    const query = "SELECT * FROM complaints WHERE status = 'resolved'";
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error querying MySQL:", err);
            return res.status(500).send({ error: "Internal server error" });
        }
        res.send(results);
    });
});

//   fetch resolved complaints for technician
app.get("/technician/resolved-complaints", verifyToken, (req, res) => {
    if (!req.isTechnician)
        return res.status(403).send({ error: "Unauthorized" });
    const query =
        "SELECT * FROM complaints WHERE status = 'resolved' AND technician_id = ?";
    connection.query(query, [req.userId], (err, results) => {
        if (err) {
            console.error("Error querying MySQL:", err);
            return res.status(500).send({ error: "Internal server error" });
        }
        res.send(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
