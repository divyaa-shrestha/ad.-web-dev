const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Create a new database
let db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the mydatabase.db SQLite database.');
});

// Create a new table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    )`, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Created the users table.');
    });
});

// Endpoint to add a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.get(`SELECT email FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        if (row) {
            res.status(400).send('Email already exists.');
        } else {
            let stmt = db.prepare(`INSERT INTO users (name, email) VALUES (?, ?)`);
            stmt.run(name, email, (err) => {
                if (err) {
                    res.status(400).send(err.message);
                } else {
                    res.status(201).send('User added successfully.');
                }
            });
            stmt.finalize();
        }
    });
});

// Endpoint to get all users
app.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

// Endpoint to update a user by id
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    db.run(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [name, email, id], function (err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        if (this.changes === 0) {
            res.status(404).send('User not found.');
        } else {
            res.status(200).send('User updated successfully.');
        }
    });
});

// Endpoint to delete a user by id
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        if (this.changes === 0) {
            res.status(404).send('User not found.');
        } else {
            res.status(200).send('User deleted successfully.');
        }
    });
});
    

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Close the database when the server is stopped
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});

app.use(express.static('public'));