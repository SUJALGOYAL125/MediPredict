const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET Login Page
router.get('/login', (req, res) => {
    if (req.session.userId) return res.redirect('/dashboard');
    res.render('login', { error: null });
});

// GET Signup Page
router.get('/signup', (req, res) => {
    if (req.session.userId) return res.redirect('/dashboard');
    res.render('signup', { error: null });
});

// POST Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, age, gender } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { error: 'Email already registered. Please login.' });
        }

        // Create new user
        const user = new User({ name, email, password, age, gender });
        await user.save();

        // Set session
        req.session.userId = user._id;
        req.session.userName = user.name;

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Signup error:', error);
        res.render('signup', { error: 'Something went wrong. Please try again.' });
    }
});

// POST Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'Invalid email or password.' });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password.' });
        }

        // Set session
        req.session.userId = user._id;
        req.session.userName = user.name;

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'Something went wrong. Please try again.' });
    }
});

// GET Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
