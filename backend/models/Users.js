import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long."],
        maxlength: [50, "Name cannot exceed 50 characters."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required."],
        unique: true,
        trim: true,
        match: [/^\d{10}$/, "Phone number must be exactly 10 digits."]
    },
    occupation: {
        type: String,
        required: [true, "Occupation is required."],
        trim: true,
    },
    organization: {
        type: String,
        required: [true, "Organization is required."],
        trim: true,
        minlength: [2, "Organization name must be at least 2 characters long."],
        maxlength: [100, "Organization name cannot exceed 100 characters."]
    },
    domains: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.every(item => typeof item === "string");
            },
            message: "Domains must be an array of strings."
        }
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        
    }
}, {
    timestamps: true
});

const user_details = mongoose.model('User', userSchema);
export default user_details;
