// src/controllers/waterLog.controller.ts

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { WaterLog } from '../models/waterLog.model'; // No extension, due to CommonJS setup
import { User } from '../models/user.model'; // No extension

// Helper to get today's date range (start of day to end of day)
const getTodayDateRange = () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    
    return { startOfToday, endOfToday };
};

// POST /api/water/log
export const logWater = async (req: Request, res: Response) => {
    // req.userId is added by the protect middleware
    const userId = req.userId; 
    const { amount } = req.body; // Amount in ml

    if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount or user ID missing.' });
    }

    try {
        const newLog = new WaterLog({
            userId,
            amount,
            // date defaults to now
        });

        await newLog.save();
        res.status(201).json(newLog);

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to log water intake.";
        res.status(500).json({ message: errorMessage });
    }
};

// GET /api/water/daily
export const getDailyLogs = async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'User ID missing.' });
    }

    const { startOfToday, endOfToday } = getTodayDateRange();

    try {
        const logs = await WaterLog.find({
            userId: new mongoose.Types.ObjectId(userId),
            date: {
                $gte: startOfToday, // >= start of day
                $lte: endOfToday    // <= end of day
            }
        }).sort({ date: 1 }); // Sort chronologically

        // Calculate total intake
        const totalIntake = logs.reduce((sum, log) => sum + log.amount, 0);

        // Get user goal for context
        const user = await User.findById(userId).select('dailyGoal');
        const dailyGoal = user?.dailyGoal || 2000;

        res.status(200).json({
            logs,
            totalIntake,
            dailyGoal,
        });

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to retrieve daily logs.";
        res.status(500).json({ message: errorMessage });
    }
};

// PUT /api/water/goal
export const updateGoal = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { newGoal } = req.body;

    if (!userId || !newGoal || newGoal < 100) {
        return res.status(400).json({ message: 'Invalid goal amount.' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { dailyGoal: newGoal },
            { new: true } // Return the updated document
        ).select('dailyGoal email');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Daily goal updated successfully', dailyGoal: user.dailyGoal });

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Failed to update daily goal.";
        res.status(500).json({ message: errorMessage });
    }
};