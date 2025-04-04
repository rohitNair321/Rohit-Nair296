const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');

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

//#region Login route
router.post('/login', async (req, res) => {
    try {
        console.log('Login request body:', req.body); // Add this for debugging

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'username and password are required'
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
        console.error('Login error:', error); // Add this for debugging
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
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

//#region Update user profile route
router.put('/update-profile', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const { firstName, lastName } = req.body;

        // Validate fields
        if (!firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'First name and last name are required'
            });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            decoded.userId,
            { 
                firstName, 
                lastName 
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                username: updatedUser.username,
                email: updatedUser.email
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
});
//#endregion

module.exports = router;