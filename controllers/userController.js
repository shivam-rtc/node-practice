const sql = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwt_secret_key = process.env.jwt_secret_key;
const userController = {
    signup: async (req, res) => {
        try {
            const { name, email, password, gender } = req.body;
            if (!name || !email || !password || !gender) {
                return res.status(400).json({ message: 'all form field is required.' })
            }

            // Check if user already exists in DB
            const query = 'SELECT * FROM student WHERE email = ?';
            const [rows] = await sql.promise().query(query, [email]);

            if (rows.length > 0) {
                console.log('User already exists');
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password (ensure you have a hashing function like bcrypt)
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user into the database
            const insertQuery = 'INSERT INTO student (name, email, password, gender) VALUES (?, ?, ?, ?)';
            const response = await sql.promise().query(insertQuery, [name, email, hashedPassword, gender]);
            // create token
            const token = await jwt.sign({ id: response.insertId, name: name }, jwt_secret_key, { expiresIn: '1h' });
            res.status(201).json({ message: 'User signed up successfully', success: true, token: token });
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ message: 'Signup failed' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            const query = 'select * from student where email = ? ';
            const [rows] = await sql.promise().query(query, [email]);
            const user = rows[0];

            if (rows.length === 0) return res.status(409).json({ message: 'user not exist' });
            passwordMatch = await bcrypt.compare(password, user.password);

            const token = await jwt.sign({ id: user.id, name: user.name }, jwt_secret_key, { expiresIn: '1h' });

            res.status(200).json({ message: 'user logged in successfuly', token: token });
        } catch (error) {
            return res.status(500).json({ message: 'User login failed' });
        }
    },

    user: async (req, res) => {
        try {
            const query = 'select * from student';
            const [row] = await sql.promise().query(query);
            res.send(row);
        } catch (error) {
            res.status(400).json('something is wrong')
        }
    },
}
module.exports = userController;
