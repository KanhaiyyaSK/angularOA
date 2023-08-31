const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors());

// Middleware
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "test",
  insecureAuth: true,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// get request
app.get("/getUsers", (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    if (err) throw err;
    return res.json(data);
  });
});

// API Endpoints
app.post("/users", (req, res) => {
  const user = req.body;
  const name = user.name;
  const contactNo = user.contactNo;

  if (name == "") {
    return res.status(400).json({ error: "Name can't be empty" });
  }

  if (user.contactNo.length != 10) {
    return res
      .status(400)
      .json({ error: "phone number should be length of 10" });
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  db.query("INSERT INTO users SET ?", user, (err, result) => {
    if (err) {
      console.error("Error inserting user:", err.message);
      // throw(err);
      res.status(500).send(err);
    } else {
      res.status(201).json({ message: "User added successfully" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
