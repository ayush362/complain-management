const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(bodyparser.json());
app.use(cors());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "complain-management",
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
    } else {
        console.log("Connected to the database");
    }
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("Login request:", req.body);
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

        // Return the user object
        const user = results[0];
        res.send({
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
            isTechnician: user.isTechnician,
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
