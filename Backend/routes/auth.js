const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');
const { OAuth2Client } = require('google-auth-library');

// Google OAuth2 client
const client = new OAuth2Client('299729034520-75lboo1n2s1kbuelmtujp094o2i0el9j.apps.googleusercontent.com');

//#region Register route
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
            });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            username,
            email,
            password
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});
//#endregion

//#region Normal Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response with token
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
});
//#endregion

//#region Google Login route
router.post('/google-login', async (req, res) => {
    const idToken  = req?.body?.idToken?.credential;

    try {
        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: '299729034520-75lboo1n2s1kbuelmtujp094o2i0el9j.apps.googleusercontent.com' // Replace with your Google Client ID
        });

        const payload = ticket.getPayload();
        const { email, given_name: firstName, family_name: lastName } = payload;

        // Check if the user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user if not found
            user = new User({
                firstName,
                lastName,
                username: email.split('@')[0], // Use email prefix as username
                email,
                password: '', // No password for Google login users
                isGoogleUser: true // Mark as a Google login user
            });

            await user.save();
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response with token and user details
        res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken,
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(401).json({ success: false, message: 'Invalid Google token' });
    }
});
//#endregion

//#region Logout route
router.post('/logout', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        
        // Add token to blacklist
        await BlacklistedToken.create({ token });
        
        res.status(200).json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error during logout',
            error: error.message 
        });
    }
});
//#endregion

module.exports = router;