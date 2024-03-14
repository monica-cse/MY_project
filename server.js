// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Open database connection
const db = new sqlite3.Database('./users.db');

// Create users table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        age INTEGER,
        dob TEXT
    )`);
});

// Endpoint to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, age, dob } = req.body;

    // Insert data into database
    db.run(`INSERT INTO users (name, email, age, dob) VALUES (?, ?, ?, ?)`, [name, email, age, dob], function(err) {
        if (err) {
            console.error(err.message);
            res.json({ success: false });
        } else {
            console.log(`User ${this.lastID} inserted successfully`);
            res.json({ success: true });
        }
    });
});

// Endpoint to retrieve user data
app.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
