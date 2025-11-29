// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model'; 
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

// --- Utility Function to Generate JWT ---
const generateToken = (userId: mongoose.Types.ObjectId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
};

// --- Controller Functions ---

export const register = async (req: Request, res: Response) => {
    const { email, password, dailyGoal } = req.body;

    try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the new user instance
        const newUser = new User({
            email,
            password: hashedPassword,
            dailyGoal: dailyGoal || 2000, // Use provided goal or default to 2000ml
        });

        // 4. Save the user to the database
        await newUser.save();

        // 5. Generate JWT Token
        const token = generateToken(newUser._id);

        // 6. Respond with token and user info (excluding password)
        res.status(201).json({ 
            token, 
            user: { 
                id: newUser._id, 
                email: newUser.email, 
                dailyGoal: newUser.dailyGoal 
            } 
        });


    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Registration failed.";
        res.status(500).json({ message: errorMessage });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials.' });
        }

        // 2. Compare password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials.' });
        }

        // 3. Generate JWT Token
        const token = generateToken(user._id);

        // 4. Respond with token and user info
        res.status(200).json({
            token,
            user: { 
                id: user._id, 
                email: user.email, 
                dailyGoal: user.dailyGoal 
            }
        });

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Login failed.";
        res.status(500).json({ message: errorMessage });
    }
};