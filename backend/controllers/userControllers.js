import Users from '../models/Users.js'
import bcrypt from 'bcryptjs';

export const register = async(req, res) => {
    try {
        // console.log("Body from action:",req.body);
        const { email, phone, password } = req.body;

        const existingEmail = await Users.findOne({ email:email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Account with this email exists' });
        }
        const existingPhone = await Users.findOne({ phone:phone });
        if (existingPhone) {
            return res.status(400).json({ success: false, message: 'Account with this phone number exists' });
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
            message: err.message
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingMail = await Users.findOne({ email:email });
        if (!existingMail) {
            return res.status(400).json({ success: false, message: 'Email not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, existingMail.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        return res.status(200).json({
            message: 'Login successful',
            success: true
        });
    } catch (err) {
        console.log('Login Error:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}