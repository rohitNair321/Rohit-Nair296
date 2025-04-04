const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        
        // Check if token is blacklisted
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            throw new Error('Token is invalid');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};