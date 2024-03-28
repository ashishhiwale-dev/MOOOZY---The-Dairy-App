const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [32, 'Password cannot exceed 32 characters'],
    },
    phoneNumber: {
        type: Number,
        required: [true, 'Please add a phone number'],
        minlength: [10, 'Phone number must be 10 digits long'],
        maxlength: [10, 'Phone number must be 10 digits long'],
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
    },
    selectedLocation: {
        type: String,
        required: [true, 'Please select a location'],
    },
    role: {
        type: String,
        enum: ['seller', 'buyer'], // Define allowed roles
        default: 'seller',
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
