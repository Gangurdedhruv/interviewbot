import Users from '../models/Users.js'
import bcrypt from 'bcryptjs';

export const register = async(req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        const existingUser = await Users.findOne({ email:email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new Users({ ...req.body, password: hashedPassword });
        await newUser.save();

        console.log('New User:', newUser);
        return res.status(201).json({
            message: 'User successfully registered',
            success: true,
            newUser
        });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({
            success: false,
            message: 'Error occurred',
            error: err.message
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingMail = await Users.findOne({ email });
        if (!existingMail) {
            return res.status(400).json({ message: 'No user with this email' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingMail.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        return res.status(200).json({
            message: 'Login successful',
            success: true
        });
    } catch (err) {
        console.log('Login Error:', err);
        res.status(500).json({
            message: 'Error occurred',
            error: err.message
        });
    }
}