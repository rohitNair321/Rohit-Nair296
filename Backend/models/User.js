const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: function () {
            // Password is required only if the user is not a Google login user
            return !this.isGoogleUser;
        },
        validate: {
            validator: function (value) {
                // Only validate minlength if the user is not a Google login user
                if (!this.isGoogleUser && (!value || value.length < 6)) {
                    return false;
                }
                return true;
            },
            message: 'Password must be at least 6 characters long'
        }
    },
    isGoogleUser: {
        type: Boolean,
        default: false // Default to false for normal users
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving (only for non-Google users)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isGoogleUser) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);