const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('../db');
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET;


router.post('/add-categorie', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required.' });
    }

    try{
        const [result] = await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Categorie created successfully!', categoryId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }

});


router.get('/get-categorie/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching categorie:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

router.get('/all-categories', async (req, res) => {
    try {
        const [result] = await db.execute('SELECT * FROM categories');
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
