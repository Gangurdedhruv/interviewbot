import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    occupation: {
        type: String,
        required: true,
        trim: true
    },
    organization: {
        type: String,
        required: true,
        trim: true
    },
    domains: {
        type: [String]
    },
    password: {
        type: String,
        required: true,
    }
}, {
        timestamps: true
});

module.exports = mongoose.model('User', userSchema);