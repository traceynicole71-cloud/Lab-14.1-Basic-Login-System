const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { hash } = require('bcrypt');

const generateToken = (userId, username) => {
    return jwt.sign(
        { id: userId, username: username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
//check for existing user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        //create new user doc
        const newUser = await User.create({ username, email, password });
        //format response object
        const userResponse = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt
        };

        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const genericErrorMessage = 'Incorrect email or password';

        //search by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: gernericErrorMessage });
        }

        //validate password against hash
        const isMatch = await user.isCorrectPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: genericErrorMessage });
        }

        //issue JWT token after authentication
        const token = gernerateToken(user._id, user.username);

        //respond with user data
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

module.exports = router;