import express from 'express';
import Users from '../models/Users.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Registration Route
router.post('/registration', async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new Users({ name, email, password: hashedPassword });
    await newUser.save();

    console.log('New User:', newUser);

    return res.status(201).json({ message: 'User successfully registered', success: true, newUser });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'Error occurred', error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
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

    return res.status(200).json({ message: 'Login successful', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error occurred', error: error.message });
  }
});

export default router;
