// src/routes/waterLog.routes.ts

import { Router } from 'express';
import { protect } from '../middleware/auth.middleware'; // No extension
import { logWater, getDailyLogs, updateGoal } from '../controllers/waterLog.controller'; // No extension

const router = Router();

// Apply the protect middleware to ALL routes in this file
router.use(protect);

// POST /api/water/log - Logs a new water intake entry
router.post('/log', logWater);

// GET /api/water/daily - Retrieves all logs for the current day and total intake
router.get('/daily', getDailyLogs);

// PUT /api/water/goal - Updates the user's daily hydration goal
router.put('/goal', updateGoal);

export default router;