import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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

const user_details = mongoose.model('User', userSchema);
export default user_details