import User from '../models/Users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '../utils/sendEmail.js';

// Request Password Reset
export const requestPasswordReset = async (req, res) => {
  try {
    const email = req.body.email;
    
    // Check if user exists with this email
    const user = await User.findOne({ email:email });

    // Generate a secure token using JWT
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_RESET_SECRET || 'reset-token-secret',
      { expiresIn: '10m' } // Token valid for 10 minutes
    );
    
    // Save the token hash in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `http://localhost:5000/api/users/reset-password/${resetToken}`;
    
    // Send email with reset link
    // Uncomment when email service is configured
   await sendPasswordResetEmail(user.email, resetUrl);

    // For now, log the reset URL (in production, you'd send this via email)
    console.log('Password reset URL:', resetUrl);
    
    res.status(200).json({
      success: true,
      message: 'If your email exists in our system, you will receive a password reset link'
    });
    
  } catch (error) {
    console.error('Password reset request error:', error);
    // For security reasons, don't reveal if the email exists or not
    return res.status(200).json({ 
      success: true, 
      message: 'If your email exists in our system, you will receive a password reset link' 
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    // Get token from params
    const token = req.params.token;
    const { password } = req.body;
    
    // Find user with token and check if token is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired'
      });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Set new password
    user.password = hashedPassword;
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password'
    });
  }
};