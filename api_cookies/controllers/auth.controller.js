const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('../db');
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET;

// User registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'User already exists!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Create accessToken with user ID, email, and username
        const accessToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '15m' });

        // Create refreshToken with user ID, email, and username
        const refreshToken = jwt.sign({ id: user.id, username: user.username, email: user.email }, REFRESH_SECRET_KEY, { expiresIn: '24h' });

        // Set the accessToken in an HttpOnly cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000      // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ message: 'Login successful!' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// User logout
router.post('/logout', (req, res) => {
    res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0) });
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
    res.json({ message: 'Logout successful!' });
});


const validateAccesToken = (accessToken) => {
    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        return decoded;
    } catch (err) {
        return null;
    }
};

const validateRefreshToken = (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        return decoded;
    } catch (err) {
        return null;
    }
};

router.post('/refresh-token', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    // Verify the refresh token
    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);

        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            SECRET_KEY,
            { expiresIn: '15m' }
        );

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000
        });

        res.json({ message: 'Access token refreshed!' });
    });
});

router.get('/check-auth', (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        const user = validateRefreshToken(refreshToken);
        if (user) {
            return res.status(200).json({
                id : user.id,
                username: user.username,
                email: user.email,
                isLoggedIn: true
            });
        }
    }
    return res.status(401).json({ isLoggedIn: false });
});

module.exports = router;
